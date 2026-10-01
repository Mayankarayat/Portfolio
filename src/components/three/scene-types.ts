import type { RenderTier } from "@/lib/render-tier";

export interface SceneOptions {
  tier: Exclude<RenderTier, "none">;
  onContextLost?: () => void;
  /** Called when the device can't sustain the scene even at minimum quality. */
  onUnderperform?: () => void;
}

/** Contract every lazily-loaded WebGL scene implements. */
export interface SceneHandle {
  /** Scroll-driven progress; meaning and range are scene-specific. */
  setProgress(progress: number): void;
  /** Pause/resume rendering (off-screen, hidden tab). Scenes start paused. */
  setActive(active: boolean): void;
  dispose(): void;
  /** Optional: resolves when the scene has something worth showing (no empty first frame). */
  ready?: Promise<void>;
}
