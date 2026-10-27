import kaplay from "kaplay";
import { findPath } from "./pathfinding.js";
import { HEROES, TILE, canStand, createWorld, isBlocked, poiAt } from "./world.js";

const SPEED = 64; // pixels per second
const SHEET = { sliceX: 12, sliceY: 11 };
const KEYS = {
  left: ["left", "a"],
  right: ["right", "d"],
  up: ["up", "w"],
  down: ["down", "s"],
};

const center = (index) => (index + 0.5) * TILE;

export function createGame({ root, baseUrl, onOpen }) {
  const canvas = document.createElement("canvas");
  canvas.className = "game-canvas";
  canvas.tabIndex = 0;
  root.appendChild(canvas);

  const k = kaplay({
    canvas,
    root,
    global: false,
    background: [18, 34, 24],
    crisp: true,
    pixelDensity: Math.min(window.devicePixelRatio || 1, 2),
    touchToMouse: true,
    debug: false,
    font: "monospace",
  });

  k.loadSprite("town", `${baseUrl}game/kenney-tiny-town/tilemap_packed.png`, SHEET);
  k.loadSprite("heroes", `${baseUrl}game/kenney-tiny-dungeon/tilemap_packed.png`, SHEET);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let paused = false;
  let handleTap = null;

  // Read the pointer straight from the DOM event: one path for mouse, touch and pen.
  canvas.addEventListener("pointerdown", (event) => {
    if (event.button > 0) return;
    const rect = canvas.getBoundingClientRect();
    handleTap?.(
      k.vec2(((event.clientX - rect.left) * k.width()) / rect.width, ((event.clientY - rect.top) * k.height()) / rect.height)
    );
  });

  k.scene("town", () => {
    const world = createWorld();
    const grid = { cols: world.cols, rows: world.rows, isBlocked: (col, row) => isBlocked(world, col, row) };
    const worldWidth = world.cols * TILE;
    const worldHeight = world.rows * TILE;

    world.ground.forEach((row, r) =>
      row.forEach((frame, c) => k.add([k.sprite("town", { frame }), k.pos(c * TILE, r * TILE), k.z(0)]))
    );
    world.props.forEach(({ col, row, frame }) =>
      k.add([k.sprite("town", { frame }), k.pos(col * TILE, row * TILE), k.z(1)])
    );
    world.npcs.forEach(({ col, row, frame }) =>
      k.add([k.sprite("heroes", { frame }), k.pos(center(col), center(row)), k.anchor("center"), k.z(5)])
    );

    world.pois.forEach(({ label, labelAnchor: { x, y } }) => {
      const text = label.toUpperCase();
      k.add([k.text(text, { size: 6 }), k.pos(x + 0.5, y + 0.5), k.anchor("center"), k.color(0, 0, 0), k.z(19)]);
      k.add([k.text(text, { size: 6 }), k.pos(x, y), k.anchor("center"), k.color(255, 209, 102), k.z(20)]);
    });

    const position = k.vec2(center(world.spawn.col), center(world.spawn.row));
    const player = k.add([k.sprite("heroes", { frame: HEROES.player }), k.pos(position), k.anchor("center"), k.z(10)]);
    const shadowObject = k.add([
      k.circle(4),
      k.pos(position),
      k.anchor("center"),
      k.scale(1, 0.45),
      k.color(0, 0, 0),
      k.opacity(0.3),
      k.z(9),
    ]);
    const hint = k.add([k.text("E / TAP", { size: 5 }), k.pos(position), k.anchor("center"), k.opacity(0), k.z(30)]);
    const marker = k.add([k.circle(3), k.pos(0, 0), k.anchor("center"), k.color(255, 209, 102), k.opacity(0), k.z(8)]);

    let path = [];
    let pending = null;
    let markerLife = 0;
    let clock = 0;
    let zoom = 2;
    const camera = k.vec2(position);

    const tileOf = () => ({ col: Math.floor(position.x / TILE), row: Math.floor(position.y / TILE) });
    const entryPoiHere = () => {
      const { col, row } = tileOf();
      return world.pois.find((poi) => poi.entry.col === col && poi.entry.row === row);
    };

    function open(poi) {
      path = [];
      pending = null;
      paused = true;
      onOpen(poi.id);
    }

    function fit() {
      const shortSide = Math.min(k.width(), k.height());
      zoom = Math.max(2, Math.min(6, Math.round(shortSide / (TILE * 16))));
      k.setCamScale(zoom, zoom);
    }
    fit();
    k.onResize(fit);

    handleTap = (screen) => {
      if (paused) return;
      const target = k.toWorld(screen);
      const col = Math.floor(target.x / TILE);
      const row = Math.floor(target.y / TILE);
      const poi = poiAt(world, col, row);
      const goal = poi ? poi.entry : { col, row };

      pending = poi ?? null;
      path = findPath(grid, tileOf(), goal);
      marker.pos = k.vec2(center(goal.col), center(goal.row));
      markerLife = 0.5;

      if (!path.length && pending) open(pending);
    };

    k.onKeyPress(["e", "enter", "space"], () => {
      if (paused) return;
      const poi = entryPoiHere();
      if (poi) open(poi);
    });

    const held = (names) => names.some((name) => k.isKeyDown(name));

    k.onUpdate(() => {
      const dt = Math.min(k.dt(), 0.05);
      clock += dt;
      let moving = false;
      let facing = 0;

      if (!paused) {
        const dx = (held(KEYS.right) ? 1 : 0) - (held(KEYS.left) ? 1 : 0);
        const dy = (held(KEYS.down) ? 1 : 0) - (held(KEYS.up) ? 1 : 0);

        if (dx || dy) {
          path = [];
          pending = null;
          const length = Math.hypot(dx, dy);
          const stepX = (dx / length) * SPEED * dt;
          const stepY = (dy / length) * SPEED * dt;
          if (canStand(world, position.x + stepX, position.y)) position.x += stepX;
          if (canStand(world, position.x, position.y + stepY)) position.y += stepY;
          moving = true;
          facing = dx;
        } else if (path.length) {
          const next = path[0];
          const toX = center(next.col) - position.x;
          const toY = center(next.row) - position.y;
          const distance = Math.hypot(toX, toY);
          const step = SPEED * dt;
          moving = true;
          facing = toX;

          if (distance <= step) {
            position.x = center(next.col);
            position.y = center(next.row);
            path.shift();
            if (!path.length && pending) open(pending);
          } else {
            position.x += (toX / distance) * step;
            position.y += (toY / distance) * step;
          }
        }
      }

      if (facing) player.flipX = facing < 0;
      const bob = moving && !reduceMotion ? Math.abs(Math.sin(clock * 14)) * 1.5 : 0;
      player.pos = k.vec2(position.x, position.y - bob);
      shadowObject.pos = k.vec2(position.x, position.y + 6);

      const poiHere = !paused && !moving ? entryPoiHere() : undefined;
      hint.opacity = poiHere ? 1 : 0;
      hint.pos = k.vec2(position.x, position.y + 14);

      markerLife = Math.max(0, markerLife - dt);
      marker.opacity = markerLife > 0 ? markerLife * 1.6 : 0;

      const viewWidth = k.width() / zoom;
      const viewHeight = k.height() / zoom;
      const targetX = viewWidth >= worldWidth ? worldWidth / 2 : k.clamp(position.x, viewWidth / 2, worldWidth - viewWidth / 2);
      const targetY =
        viewHeight >= worldHeight ? worldHeight / 2 : k.clamp(position.y, viewHeight / 2, worldHeight - viewHeight / 2);
      const follow = 1 - Math.exp(-dt * 8);
      camera.x += (targetX - camera.x) * follow;
      camera.y += (targetY - camera.y) * follow;
      k.setCamPos(camera.x, camera.y);
    });
  });

  k.go("town");
  canvas.focus({ preventScroll: true });

  return {
    setPaused(value) {
      paused = value;
      if (!value) canvas.focus({ preventScroll: true });
    },
    destroy() {
      k.quit();
      canvas.remove();
    },
  };
}
