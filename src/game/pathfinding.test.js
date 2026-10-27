import { describe, expect, it } from "vitest";
import { findPath } from "./pathfinding.js";

function gridFrom(rows) {
  const cells = rows.map((row) => [...row]);
  return {
    cols: cells[0].length,
    rows: cells.length,
    isBlocked: (col, row) => cells[row]?.[col] === "#",
  };
}

const p = (col, row) => ({ col, row });

describe("findPath", () => {
  it("returns an empty path when already at the goal", () => {
    const grid = gridFrom(["...", "...", "..."]);
    expect(findPath(grid, p(1, 1), p(1, 1))).toEqual([]);
  });

  it("walks a straight line in open space, excluding the start tile", () => {
    const grid = gridFrom(["....", "....", "...."]);
    expect(findPath(grid, p(0, 0), p(3, 0))).toEqual([p(1, 0), p(2, 0), p(3, 0)]);
  });

  it("moves in four directions only (no diagonal steps)", () => {
    const grid = gridFrom(["...", "...", "..."]);
    const path = findPath(grid, p(0, 0), p(2, 2));
    expect(path).toHaveLength(4);
    let prev = p(0, 0);
    for (const step of path) {
      expect(Math.abs(step.col - prev.col) + Math.abs(step.row - prev.row)).toBe(1);
      prev = step;
    }
  });

  it("routes around obstacles", () => {
    const grid = gridFrom([
      "..#..",
      "..#..",
      "..#..",
      ".....",
    ]);
    const path = findPath(grid, p(0, 0), p(4, 0));
    expect(path.at(-1)).toEqual(p(4, 0));
    expect(path.every((step) => !grid.isBlocked(step.col, step.row))).toBe(true);
    expect(path).toHaveLength(4 + 3 + 3);
  });

  it("ends next to the goal when the goal tile itself is blocked", () => {
    const grid = gridFrom([
      ".....",
      "..#..",
      ".....",
    ]);
    const path = findPath(grid, p(0, 0), p(2, 1));
    const end = path.at(-1);
    expect(grid.isBlocked(end.col, end.row)).toBe(false);
    expect(Math.abs(end.col - 2) + Math.abs(end.row - 1)).toBe(1);
  });

  it("heads for the closest reachable tile when the goal is walled off", () => {
    const grid = gridFrom([
      "..#..",
      "..#..",
      "..#..",
    ]);
    const path = findPath(grid, p(0, 1), p(4, 1));
    const end = path.at(-1);
    expect(end).toEqual(p(1, 1));
  });

  it("returns an empty path when nothing reachable is closer than the start", () => {
    const grid = gridFrom([
      ".#.",
      "###",
      "...",
    ]);
    expect(findPath(grid, p(0, 0), p(1, 2))).toEqual([]);
  });

  it("returns an empty path when the start is outside the grid", () => {
    const grid = gridFrom(["...", "..."]);
    expect(findPath(grid, p(-1, 0), p(1, 1))).toEqual([]);
  });
});
