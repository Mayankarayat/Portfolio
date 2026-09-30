import { describe, expect, it } from "vitest";
import { GRID_BY_TIER, orderedHeight, terrainHeight } from "./terrain-math";

describe("terrain height model", () => {
  const grid = GRID_BY_TIER.high;

  it("stays within a renderable range in both states", () => {
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        for (const order of [0, 0.5, 1]) {
          const h = terrainHeight(col, row, grid, 3.7, order);
          expect(h).toBeGreaterThanOrEqual(0);
          expect(h).toBeLessThanOrEqual(1.1);
        }
      }
    }
  });

  it("is fully ordered (time-independent) at progress 1", () => {
    expect(terrainHeight(5, 3, grid, 0, 1)).toBeCloseTo(orderedHeight(5, 3));
    expect(terrainHeight(5, 3, grid, 42, 1)).toBeCloseTo(orderedHeight(5, 3));
  });
});
