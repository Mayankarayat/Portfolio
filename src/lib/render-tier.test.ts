import { describe, expect, it } from "vitest";
import { getRenderTier, type DeviceSignals } from "./render-tier";

const desktop: DeviceSignals = {
  webgl: true,
  softwareRenderer: false,
  reducedMotion: false,
  saveData: false,
  effectiveType: "4g",
  deviceMemory: 8,
  hardwareConcurrency: 8,
  coarsePointer: false,
  viewportWidth: 1440,
};

describe("getRenderTier", () => {
  it("gives capable desktops the full scene", () => {
    expect(getRenderTier(desktop)).toBe("high");
  });

  it.each<[string, Partial<DeviceSignals>]>([
    ["no WebGL", { webgl: false }],
    ["a software WebGL renderer", { softwareRenderer: true }],
    ["reduced motion", { reducedMotion: true }],
    ["data saver", { saveData: true }],
    ["2g network", { effectiveType: "2g" }],
    ["very low memory", { deviceMemory: 1 }],
  ])("falls back to the static poster with %s", (_, override) => {
    expect(getRenderTier({ ...desktop, ...override })).toBe("none");
  });

  it.each<[string, Partial<DeviceSignals>]>([
    ["touch devices", { coarsePointer: true }],
    ["narrow viewports", { viewportWidth: 390 }],
    ["3g networks", { effectiveType: "3g" }],
    ["4 GiB devices", { deviceMemory: 2 }],
    ["quad-core CPUs", { hardwareConcurrency: 4 }],
  ])("uses the reduced scene on %s", (_, override) => {
    expect(getRenderTier({ ...desktop, ...override })).toBe("low");
  });

  it("does not penalise browsers that hide optional hints", () => {
    expect(getRenderTier({ ...desktop, deviceMemory: undefined, effectiveType: undefined, hardwareConcurrency: undefined })).toBe("high");
  });
});
