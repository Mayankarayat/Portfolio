"use client";

import { useEffect, useRef } from "react";
import type { StoryMedia } from "./story-scene";
import { useProgressiveScene } from "./useProgressiveScene";

/**
 * Live 3D layer for the story section. Until it is ready (or on devices that
 * don't get it) the section shows its server-rendered poster stills; once live
 * it flags the section so those stills fade out beneath the canvas.
 */
export function StoryScene({ media }: { media: readonly StoryMedia[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useProgressiveScene(canvasRef, {
    load: () =>
      import("./story-scene").then((m) => (canvas, options) => {
        // Reuse the optimised (AVIF/WebP) stills the browser already fetched for
        // the poster layer instead of downloading the source JPEGs again.
        const posters = canvas.closest("section")?.querySelectorAll<HTMLImageElement>(".story-poster img");
        const resolved = media.map((m, i) => ({ ...m, poster: posters?.[i]?.currentSrc || m.poster }));
        return m.createStory(canvas, options, resolved);
      }),
    progress: (rect, vh) => -rect.top / Math.max(1, vh),
    bootMargin: "0px",
  });

  useEffect(() => {
    const section = canvasRef.current?.closest("section");
    if (section) section.dataset.story = state;
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-state={state}
      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out data-[state=live]:opacity-100"
    />
  );
}
