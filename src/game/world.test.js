import { describe, expect, it } from "vitest";
import { TILE, canStand, createWorld, isBlocked, poiAt } from "./world.js";
import { findPath } from "./pathfinding.js";

const world = createWorld();
const grid = { cols: world.cols, rows: world.rows, isBlocked: (c, r) => isBlocked(world, c, r) };

describe("createWorld", () => {
  it("builds ground and blocked grids matching the declared size", () => {
    expect(world.ground).toHaveLength(world.rows);
    expect(world.ground.every((row) => row.length === world.cols)).toBe(true);
    expect(world.blocked).toHaveLength(world.rows);
    expect(world.blocked.every((row) => row.length === world.cols)).toBe(true);
  });

  it("is deterministic", () => {
    expect(createWorld()).toEqual(createWorld());
  });

  it("treats out-of-bounds tiles as blocked", () => {
    expect(isBlocked(world, -1, 0)).toBe(true);
    expect(isBlocked(world, 0, world.rows)).toBe(true);
  });

  it("spawns the player on a walkable tile", () => {
    expect(isBlocked(world, world.spawn.col, world.spawn.row)).toBe(false);
  });

  it("surrounds the map with solid forest", () => {
    for (let c = 0; c < world.cols; c++) {
      expect(isBlocked(world, c, 0)).toBe(true);
      expect(isBlocked(world, c, world.rows - 1)).toBe(true);
    }
    for (let r = 0; r < world.rows; r++) {
      expect(isBlocked(world, 0, r)).toBe(true);
      expect(isBlocked(world, world.cols - 1, r)).toBe(true);
    }
  });
});

describe("points of interest", () => {
  const expectedIds = ["about", "projects", "experience", "skills", "contact"];

  it("exposes the five portfolio sections", () => {
    expect(world.pois.map((poi) => poi.id).sort()).toEqual([...expectedIds].sort());
  });

  it.each(expectedIds)("%s has a walkable entry tile reachable from the spawn", (id) => {
    const poi = world.pois.find((item) => item.id === id);
    expect(isBlocked(world, poi.entry.col, poi.entry.row)).toBe(false);
    const path = findPath(grid, world.spawn, poi.entry);
    const end = path.at(-1) ?? world.spawn;
    expect(end).toEqual(poi.entry);
  });

  it.each(expectedIds)("%s footprint is solid and never overlaps another point of interest", (id) => {
    const poi = world.pois.find((item) => item.id === id);
    expect(poi.cells.length).toBeGreaterThan(0);
    for (const cell of poi.cells) {
      expect(isBlocked(world, cell.col, cell.row)).toBe(true);
      const owners = world.pois.filter((other) => other.cells.some((c) => c.col === cell.col && c.row === cell.row));
      expect(owners).toHaveLength(1);
    }
  });

  it("finds a point of interest from any of its footprint tiles or its entry", () => {
    for (const poi of world.pois) {
      for (const cell of poi.cells) expect(poiAt(world, cell.col, cell.row)?.id).toBe(poi.id);
      expect(poiAt(world, poi.entry.col, poi.entry.row)?.id).toBe(poi.id);
    }
    expect(poiAt(world, world.spawn.col, world.spawn.row)).toBeUndefined();
  });
});

describe("canStand", () => {
  const centerOf = ({ col, row }) => ({ x: (col + 0.5) * TILE, y: (row + 0.5) * TILE });

  it("allows standing in the middle of a free tile", () => {
    const { x, y } = centerOf(world.spawn);
    expect(canStand(world, x, y)).toBe(true);
  });

  it("rejects standing inside a solid tile", () => {
    const { x, y } = centerOf({ col: 0, row: 0 });
    expect(canStand(world, x, y)).toBe(false);
  });

  it("rejects overlapping a solid tile at the edge of a free one", () => {
    const poi = world.pois.find((item) => item.id === "about");
    const { x, y } = centerOf(poi.entry);
    expect(canStand(world, x, y - TILE / 2 - 2)).toBe(false);
  });
});
