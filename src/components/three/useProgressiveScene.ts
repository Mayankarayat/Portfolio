"use client";

import { useEffect, useState, type RefObject } from "react";
import { detectRenderTier, type RenderTier } from "@/lib/render-tier";
import type { SceneHandle, SceneOptions } from "./scene-types";

export type SceneState = "poster" | "live";

type SceneFactory = (canvas: HTMLCanvasElement, options: SceneOptions) => SceneHandle;

interface ProgressiveSceneConfig {
  /** Dynamic import of the scene module — keeps three.js off the critical path. */
  load: () => Promise<SceneFactory>;
  /** Maps the host section's bounding rect to the scene's progress value. */
  progress: (rect: DOMRect, viewportHeight: number) => number;
  /** How close (CSS margin) the section must be before the scene is booted. */
  bootMargin?: string;
}

const OVERRIDES: Record<string, RenderTier> = { off: "none", low: "low", high: "high" };

/** QA escape hatch: `?scene=off|low|high` bypasses capability detection. */
function readOverride(): RenderTier | undefined {
  const value = new URLSearchParams(window.location.search).get("scene");
  return value ? OVERRIDES[value] : undefined;
}

/**
 * Lifecycle for a progressively-enhanced WebGL scene living inside a <section>:
 *
 * 1. Static imagery renders first; nothing here runs before hydration.
 * 2. After `load` + idle, and only once the section is near the viewport,
 *    capable devices dynamically import and create the scene.
 * 3. Rendering pauses off-screen / in hidden tabs; the scene tears down (back
 *    to static imagery) on reduced motion, context loss or poor performance.
 */
export function useProgressiveScene(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { load, progress, bootMargin = "50% 0px" }: ProgressiveSceneConfig,
): SceneState {
  const [state, setState] = useState<SceneState>("poster");

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest("section");
    if (!canvas || !section) return;

    const override = readOverride();
    if (override === "none") return;
    // Cheap signals can rule the scene out immediately; the WebGL probe waits for idle.
    if (!override && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let handle: SceneHandle | null = null;
    let cancelled = false;
    let inView = false;
    const cleanups: Array<() => void> = [];

    const syncActive = () => handle?.setActive(inView && document.visibilityState === "visible");

    const teardown = () => {
      cleanups.splice(0).forEach((fn) => fn());
      handle?.dispose();
      handle = null;
      setState("poster");
    };

    const boot = async (tier: Exclude<RenderTier, "none">) => {
      const factory = await load();
      if (cancelled) return;
      try {
        // A forced tier (QA) keeps running even on slow/software renderers.
        handle = factory(canvas, { tier, onContextLost: teardown, onUnderperform: override ? undefined : teardown });
      } catch {
        return; // WebGL creation can still fail (blocklisted GPU); imagery remains.
      }
      await handle.ready;
      if (cancelled || !handle) return;
      setState("live");

      const updateProgress = () => handle?.setProgress(progress(section.getBoundingClientRect(), window.innerHeight));
      updateProgress();
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("resize", updateProgress);
      });

      const visibility = new IntersectionObserver(([entry]) => {
        inView = entry?.isIntersecting ?? false;
        syncActive();
      });
      visibility.observe(section);
      cleanups.push(() => visibility.disconnect());

      document.addEventListener("visibilitychange", syncActive);
      cleanups.push(() => document.removeEventListener("visibilitychange", syncActive));

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onMotionChange = () => motionQuery.matches && teardown();
      motionQuery.addEventListener("change", onMotionChange);
      cleanups.push(() => motionQuery.removeEventListener("change", onMotionChange));
    };

    // Boot once the page has loaded, the main thread is idle and the section is near.
    let nearObserver: IntersectionObserver | null = null;
    const whenNear = () => {
      const tier = override ?? detectRenderTier();
      if (tier === "none" || cancelled) return;
      nearObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          nearObserver?.disconnect();
          void boot(tier);
        },
        { rootMargin: bootMargin },
      );
      nearObserver.observe(section);
    };

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(whenNear, { timeout: 2500 });
      } else {
        timeoutId = window.setTimeout(whenNear, 600);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      nearObserver?.disconnect();
      cleanups.splice(0).forEach((fn) => fn());
      handle?.dispose();
    };
    // Config is static per call site; the scene boots exactly once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
