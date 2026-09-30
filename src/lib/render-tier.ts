/**
 * Decides how much of the 3D experience a device should receive.
 * Pure and environment-agnostic so it can be unit tested; the browser
 * adapter lives in `readDeviceSignals`.
 */
export type RenderTier = "none" | "low" | "high";

export interface DeviceSignals {
  webgl: boolean;
  /** WebGL is backed by a CPU rasteriser (SwiftShader, llvmpipe, …). */
  softwareRenderer: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  /** Network Information API effectiveType, when available. */
  effectiveType?: string;
  /** Device Memory API (GiB), when available. */
  deviceMemory?: number;
  hardwareConcurrency?: number;
  coarsePointer: boolean;
  viewportWidth: number;
}

export function getRenderTier(s: DeviceSignals): RenderTier {
  if (!s.webgl || s.softwareRenderer || s.reducedMotion || s.saveData) return "none";
  if (s.effectiveType === "slow-2g" || s.effectiveType === "2g") return "none";
  if (s.deviceMemory !== undefined && s.deviceMemory < 2) return "none";

  const constrained =
    s.coarsePointer ||
    s.viewportWidth < 768 ||
    s.effectiveType === "3g" ||
    (s.deviceMemory !== undefined && s.deviceMemory < 4) ||
    (s.hardwareConcurrency !== undefined && s.hardwareConcurrency <= 4);

  return constrained ? "low" : "high";
}

interface NavigatorWithHints extends Navigator {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
}

const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;

function probeWebGL(): { webgl: boolean; softwareRenderer: boolean } {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return { webgl: false, softwareRenderer: false };
    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return { webgl: true, softwareRenderer: SOFTWARE_RENDERERS.test(renderer) };
  } catch {
    return { webgl: false, softwareRenderer: false };
  }
}

export function readDeviceSignals(): DeviceSignals {
  const nav = navigator as NavigatorWithHints;
  return {
    ...probeWebGL(),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    effectiveType: nav.connection?.effectiveType,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    viewportWidth: window.innerWidth,
  };
}
