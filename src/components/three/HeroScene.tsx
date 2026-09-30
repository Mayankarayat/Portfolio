"use client";

import { useEffect, useRef, useState } from "react";
import { getRenderTier, readDeviceSignals, type RenderTier } from "@/lib/render-tier";
import type { TerrainHandle } from "./terrain-scene";

type SceneState = "poster" | "live";

const OVERRIDES: Record<string, RenderTier> = { off: "none", low: "low", high: "high" };

/** QA escape hatch: `?scene=off|low|high` bypasses capability detection. */
function readOverride(): RenderTier | undefined {
  const value = new URLSearchParams(window.location.search).get("scene");
  return value ? OVERRIDES[value] : undefined;
}

/**
 * Progressive enhancement layer over the static SVG poster rendered by Hero.
 *
 * 1. The page becomes interactive with zero three.js on the critical path.
 * 2. After `load` + idle, capable devices dynamically import the WebGL scene.
 * 3. Rendering pauses when the hero is off-screen or the tab is hidden, and
 *    tears down if the user switches on reduced motion or the context is lost.
 */
export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<SceneState>("poster");

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero) return;

    const tier = readOverride() ?? getRenderTier(readDeviceSignals());
    if (tier === "none") return;

    let handle: TerrainHandle | null = null;
    let cancelled = false;
    let inView = true;
    const cleanups: Array<() => void> = [];

    const syncActive = () => handle?.setActive(inView && document.visibilityState === "visible");

    const teardown = () => {
      cleanups.splice(0).forEach((fn) => fn());
      handle?.dispose();
      handle = null;
      setState("poster");
    };

    const boot = async () => {
      const { createTerrain } = await import("./terrain-scene");
      if (cancelled) return;
      try {
        handle = createTerrain(canvas, { tier, onContextLost: teardown, onUnderperform: teardown });
      } catch {
        return; // WebGL creation can still fail (blocklisted GPU); poster remains.
      }
      setState("live");

      const updateProgress = () => {
        const rect = hero.getBoundingClientRect();
        handle?.setProgress(-rect.top / Math.max(1, rect.height * 0.7));
      };
      updateProgress();
      window.addEventListener("scroll", updateProgress, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", updateProgress));

      const io = new IntersectionObserver(([entry]) => {
        inView = entry?.isIntersecting ?? true;
        syncActive();
      });
      io.observe(hero);
      cleanups.push(() => io.disconnect());

      document.addEventListener("visibilitychange", syncActive);
      cleanups.push(() => document.removeEventListener("visibilitychange", syncActive));

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onMotionChange = () => motionQuery.matches && teardown();
      motionQuery.addEventListener("change", onMotionChange);
      cleanups.push(() => motionQuery.removeEventListener("change", onMotionChange));
    };

    // Defer until the page has loaded and the main thread is idle.
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => void boot(), { timeout: 2500 });
      } else {
        timeoutId = window.setTimeout(() => void boot(), 600);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      cleanups.splice(0).forEach((fn) => fn());
      handle?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-state={state}
      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out data-[state=live]:opacity-100"
    />
  );
}
