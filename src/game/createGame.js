import kaplay from "kaplay";
import { createHeldKeys } from "./input.js";
import { findPath } from "./pathfinding.js";
import { armUnlock } from "./unlock.js";
import { HEROES, TILE, canStand, createWorld, isBlocked, poiAt } from "./world.js";

const SPEED = 64; // pixels per second
const STRIDE = 14; // pixels walked per footstep sound
const SFX = ["step-1", "step-2", "step-3", "tap", "open", "close"];
const SHEET = { sliceX: 12, sliceY: 11 };
const center = (index) => (index + 0.5) * TILE;

export function createGame({ root, overlay, baseUrl, onOpen }) {
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
  });

  k.loadSprite("town", `${baseUrl}game/kenney-tiny-town/tilemap_packed.png`, SHEET);
  k.loadSprite("heroes", `${baseUrl}game/kenney-tiny-dungeon/tilemap_packed.png`, SHEET);

  for (const name of SFX) k.loadSound(name, `${baseUrl}game/audio/sfx/${name}.wav`);

  // Music streams from a plain audio element so its 1+ MB only downloads once sound is turned on.
  let music = null;
  const getMusic = () => {
    if (!music) {
      music = new Audio(`${baseUrl}game/audio/town-theme.mp3`);
      music.loop = true;
      music.volume = 0.3;
    }
    return music;
  };

  let muted = true;
  const syncMusic = () => {
    if (muted || document.hidden) music?.pause();
    else getMusic().play().catch(() => {}); // blocked until the visitor interacts
  };
  const sound = (name, options) => {
    if (!muted) k.play(name, options);
  };
  document.addEventListener("visibilitychange", syncMusic);

  // Browsers keep audio locked until the visitor interacts. Unlock on the first interaction of any kind
  // (key, tap, click anywhere), so a saved "sound on" choice starts the music instead of staying silent.
  const resumeAudio = () => k.audioCtx.resume().catch(() => {});
  const disarmUnlock = armUnlock(window, () => {
    resumeAudio();
    if (!muted) syncMusic();
  });

  // Movement keys come from window events, not Kaplay (which only hears the canvas), and are cleared
  // whenever focus could move away, so a key released inside a panel can never stay stuck down.
  const keys = createHeldKeys();
  const onKeyDown = (event) => {
    if (!paused && !event.metaKey && !event.ctrlKey && !event.altKey) keys.press(event.code);
  };
  const onKeyUp = (event) => keys.release(event.code);
  const releaseAllKeys = () => keys.clear();
  const onVisibility = () => {
    if (document.hidden) keys.clear();
  };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", releaseAllKeys);
  document.addEventListener("visibilitychange", onVisibility);

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

    // Labels are DOM, not canvas text: Kaplay's built-in font atlas breaks when the game is re-created.
    const makeLabel = (className, text) => {
      const element = document.createElement("span");
      element.className = className;
      element.textContent = text;
      overlay.appendChild(element);
      return element;
    };
    const labels = world.pois.map(({ label, labelAnchor }) => ({ element: makeLabel("game-label", label), ...labelAnchor }));
    const hintElement = makeLabel("game-label game-hint", window.matchMedia("(pointer: coarse)").matches ? "Tap" : "E / Tap");
    const place = (element, worldX, worldY, anchorY = "-50%") => {
      const { x, y } = k.toScreen(k.vec2(worldX, worldY));
      element.style.transform = `translate(${x}px, ${y}px) translate(-50%, ${anchorY})`;
    };

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
    const marker = k.add([k.circle(3), k.pos(0, 0), k.anchor("center"), k.color(255, 209, 102), k.opacity(0), k.z(8)]);

    let path = [];
    let pending = null;
    let markerLife = 0;
    let clock = 0;
    let stride = 0;
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
      keys.clear();
      sound("open", { volume: 0.5 });
      onOpen(poi.id);
    }

    function fit() {
      const shortSide = Math.min(k.width(), k.height());
      zoom = Math.max(2, Math.min(6, Math.round(shortSide / (TILE * 16))));
      k.setCamScale(zoom, zoom);
      overlay.style.setProperty("--label-size", `${Math.max(22, zoom * 9)}px`);
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

      sound("tap", { volume: 0.4 });
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

    k.onUpdate(() => {
      const dt = Math.min(k.dt(), 0.05);
      clock += dt;
      const fromX = position.x;
      const fromY = position.y;
      let moving = false;
      let facing = 0;

      if (!paused) {
        const { dx, dy } = keys.direction();

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

      stride += Math.hypot(position.x - fromX, position.y - fromY);
      if (stride >= STRIDE) {
        stride = 0;
        sound(`step-${1 + Math.floor(Math.random() * 3)}`, { volume: 0.3, speed: 0.9 + Math.random() * 0.2 });
      }
      shadowObject.pos = k.vec2(position.x, position.y + 6);

      const poiHere = !paused && !moving ? entryPoiHere() : undefined;
      hintElement.style.opacity = poiHere ? "1" : "0";
      place(hintElement, position.x, position.y + 14);

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

      for (const { element, x, y } of labels) place(element, x, y, "-100%");
    });
  });

  k.go("town");
  canvas.focus({ preventScroll: true });

  return {
    setPaused(value) {
      const wasPaused = paused;
      paused = value;
      keys.clear();
      if (!value) {
        canvas.focus({ preventScroll: true });
        if (wasPaused) sound("close", { volume: 0.5 });
      }
    },
    setMuted(value) {
      muted = value;
      if (!value) resumeAudio(); // called from the Sound button's click, so the browser allows it
      syncMusic();
    },
    destroy() {
      disarmUnlock();
      document.removeEventListener("visibilitychange", syncMusic);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseAllKeys);
      if (music) {
        music.pause();
        music.removeAttribute("src");
        music.load();
      }
      k.quit();
      overlay.replaceChildren();
      canvas.remove();
    },
  };
}
