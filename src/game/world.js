export const TILE = 16;
export const COLS = 28;
export const ROWS = 20;

// Frame numbers (row-major, 12 columns) in Kenney "Tiny Town" tilemap_packed.png.
const TOWN = {
  grass: 0,
  tuft: 1,
  flower: 2,
  bush: 5,
  treeSmallOrange: 27,
  treeSmallGreen: 28,
  treeTallTop: 4,
  treeTallBottom: 16,
  mushroom: 29,
  rocks: 43,
  sign: 83,
  fenceLeft: 80,
  fenceMiddle: 81,
  fenceRight: 82,
  wellTop: 92,
  wellBottom: 104,
  beehive: 94,
};

// Frame numbers in Kenney "Tiny Dungeon" tilemap_packed.png.
export const HEROES = { player: 85, wizard: 84 };

const DIRT = { tl: 12, t: 13, tr: 14, l: 24, c: 25, r: 26, bl: 36, b: 37, br: 38 };

const ROOFS = {
  grey: { top: [48, 49, 50], topChimney: [48, 51, 50], mid: [60, 63, 62] },
  red: { top: [52, 53, 54], topChimney: [52, 55, 54], mid: [64, 67, 66] },
};
const WALLS = {
  brown: [72, 85, 75],
  grey: [76, 89, 79],
};

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dirtFrame(dirt, col, row) {
  const open = (c, r) => !dirt[r]?.[c];
  const north = open(col, row - 1);
  const south = open(col, row + 1);
  const west = open(col - 1, row);
  const east = open(col + 1, row);

  if (north && west) return DIRT.tl;
  if (north && east) return DIRT.tr;
  if (south && west) return DIRT.bl;
  if (south && east) return DIRT.br;
  if (north) return DIRT.t;
  if (south) return DIRT.b;
  if (west) return DIRT.l;
  if (east) return DIRT.r;
  return DIRT.c;
}

export function createWorld() {
  const rng = mulberry32(2026);
  const blocked = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const dirt = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const props = [];
  const npcs = [];
  const pois = [];

  const fillDirt = (c0, r0, c1, r1) => {
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) dirt[r][c] = true;
  };
  const addProp = (col, row, frame, solid = true) => {
    props.push({ col, row, frame });
    if (solid) blocked[row][col] = true;
  };
  const cellsOf = (col, row, width, height) => {
    const cells = [];
    for (let r = row; r < row + height; r++) for (let c = col; c < col + width; c++) cells.push({ col: c, row: r });
    return cells;
  };
  const addHouse = (col, row, { roof, wall, chimney = false }) => {
    const rows = [chimney ? ROOFS[roof].topChimney : ROOFS[roof].top, ROOFS[roof].mid, WALLS[wall]];
    rows.forEach((frames, r) => frames.forEach((frame, c) => addProp(col + c, row + r, frame)));
    return cellsOf(col, row, 3, 3);
  };

  // Roads and plaza.
  fillDirt(4, 7, 23, 8);
  fillDirt(5, 8, 5, 11);
  fillDirt(21, 8, 21, 11);
  fillDirt(13, 6, 14, 6);
  fillDirt(10, 9, 17, 12);
  fillDirt(13, 13, 14, 14);
  fillDirt(4, 15, 23, 16);

  // Forest border.
  const treeFrames = [TOWN.treeSmallGreen, TOWN.bush, TOWN.treeSmallOrange, TOWN.treeSmallGreen];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const border = row < 2 || col < 2 || row >= ROWS - 2 || col >= COLS - 2;
      if (border) addProp(col, row, treeFrames[Math.floor(rng() * treeFrames.length)]);
    }
  }

  // Points of interest.
  const labelAt = (col, row, width) => ({ x: (col + width / 2) * TILE, y: row * TILE - 1 });

  pois.push({
    id: "about",
    label: "About",
    cells: addHouse(4, 8, { roof: "grey", wall: "brown" }),
    entry: { col: 5, row: 11 },
    labelAnchor: labelAt(4, 8, 3),
  });
  pois.push({
    id: "experience",
    label: "Experience",
    cells: addHouse(20, 8, { roof: "red", wall: "grey" }),
    entry: { col: 21, row: 11 },
    labelAnchor: labelAt(20, 8, 3),
  });
  pois.push({
    id: "skills",
    label: "Skills",
    cells: addHouse(4, 12, { roof: "grey", wall: "brown", chimney: true }),
    entry: { col: 5, row: 15 },
    labelAnchor: labelAt(4, 12, 3),
  });

  addProp(19, 14, TOWN.fenceLeft);
  addProp(20, 14, TOWN.fenceMiddle);
  addProp(21, 14, TOWN.sign);
  addProp(22, 14, TOWN.fenceMiddle);
  addProp(23, 14, TOWN.fenceRight);
  pois.push({
    id: "projects",
    label: "Projects",
    cells: [{ col: 21, row: 14 }],
    entry: { col: 21, row: 15 },
    labelAnchor: labelAt(21, 14, 1),
  });

  blocked[6][14] = true;
  npcs.push({ id: "wizard", frame: HEROES.wizard, col: 14, row: 6 });
  pois.push({
    id: "contact",
    label: "Contact",
    cells: [{ col: 14, row: 6 }],
    entry: { col: 14, row: 7 },
    labelAnchor: labelAt(14, 6, 1),
  });

  // Scenery.
  addProp(13, 10, TOWN.wellTop);
  addProp(13, 11, TOWN.wellBottom);
  [
    [9, 3],
    [24, 3],
    [2, 9],
    [25, 10],
    [9, 13],
    [19, 10],
  ].forEach(([col, row]) => {
    addProp(col, row, TOWN.treeTallTop);
    addProp(col, row + 1, TOWN.treeTallBottom);
  });
  [
    [2, 5, TOWN.treeSmallGreen],
    [2, 13, TOWN.treeSmallOrange],
    [25, 6, TOWN.treeSmallGreen],
    [25, 14, TOWN.treeSmallOrange],
    [8, 10, TOWN.bush],
    [16, 5, TOWN.treeSmallGreen],
    [11, 4, TOWN.mushroom],
    [7, 10, TOWN.mushroom],
    [23, 11, TOWN.rocks],
    [12, 13, TOWN.rocks],
    [16, 13, TOWN.beehive],
    [17, 13, TOWN.beehive],
  ].forEach(([col, row, frame]) => addProp(col, row, frame));

  const ground = Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => {
      if (dirt[row][col]) return dirtFrame(dirt, col, row);
      const roll = rng();
      if (roll < 0.06) return TOWN.flower;
      if (roll < 0.2) return TOWN.tuft;
      return TOWN.grass;
    })
  );

  return {
    cols: COLS,
    rows: ROWS,
    ground,
    props,
    npcs,
    pois,
    blocked,
    spawn: { col: 13, row: 14 },
  };
}

export function isBlocked(world, col, row) {
  if (col < 0 || row < 0 || col >= world.cols || row >= world.rows) return true;
  return world.blocked[row][col];
}

export function poiAt(world, col, row) {
  return world.pois.find(
    (poi) =>
      (poi.entry.col === col && poi.entry.row === row) || poi.cells.some((cell) => cell.col === col && cell.row === row)
  );
}

const HALF_WIDTH = 4;
const FOOT_DEPTH = 7;

/** Whether the player's foot box fits at pixel position (x, y), the sprite's centre. */
export function canStand(world, x, y) {
  const corners = [
    [x - HALF_WIDTH, y],
    [x + HALF_WIDTH, y],
    [x - HALF_WIDTH, y + FOOT_DEPTH],
    [x + HALF_WIDTH, y + FOOT_DEPTH],
  ];
  return corners.every(([px, py]) => !isBlocked(world, Math.floor(px / TILE), Math.floor(py / TILE)));
}
