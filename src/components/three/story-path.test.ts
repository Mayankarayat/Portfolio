import { describe, expect, it } from "vitest";
import { CAMERA_FOV, FRAME_SIZE, STORY_END, STORY_FRAMES, cameraAt, framePose, scrubAt, type Pose, type StoryFrame, type Vec3 } from "./story-path";

const ASPECTS = { desktop: 16 / 10, phone: 390 / 844 };

/** Project a world point to NDC for a camera looking from pose.position to pose.target. */
function project(pose: Pose, point: Vec3, aspect: number): { x: number; y: number } {
  const [px, py, pz] = pose.position;
  const f = normalize([pose.target[0] - px, pose.target[1] - py, pose.target[2] - pz]);
  const r = normalize(cross(f, [0, 1, 0]));
  const u = cross(r, f);
  const d: Vec3 = [point[0] - px, point[1] - py, point[2] - pz];
  const depth = dot(d, f);
  const t = Math.tan((CAMERA_FOV * Math.PI) / 360);
  return { x: dot(d, r) / (depth * t * aspect), y: dot(d, u) / (depth * t) };
}

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const normalize = (a: Vec3): Vec3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};

function corners(frame: StoryFrame): Vec3[] {
  const { width: w, height: h } = FRAME_SIZE;
  const r = frame.rotationY;
  const right: Vec3 = [Math.cos(r), 0, -Math.sin(r)];
  return [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([sx, sy]) => [
    frame.position[0] + right[0] * (sx! * w) / 2,
    frame.position[1] + (sy! * h) / 2,
    frame.position[2] + right[2] * (sx! * w) / 2,
  ]);
}

describe("story camera path", () => {
  for (const [name, aspect] of Object.entries(ASPECTS)) {
    it(`fill pose covers the whole ${name} viewport`, () => {
      for (const frame of STORY_FRAMES) {
        const pose = framePose(frame, "fill", aspect);
        const pts = corners(frame).map((c) => project(pose, c, aspect));
        expect(Math.min(...pts.map((p) => p.x))).toBeLessThanOrEqual(-1);
        expect(Math.max(...pts.map((p) => p.x))).toBeGreaterThanOrEqual(1);
        expect(Math.min(...pts.map((p) => p.y))).toBeLessThanOrEqual(-1);
        expect(Math.max(...pts.map((p) => p.y))).toBeGreaterThanOrEqual(1);
      }
    });

    it(`card pose keeps the whole frame on the ${name} screen`, () => {
      for (const frame of STORY_FRAMES) {
        const pose = framePose(frame, "card", aspect);
        for (const c of corners(frame)) {
          const p = project(pose, c, aspect);
          expect(Math.abs(p.x)).toBeLessThanOrEqual(1.001);
          expect(Math.abs(p.y)).toBeLessThanOrEqual(1.001);
        }
      }
    });
  }

  it("places desktop cards beside the copy (right half of the screen)", () => {
    const pose = framePose(STORY_FRAMES[1]!, "card", ASPECTS.desktop);
    expect(project(pose, STORY_FRAMES[1]!.position, ASPECTS.desktop).x).toBeCloseTo(0.4, 2);
  });

  it("moves continuously — no jumps between scroll samples", () => {
    let prev = cameraAt(0, ASPECTS.desktop).position;
    for (let p = 0.005; p <= STORY_END; p += 0.005) {
      const next = cameraAt(p, ASPECTS.desktop).position;
      expect(Math.hypot(next[0] - prev[0], next[1] - prev[1], next[2] - prev[2])).toBeLessThan(0.5);
      prev = next;
    }
  });

  it("scrubs the final clip only during the dive", () => {
    expect(scrubAt(2.9)).toBe(0);
    expect(scrubAt(STORY_END)).toBeCloseTo(0.88);
  });
});
