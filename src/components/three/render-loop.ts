import type { WebGLRenderer } from "three";

/**
 * requestAnimationFrame loop shared by the WebGL scenes, with an adaptive
 * quality watchdog: the device pixel ratio steps down when frames are slow,
 * and if even DPR 1 can't hold ~22 fps for two consecutive windows the scene
 * reports `onUnderperform` so the caller can fall back to static imagery.
 */
export interface RenderLoopOptions {
  renderer: WebGLRenderer;
  maxDpr: number;
  /** Re-apply sizing after a DPR change. */
  resize: () => void;
  frame: (deltaMs: number, now: number) => void;
  onUnderperform?: () => void;
}

export interface RenderLoop {
  start(): void;
  stop(): void;
  readonly running: boolean;
}

const SLOW_FRAME_MS = 24;
const FAILING_FRAME_MS = 45;
const WINDOW = 60;

export function createRenderLoop({ renderer, maxDpr, resize, frame, onUnderperform }: RenderLoopOptions): RenderLoop {
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);

  let handle = 0;
  let last = 0;
  let sampled = 0;
  let slow = 0;
  let failing = 0;
  let failingWindows = 0;

  const tick = (now: number) => {
    handle = requestAnimationFrame(tick);
    const delta = Math.min(now - last, 100);
    last = now;

    sampled++;
    if (delta > SLOW_FRAME_MS) slow++;
    if (delta > FAILING_FRAME_MS) failing++;
    if (sampled >= WINDOW) {
      if (slow > WINDOW / 2 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        resize();
      } else if (failing > WINDOW / 2 && dpr <= 1) {
        failingWindows++;
      } else {
        failingWindows = 0;
      }
      sampled = slow = failing = 0;
      if (failingWindows >= 2 && onUnderperform) {
        loop.stop();
        onUnderperform();
        return;
      }
    }

    frame(delta, now);
  };

  const loop: RenderLoop = {
    start() {
      if (handle) return;
      last = performance.now();
      handle = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(handle);
      handle = 0;
    },
    get running() {
      return handle !== 0;
    },
  };
  return loop;
}
