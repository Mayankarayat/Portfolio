import {
  BoxGeometry,
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { createRenderLoop } from "./render-loop";
import type { SceneHandle, SceneOptions } from "./scene-types";
import { GRID_BY_TIER, TERRAIN_PALETTE } from "./terrain-math";

/**
 * The hero "data terrain": one instanced draw call, all animation computed in
 * the vertex shader from a handful of uniforms, so the CPU does no per-frame
 * buffer work. Loaded lazily (see TerrainScene) so three.js never sits on the
 * critical path.
 */

const vertexShader = /* glsl */ `
  attribute vec3 aCell; // col, row, seed

  uniform float uTime;
  uniform float uOrder;
  uniform float uIntro;
  uniform float uAmp;
  uniform vec2 uGrid;
  uniform vec2 uPointer;
  uniform float uPointerStrength;

  varying float vHeight;
  varying float vLocalY;
  varying vec3 vNormal;
  varying float vDepth;
  varying float vEdge;
  varying float vSeries;

  float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

  // Mirrors organicHeight() in terrain-math.ts
  float organicHeight(vec2 p, float t) {
    return 0.5
      + 0.25 * sin(p.x * 0.55 + t * 0.6) * cos(p.y * 0.45 - t * 0.4)
      + 0.18 * sin((p.x + p.y) * 0.3 + t * 0.35)
      + 0.07 * sin(p.x * 1.7 - p.y * 1.3 + t);
  }

  // Mirrors orderedHeight() in terrain-math.ts
  float orderedHeight(vec2 cell) {
    float seriesBias = 0.35 + 0.45 * hash(cell.y + 1.0);
    float trend = 0.5 + 0.5 * sin(cell.x * 0.32 + cell.y * 0.8);
    return 0.12 + 0.83 * seriesBias * (0.45 + 0.55 * trend);
  }

  void main() {
    vec2 cell = aCell.xy;
    vec2 p = cell - (uGrid - 1.0) * 0.5;

    float k = smoothstep(0.0, 1.0, uOrder);
    float h = mix(organicHeight(p, uTime), orderedHeight(cell) + 0.03 * sin(uTime * 1.4 + aCell.z * 6.2831), k);

    float d = distance(p, uPointer);
    h += uPointerStrength * 0.55 * exp(-d * d / 6.0);

    // Staggered intro: bars rise from the centre outwards.
    float delay = length(p) / length(uGrid * 0.5) * 0.6;
    float intro = smoothstep(delay, delay + 0.4, uIntro);

    float height = max(0.04, h * uAmp * intro);

    vec3 pos = position;
    float localY = pos.y + 0.5;
    pos.xz *= 0.62;
    pos.y = localY * height;
    pos.xz += p;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vHeight = height / uAmp;
    vLocalY = localY;
    vNormal = normal;
    vDepth = -mv.z;
    vEdge = length(p / ((uGrid - 1.0) * 0.5));
    // Once ordered, each row reads as its own data series.
    vSeries = mix(1.0, 0.5 + 0.5 * hash(cell.y + 7.0), k);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBackground;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform float uFogNear;
  uniform float uFogFar;

  varying float vHeight;
  varying float vLocalY;
  varying vec3 vNormal;
  varying float vDepth;
  varying float vEdge;
  varying float vSeries;

  void main() {
    vec3 n = normalize(vNormal);
    float light = 0.35 + 0.65 * max(dot(n, normalize(vec3(0.45, 1.0, 0.3))), 0.0);
    vec3 color = mix(uLow, uHigh, smoothstep(0.15, 1.0, vHeight)) * light;

    float top = step(0.5, n.y);
    color += top * uHigh * 0.35 * smoothstep(0.35, 1.0, vHeight);
    color *= mix(0.25, 1.0, vLocalY) * vSeries;

    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    float edge = smoothstep(0.55, 1.0, vEdge);
    gl_FragColor = vec4(mix(color, uBackground, max(fog, edge)), 1.0);

    #include <colorspace_fragment>
  }
`;

export type TerrainOptions = SceneOptions;
export type TerrainHandle = SceneHandle;

const MAX_DPR = { high: 1.75, low: 1.25 } as const;

export function createTerrain(canvas: HTMLCanvasElement, options: TerrainOptions): TerrainHandle {
  const { tier } = options;
  const grid = GRID_BY_TIER[tier];

  const renderer = new WebGLRenderer({
    canvas,
    antialias: tier === "high",
    alpha: false,
    powerPreference: tier === "high" ? "high-performance" : "low-power",
  });
  renderer.setClearColor(TERRAIN_PALETTE.background, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 120);
  const target = new Vector3(0, 0, 0);

  // Geometry: a unit box with its base at y = -0.5, instanced once per cell.
  const base = new BoxGeometry(1, 1, 1);
  const geometry = new InstancedBufferGeometry();
  geometry.index = base.index;
  geometry.setAttribute("position", base.getAttribute("position"));
  geometry.setAttribute("normal", base.getAttribute("normal"));

  const count = grid.cols * grid.rows;
  const cells = new Float32Array(count * 3);
  for (let row = 0, i = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++, i++) {
      cells[i * 3] = col;
      cells[i * 3 + 1] = row;
      cells[i * 3 + 2] = Math.random();
    }
  }
  geometry.setAttribute("aCell", new InstancedBufferAttribute(cells, 3));
  geometry.instanceCount = count;

  const uniforms = {
    uTime: { value: 0 },
    uOrder: { value: 0 },
    uIntro: { value: 0 },
    uAmp: { value: 3.4 },
    uGrid: { value: new Vector2(grid.cols, grid.rows) },
    uPointer: { value: new Vector2(999, 999) },
    uPointerStrength: { value: 0 },
    uBackground: { value: new Color(TERRAIN_PALETTE.background) },
    uLow: { value: new Color(TERRAIN_PALETTE.low) },
    uHigh: { value: new Color(TERRAIN_PALETTE.high) },
    uFogNear: { value: 26 },
    uFogFar: { value: 62 },
  };

  const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false; // vertex shader moves geometry; bounds are meaningless
  scene.add(mesh);

  // --- sizing --------------------------------------------------------------
  let width = 1;
  let height = 1;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  // --- pointer: analytic ray / ground-plane intersection -------------------
  const ndc = new Vector3();
  const pointerGoal = new Vector2(999, 999);
  let pointerActiveUntil = 0;
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    if (event.clientY > rect.bottom || event.clientY < rect.top) return;
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1, 0.5);
    ndc.unproject(camera).sub(camera.position).normalize();
    if (Math.abs(ndc.y) < 1e-4) return;
    const distance = -camera.position.y / ndc.y;
    if (distance <= 0) return;
    pointerGoal.set(camera.position.x + ndc.x * distance, camera.position.z + ndc.z * distance);
    pointerActiveUntil = performance.now() + 1600;
  };
  if (tier === "high") window.addEventListener("pointermove", onPointerMove, { passive: true });

  // --- loop ----------------------------------------------------------------
  let progress = 0;
  let order = 0;
  let elapsed = 0;
  let introStart = -1;

  const updateCamera = () => {
    // Landscape: the field sits to the right of the copy. Portrait: the
    // camera looks past the origin so the field occupies the lower half.
    if (camera.aspect < 1) {
      camera.position.set(0, 26 + progress * 5, 38 - progress * 4);
      target.set(0, 0, -10);
      uniforms.uAmp.value = 2.6;
    } else {
      camera.position.set(-5, 15 + progress * 6, 30 - progress * 5);
      target.set(-5, 0, 1);
      uniforms.uAmp.value = 3.4;
    }
    camera.lookAt(target);
  };

  const loop = createRenderLoop({
    renderer,
    maxDpr: MAX_DPR[tier],
    resize,
    onUnderperform: options.onUnderperform,
    frame(delta, now) {
      elapsed += delta / 1000;
      // The intro (bars rising) starts the first time the scene is actually shown.
      if (introStart < 0) introStart = now;

      order += (progress - order) * Math.min(1, delta / 250);
      uniforms.uTime.value = elapsed * 0.6;
      uniforms.uOrder.value = order;
      uniforms.uIntro.value = Math.min(1, (now - introStart) / 1800);

      const pointerOn = now < pointerActiveUntil ? 1 : 0;
      uniforms.uPointerStrength.value += (pointerOn - uniforms.uPointerStrength.value) * Math.min(1, delta / 300);
      uniforms.uPointer.value.lerp(pointerGoal, Math.min(1, delta / 120));

      updateCamera();
      renderer.render(scene, camera);
    },
  });

  const onContextLost = (event: Event) => {
    event.preventDefault();
    loop.stop();
    options.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    setProgress(value) {
      progress = Math.min(1, Math.max(0, value));
    },
    setActive(active) {
      if (active) loop.start();
      else loop.stop();
    },
    dispose() {
      loop.stop();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose();
      base.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
