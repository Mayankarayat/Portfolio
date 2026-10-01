/**
 * Camera choreography for the story scene, kept free of three.js so it can be
 * unit tested.
 *
 * Progress `p` is measured in viewport heights scrolled into the story section,
 * so chapter `i`'s copy is centred on screen at `p = i`.
 *
 * Landscape screens (16:9 frames):
 *   0      fills the screen with frame 0 (reads as a full-bleed hero)
 *   ~0.5   pulls back to reveal it as a frame floating in space
 *   1..3   flies to each chapter's frame and rests beside its copy
 *   3→3.8  dives into the last frame (the push-in toward the monitor)
 *
 * Portrait screens (9:16 frames, the clips' native framing): every chapter
 * rests full-screen like a story, and the camera pulls far back between
 * chapters so the frames are seen floating in space mid-flight.
 */

export type Vec3 = readonly [number, number, number];

export interface StoryFrame {
  position: Vec3;
  /** Rotation around Y, radians. */
  rotationY: number;
}

export interface Pose {
  position: Vec3;
  target: Vec3;
}

export type Orientation = "landscape" | "portrait";

/** World-space frame size: 16:9 on landscape screens, 9:16 (native clips) on portrait. */
export const FRAME_SIZES = {
  landscape: { width: 6.4, height: 3.6 },
  portrait: { width: 3.6, height: 6.4 },
} as const satisfies Record<Orientation, { width: number; height: number }>;

/** Matches the CSS `(orientation: portrait)` media query (height ≥ width). */
export const orientationFor = (aspect: number): Orientation => (aspect > 1 ? "landscape" : "portrait");
export const CAMERA_FOV = 40;

export const STORY_FRAMES: readonly StoryFrame[] = [
  { position: [0, 0, 0], rotationY: 0 },
  { position: [5, 0.6, -12], rotationY: -0.22 },
  { position: [-5, -0.4, -24], rotationY: 0.22 },
  { position: [1, 0.2, -36], rotationY: -0.06 },
];

/** Progress at which the scene has fully faded out (end of the pinned stage). */
export const STORY_END = 4;

type PoseKind = "fill" | "card";

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Where a framed card should sit on screen, in NDC, and how wide it is. */
function cardLayout(aspect: number) {
  return orientationFor(aspect) === "landscape"
    ? { widthFraction: 0.52, cx: 0.4, cy: 0.02 } // beside the copy on the left
    : { widthFraction: 0.9, cx: 0, cy: 0.36 }; // above the copy on portrait screens
}

/**
 * Camera pose that places `frame` at a chosen screen position. The camera
 * looks straight down the frame's normal, so the frame is never skewed when
 * it's at rest.
 */
export function framePose(frame: StoryFrame, kind: PoseKind, aspect: number, fovDeg = CAMERA_FOV): Pose {
  const t = Math.tan((fovDeg * Math.PI) / 360);
  const { width, height } = FRAME_SIZES[orientationFor(aspect)];

  let distance: number;
  let cx = 0;
  let cy = 0;
  if (kind === "fill") {
    // Cover: the visible area must fit inside the frame (like object-fit: cover).
    distance = Math.min(width / (2 * t * aspect), height / (2 * t)) * 0.985;
  } else {
    const layout = cardLayout(aspect);
    distance = width / (2 * layout.widthFraction * t * aspect);
    cx = layout.cx;
    cy = layout.cy;
  }

  const r = frame.rotationY;
  const normal: Vec3 = [Math.sin(r), 0, Math.cos(r)];
  const right: Vec3 = [Math.cos(r), 0, -Math.sin(r)];
  const offsetX = cx * distance * t * aspect;
  const offsetY = cy * distance * t;

  const position = add(add(add(frame.position, scale(normal, distance)), scale(right, -offsetX)), [0, -offsetY, 0]);
  const target = add(position, scale(normal, -1));
  return { position, target };
}

interface Keyframe {
  p: number;
  frame: number;
  kind: PoseKind;
}

const LANDSCAPE_KEYFRAMES: readonly Keyframe[] = [
  { p: 0, frame: 0, kind: "fill" },
  { p: 0.06, frame: 0, kind: "fill" },
  { p: 0.5, frame: 0, kind: "card" },
  { p: 0.86, frame: 1, kind: "card" },
  { p: 1.14, frame: 1, kind: "card" },
  { p: 1.86, frame: 2, kind: "card" },
  { p: 2.14, frame: 2, kind: "card" },
  { p: 2.86, frame: 3, kind: "card" },
  { p: 3.08, frame: 3, kind: "card" },
  { p: 3.8, frame: 3, kind: "fill" },
  { p: STORY_END, frame: 3, kind: "fill" },
];

const PORTRAIT_KEYFRAMES: readonly Keyframe[] = [
  { p: 0, frame: 0, kind: "fill" },
  { p: 0.12, frame: 0, kind: "fill" },
  { p: 0.88, frame: 1, kind: "fill" },
  { p: 1.12, frame: 1, kind: "fill" },
  { p: 1.88, frame: 2, kind: "fill" },
  { p: 2.12, frame: 2, kind: "fill" },
  { p: 2.88, frame: 3, kind: "fill" },
  { p: STORY_END, frame: 3, kind: "fill" },
];

export interface CameraState extends Pose {
  /** 0 = a frame fills the screen, 1 = frames float as cards (drives rims/glow). */
  card: number;
}

/** Camera pose for a given scroll progress and viewport aspect ratio. */
export function cameraAt(progress: number, aspect: number): CameraState {
  const portrait = orientationFor(aspect) === "portrait";
  const keyframes = portrait ? PORTRAIT_KEYFRAMES : LANDSCAPE_KEYFRAMES;
  const p = Math.min(STORY_END, Math.max(0, progress));
  let i = 0;
  while (i < keyframes.length - 2 && p > keyframes[i + 1]!.p) i++;
  const from = keyframes[i]!;
  const to = keyframes[i + 1]!;

  const t = smoothstep(from.p, to.p, p);
  const a = framePose(STORY_FRAMES[from.frame]!, from.kind, aspect);
  const b = framePose(STORY_FRAMES[to.frame]!, to.kind, aspect);
  let position = lerp3(a.position, b.position, t);
  let target = lerp3(a.target, b.target, t);
  const kindA = from.kind === "card" ? 1 : 0;
  const kindB = to.kind === "card" ? 1 : 0;
  let card = kindA + (kindB - kindA) * t;

  // Flying between frames: arc up and back so the depth of the space reads.
  // Portrait pulls much further back, since frames otherwise always fill the screen.
  if (from.frame !== to.frame) {
    const arc = Math.sin(Math.PI * t);
    const back = portrait ? 9 : 3;
    position = add(position, [0, arc * 0.9, arc * back]);
    target = add(target, [0, arc * 0.6, arc * back]);
    card = Math.max(card, arc);
  }
  return { position, target, card };
}

/** Playback position (0–1) of the scroll-scrubbed final clip. */
export function scrubAt(progress: number): number {
  // Stop short of the clip's final close-up, where the screen content blurs.
  return 0.88 * smoothstep(3.05, 3.8, progress);
}

/** Fade to the page background as the stage un-pins. */
export function fadeAt(progress: number): number {
  return smoothstep(3.6, 3.95, progress);
}
