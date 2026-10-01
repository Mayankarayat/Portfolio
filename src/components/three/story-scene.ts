import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  VideoTexture,
  WebGLRenderer,
} from "three";
import { createRenderLoop } from "./render-loop";
import type { SceneHandle, SceneOptions } from "./scene-types";
import { CAMERA_FOV, FRAME_SIZES, STORY_FRAMES, cameraAt, fadeAt, orientationFor, scrubAt, type Orientation } from "./story-path";
import { TERRAIN_PALETTE } from "./terrain-math";

/**
 * The story: graded clips of Mayank's day hung as frames in a dark, dusty 3D
 * space. Scroll flies the camera from frame to frame (see story-path.ts); the
 * first clips loop ambiently, the last is scroll-scrubbed as the camera dives
 * into the monitor. Media streams in per chapter, so only nearby clips load.
 */

export interface StoryMedia {
  /** Poster still per orientation (landscape 16:9 crop, portrait native 9:16). */
  posters: Record<Orientation, string>;
  /** Clip base name; see `videoUrl` for the rendition naming scheme. */
  video: string;
  mode: "loop" | "scrub";
}

const ACCENT = "#9d92ff";

const frameVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const frameFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform vec2 uSize;
  uniform float uRadius;
  uniform float uBorder;
  uniform float uTime;
  uniform float uFade;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uBackground;
  uniform vec3 uAccent;
  varying vec2 vUv;
  varying float vDepth;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    // Rounded-rectangle signed distance, in world units.
    vec2 p = (vUv - 0.5) * uSize;
    vec2 q = abs(p) - (uSize * 0.5 - uRadius);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float aa = fwidth(d);
    float alpha = 1.0 - smoothstep(-aa, aa, d);

    vec3 color = uHasMap > 0.5 ? texture2D(uMap, vUv).rgb : uBackground * 1.6;

    // Film grain and a soft inner vignette for a printed, cinematic finish.
    color += (hash(vUv * vec2(1280.0, 720.0) + floor(uTime * 24.0)) - 0.5) * 0.03;
    color *= mix(1.0, 0.82, smoothstep(0.35, 0.75, length(vUv - 0.5)) * uBorder);

    // Hairline accent rim when the frame floats as a card.
    float rim = (1.0 - smoothstep(0.0, 0.035, -d)) * uBorder;
    color = mix(color, uAccent, rim * 0.55);

    // Distant frames dissolve into the fog rather than occluding the glow behind them.
    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    color = mix(color, uBackground, fog);
    color = mix(color, uBackground, uFade);
    // ...and frames sliding past the lens fade out instead of clipping.
    float near = smoothstep(1.5, 3.5, vDepth);
    gl_FragColor = vec4(color, alpha * (1.0 - fog * fog) * near);

    #include <colorspace_fragment>
  }
`;

const glowFragment = /* glsl */ `
  uniform vec3 uAccent;
  uniform float uStrength;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    float r = length((vUv - 0.5) * 2.0);
    float a = pow(max(0.0, 1.0 - r), 2.2) * uStrength * (1.0 - smoothstep(uFogNear, uFogFar, vDepth));
    gl_FragColor = vec4(uAccent * a, 1.0);
    #include <colorspace_fragment>
  }
`;

const dustVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.13 + aSeed * 6.283) * 0.35;
    p.y += sin(uTime * 0.17 + aSeed * 12.7) * 0.45;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    gl_PointSize = (1.2 + aSeed * 2.4) * uPixelRatio * (14.0 / max(depth, 0.5));
    vAlpha = smoothstep(0.5, 4.0, depth) * (1.0 - smoothstep(18.0, 40.0, depth)) * (0.25 + 0.5 * aSeed);
    gl_Position = projectionMatrix * mv;
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uFade;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha * (1.0 - uFade);
    gl_FragColor = vec4(uColor * a, 1.0);
    #include <colorspace_fragment>
  }
`;

const MAX_DPR = { high: 2, low: 1.5 } as const;

/** H.264 where it's fully supported (smaller, hardware-decoded); VP9 WebM otherwise. */
let extension: "mp4" | "webm" | undefined;
function videoExtension(): "mp4" | "webm" {
  if (!extension) {
    const probe = document.createElement("video");
    extension = probe.canPlayType('video/mp4; codecs="avc1.640028"') === "probably" ? "mp4" : "webm";
  }
  return extension;
}

/**
 * Landscape: AI-upscaled 16:9 crops at 1080p (high tier) / 720p (low), WebM at 720p.
 * Portrait: the clips' native 9:16 framing (1080×1920 MP4, 720×1280 WebM).
 */
function videoUrl(name: string, orientation: Orientation, tier: SceneOptions["tier"]): string {
  const ext = videoExtension();
  if (orientation === "portrait") return `/story/${name}-portrait.${ext}`;
  return `/story/${name}-${ext === "mp4" && tier === "high" ? 1080 : 720}.${ext}`;
}
const DUST = { high: 900, low: 260 } as const;

interface Chapter {
  media: StoryMedia;
  material: ShaderMaterial;
  posterRequested: boolean;
  poster: Texture | null;
  video: HTMLVideoElement | null;
  videoTexture: VideoTexture | null;
}

export function createStory(canvas: HTMLCanvasElement, options: SceneOptions, media: readonly StoryMedia[]): SceneHandle {
  const { tier } = options;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: tier === "high",
    alpha: false,
    powerPreference: tier === "high" ? "high-performance" : "low-power",
  });
  renderer.setClearColor(TERRAIN_PALETTE.background, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 120);
  const background = new Color(TERRAIN_PALETTE.background);
  const accent = new Color(ACCENT);
  const fog = { near: { value: 16 }, far: { value: 44 } };

  // --- frames ----------------------------------------------------------------
  // Frame shape is fixed per orientation; StoryScene re-creates the scene if it flips.
  const initial = canvas.getBoundingClientRect();
  const orientation = orientationFor(initial.width / Math.max(1, initial.height));
  const size = FRAME_SIZES[orientation];
  const frameGeometry = new PlaneGeometry(size.width, size.height);
  const glowGeometry = new PlaneGeometry(size.width * 1.7, size.height * 1.7);
  const time = { value: 0 };
  const fade = { value: 0 };
  const border = { value: 0 };
  const glowStrength = { value: 0 };

  const glowMaterial = new ShaderMaterial({
    vertexShader: frameVertex,
    fragmentShader: glowFragment,
    uniforms: { uAccent: { value: accent }, uStrength: glowStrength, uFogNear: fog.near, uFogFar: fog.far },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });

  const chapters: Chapter[] = STORY_FRAMES.map((frame, i) => {
    const material = new ShaderMaterial({
      vertexShader: frameVertex,
      fragmentShader: frameFragment,
      uniforms: {
        uMap: { value: null },
        uHasMap: { value: 0 },
        uSize: { value: new Vector2(size.width, size.height) },
        uRadius: { value: 0.14 },
        uBorder: border,
        uTime: time,
        uFade: fade,
        uFogNear: fog.near,
        uFogFar: fog.far,
        uBackground: { value: background },
        uAccent: { value: accent },
      },
      transparent: true,
    });
    const mesh = new Mesh(frameGeometry, material);
    mesh.position.set(...frame.position);
    mesh.rotation.y = frame.rotationY;
    scene.add(mesh);

    const glow = new Mesh(glowGeometry, glowMaterial);
    glow.position.set(frame.position[0], frame.position[1], frame.position[2]);
    glow.rotation.y = frame.rotationY;
    glow.translateZ(-0.6);
    glow.renderOrder = -1;
    scene.add(glow);

    return {
      media: media[i]!,
      material,
      posterRequested: false,
      poster: null,
      video: null,
      videoTexture: null,
    };
  });

  // --- dust --------------------------------------------------------------------
  const dustCount = DUST[tier];
  const dustPositions = new Float32Array(dustCount * 3);
  const dustSeeds = new Float32Array(dustCount);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 30;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    dustPositions[i * 3 + 2] = 10 - Math.random() * 56;
    dustSeeds[i] = Math.random();
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute("position", new BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute("aSeed", new BufferAttribute(dustSeeds, 1));
  const pixelRatio = { value: 1 };
  const dustMaterial = new ShaderMaterial({
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    uniforms: { uTime: time, uPixelRatio: pixelRatio, uColor: { value: new Color("#c9c2ff") }, uFade: fade },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  dust.frustumCulled = false;
  scene.add(dust);

  // --- media streaming ------------------------------------------------------------
  const loader = new TextureLoader();
  let resolveReady: () => void = () => {};
  const ready = new Promise<void>((resolve) => (resolveReady = resolve));

  const setMap = (chapter: Chapter, texture: Texture) => {
    chapter.material.uniforms.uMap!.value = texture;
    chapter.material.uniforms.uHasMap!.value = 1;
  };

  const requestPoster = (index: number) => {
    const chapter = chapters[index]!;
    if (chapter.posterRequested) return;
    chapter.posterRequested = true;
    loader.load(chapter.media.posters[orientation], (texture) => {
      if (disposed) return texture.dispose();
      texture.colorSpace = SRGBColorSpace;
      chapter.poster = texture;
      if (!chapter.videoTexture) setMap(chapter, texture);
      if (index === 0) resolveReady();
    });
  };

  const requestVideo = (index: number) => {
    const chapter = chapters[index]!;
    if (chapter.video) return;
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.loop = chapter.media.mode === "loop";
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    video.src = videoUrl(chapter.media.video, orientation, tier);
    video.addEventListener(
      "loadeddata",
      () => {
        if (disposed) return;
        const texture = new VideoTexture(video);
        texture.colorSpace = SRGBColorSpace;
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;
        // A paused (scrubbed) clip never presents a frame on its own: upload
        // the first frame now and every frame a seek lands on.
        texture.needsUpdate = true;
        video.addEventListener("seeked", () => (texture.needsUpdate = true));
        chapter.videoTexture = texture;
        setMap(chapter, texture);
        chapter.poster?.dispose();
        chapter.poster = null;
      },
      { once: true },
    );
    chapter.video = video;
  };

  // --- sizing ------------------------------------------------------------------------
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    pixelRatio.value = renderer.getPixelRatio();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  // --- pointer parallax (fine pointers only) -----------------------------------------
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  };
  if (tier === "high") window.addEventListener("pointermove", onPointerMove, { passive: true });

  // --- loop ------------------------------------------------------------------------------
  let disposed = false;
  let active = false;
  let targetProgress = 0;
  let progress = 0;
  let elapsed = 0;

  const syncMedia = () => {
    chapters.forEach((chapter, i) => {
      const distance = Math.abs(progress - i);
      if (distance < 1.6) requestPoster(i);
      if (distance < 1.05) requestVideo(i);

      const video = chapter.video;
      if (!video) return;
      if (chapter.media.mode === "loop") {
        // Preloaded when near, but only decoded while its frame is on screen.
        const shouldPlay = active && distance < 0.75;
        if (shouldPlay && video.paused) void video.play().catch(() => {});
        else if (!shouldPlay && !video.paused) video.pause();
      } else if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        const target = scrubAt(progress) * Math.max(0, video.duration - 0.05);
        if (!video.seeking && Math.abs(video.currentTime - target) > 1 / 40) video.currentTime = target;
      }
    });
  };

  const loop = createRenderLoop({
    renderer,
    maxDpr: MAX_DPR[tier],
    resize,
    onUnderperform: options.onUnderperform,
    frame(delta) {
      elapsed += delta / 1000;
      time.value = elapsed;

      // Inertial follow of the scroll position — smooth without hijacking scrolling.
      progress += (targetProgress - progress) * (1 - Math.exp(-delta / 110));

      const pose = cameraAt(progress, camera.aspect);
      pointer.sx += (pointer.x - pointer.sx) * Math.min(1, delta / 400);
      pointer.sy += (pointer.y - pointer.sy) * Math.min(1, delta / 400);
      const float = Math.sin(elapsed * 0.6) * 0.04;
      camera.position.set(pose.position[0] + pointer.sx * 0.35, pose.position[1] + pointer.sy * 0.2 + float, pose.position[2]);
      camera.lookAt(pose.target[0] + pointer.sx * 0.12, pose.target[1] + pointer.sy * 0.08 + float, pose.target[2]);

      border.value = pose.card;
      glowStrength.value = 0.22 * pose.card;
      fade.value = fadeAt(progress);

      syncMedia();
      renderer.render(scene, camera);
    },
  });
  resize();
  requestPoster(0);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    loop.stop();
    options.onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    ready,
    setProgress(value) {
      targetProgress = value;
    },
    setActive(next) {
      active = next;
      if (next) loop.start();
      else {
        loop.stop();
        chapters.forEach((c) => c.video?.pause());
      }
    },
    dispose() {
      disposed = true;
      loop.stop();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      chapters.forEach((c) => {
        c.video?.pause();
        c.video?.removeAttribute("src");
        c.video?.load();
        c.videoTexture?.dispose();
        c.poster?.dispose();
        c.material.dispose();
      });
      frameGeometry.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    },
  };
}
