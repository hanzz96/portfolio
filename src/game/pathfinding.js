const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

/**
 * Breadth-first search over a tile grid (4 directions).
 * Returns the steps after `start`, ending on `goal`. When the goal is blocked or
 * unreachable, the path ends on the reachable tile closest to it.
 */
export function findPath({ cols, rows, isBlocked }, start, goal) {
  const inBounds = (col, row) => col >= 0 && row >= 0 && col < cols && row < rows;
  if (!inBounds(start.col, start.row)) return [];

  const index = (col, row) => row * cols + col;
  const distanceToGoal = (i) => Math.abs((i % cols) - goal.col) + Math.abs(Math.floor(i / cols) - goal.row);

  const startIndex = index(start.col, start.row);
  const previous = new Int32Array(cols * rows).fill(-2);
  previous[startIndex] = -1;

  const queue = [startIndex];
  let best = startIndex;
  let bestScore = distanceToGoal(startIndex);

  for (let head = 0; head < queue.length && bestScore > 0; head++) {
    const current = queue[head];
    const col = current % cols;
    const row = Math.floor(current / cols);

    for (const [dc, dr] of DIRECTIONS) {
      const nextCol = col + dc;
      const nextRow = row + dr;
      if (!inBounds(nextCol, nextRow) || isBlocked(nextCol, nextRow)) continue;

      const next = index(nextCol, nextRow);
      if (previous[next] !== -2) continue;

      previous[next] = current;
      queue.push(next);

      const score = distanceToGoal(next);
      if (score < bestScore) {
        best = next;
        bestScore = score;
      }
    }
  }

  const path = [];
  for (let cursor = best; cursor !== startIndex; cursor = previous[cursor]) {
    path.push({ col: cursor % cols, row: Math.floor(cursor / cols) });
  }
  return path.reverse();
}
