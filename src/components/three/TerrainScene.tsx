"use client";

import { useRef } from "react";
import { useProgressiveScene } from "./useProgressiveScene";

/** Live data terrain over the build-time SVG poster in the Work section. */
export function TerrainScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useProgressiveScene(canvasRef, {
    load: () => import("./terrain-scene").then((m) => m.createTerrain),
    // Organic surface resolves into an ordered chart as the section scrolls past.
    progress: (rect, vh) => (vh * 0.75 - rect.top) / Math.max(1, rect.height * 0.75),
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-state={state}
      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out data-[state=live]:opacity-100"
    />
  );
}
