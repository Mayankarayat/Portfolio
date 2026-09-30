import { TERRAIN_PALETTE, terrainHeight, type GridSize } from "@/components/three/terrain-math";

/**
 * Static poster for the hero terrain, generated at build time from the same
 * height model the WebGL shader uses. It is the first paint on every device
 * and the permanent visual on devices that don't get the live scene.
 */
export const dynamic = "force-static";

const GRID: GridSize = { cols: 18, rows: 14 };
const CELL = 34; // half-width of an isometric cell, px
const BAR = 0.68; // bar footprint relative to the cell
const HEIGHT = 120; // px for a height of 1

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, t: number, shade = 1): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const c = (x: number, y: number) => Math.round((x + (y - x) * t) * shade);
  return `rgb(${c(ar, br)},${c(ag, bg)},${c(ab, bb)})`;
}

const f = (n: number) => Math.round(n);

function buildSvg(): string {
  const width = (GRID.cols + GRID.rows) * CELL + 2 * CELL;
  const originX = GRID.rows * CELL + CELL;
  const originY = HEIGHT * 1.2;
  const heightPx = originY + (GRID.cols + GRID.rows) * CELL * 0.5 + CELL;

  const cells: Array<{ col: number; row: number }> = [];
  for (let row = 0; row < GRID.rows; row++) {
    for (let col = 0; col < GRID.cols; col++) cells.push({ col, row });
  }
  cells.sort((a, b) => a.col + a.row - (b.col + b.row));

  const b = CELL * BAR;
  const shapes = cells.map(({ col, row }) => {
    const h = terrainHeight(col, row, GRID, 0, 0);
    const hp = h * HEIGHT;
    const cx = originX + (col - row) * CELL;
    const cy = originY + (col + row) * CELL * 0.5;
    const top = `${f(cx)},${f(cy - b / 2 - hp)} ${f(cx + b)},${f(cy - hp)} ${f(cx)},${f(cy + b / 2 - hp)} ${f(cx - b)},${f(cy - hp)}`;
    const left = `${f(cx - b)},${f(cy - hp)} ${f(cx)},${f(cy + b / 2 - hp)} ${f(cx)},${f(cy + b / 2)} ${f(cx - b)},${f(cy)}`;
    const right = `${f(cx)},${f(cy + b / 2 - hp)} ${f(cx + b)},${f(cy - hp)} ${f(cx + b)},${f(cy)} ${f(cx)},${f(cy + b / 2)}`;
    const t = Math.min(1, Math.max(0, (h - 0.15) / 0.85));
    const nx = (col / (GRID.cols - 1)) * 2 - 1;
    const nz = (row / (GRID.rows - 1)) * 2 - 1;
    const fade = Math.max(0, 1 - Math.max(0, Math.hypot(nx, nz) - 0.45) / 0.75);
    const { low, high } = TERRAIN_PALETTE;
    return `<g opacity="${Math.round(fade * 100) / 100}"><polygon points="${left}" fill="${mix(low, high, t, 0.55)}"/><polygon points="${right}" fill="${mix(low, high, t, 0.8)}"/><polygon points="${top}" fill="${mix(low, high, t)}"/></g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(width)} ${f(heightPx)}">${shapes.join("")}</svg>`;
}

export function GET() {
  return new Response(buildSvg(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
