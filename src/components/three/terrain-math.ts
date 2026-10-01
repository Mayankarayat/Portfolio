/**
 * Height model for the hero "data terrain".
 *
 * The scene tells a small story: an organic, noisy surface (raw data) that
 * resolves into an ordered grouped bar chart (a dashboard) as the visitor
 * scrolls — the kind of transformation the payroll and attendance analytics
 * work is about.
 *
 * These functions are the reference implementation. The vertex shader in
 * `terrain-scene.ts` mirrors them in GLSL; the SVG poster served before (or
 * instead of) WebGL is generated from them so the two always agree.
 */

export const TERRAIN_PALETTE = {
  background: "#f6f4ef",
  low: "#e4e0f5",
  high: "#5145cd",
} as const;

export interface GridSize {
  cols: number;
  rows: number;
}

export const GRID_BY_TIER = {
  high: { cols: 64, rows: 40 },
  low: { cols: 40, rows: 28 },
} as const satisfies Record<string, GridSize>;

/** Organic surface, roughly within [0, 1]. */
export function organicHeight(x: number, z: number, t: number): number {
  return (
    0.5 +
    0.25 * Math.sin(x * 0.55 + t * 0.6) * Math.cos(z * 0.45 - t * 0.4) +
    0.18 * Math.sin((x + z) * 0.3 + t * 0.35) +
    0.07 * Math.sin(x * 1.7 - z * 1.3 + t)
  );
}

/** Deterministic pseudo-random in [0, 1) — same formula as the GLSL hash. */
export function hash(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Ordered state: every row becomes a data series and columns become
 * periods, giving a readable grouped-bar silhouette. Range ≈ [0.12, 0.95].
 */
export function orderedHeight(col: number, row: number): number {
  const seriesBias = 0.35 + 0.45 * hash(row + 1);
  const trend = 0.5 + 0.5 * Math.sin(col * 0.32 + row * 0.8);
  return 0.12 + 0.83 * seriesBias * (0.45 + 0.55 * trend);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function terrainHeight(
  col: number,
  row: number,
  grid: GridSize,
  t: number,
  order: number,
): number {
  const x = col - (grid.cols - 1) / 2;
  const z = row - (grid.rows - 1) / 2;
  const k = smoothstep(0, 1, order);
  return organicHeight(x, z, t) * (1 - k) + orderedHeight(col, row) * k;
}
