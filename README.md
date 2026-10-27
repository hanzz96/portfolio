# Johan Andreas Pranoto Portfolio

A fullstack developer portfolio built with Vue 3 and Vite. Walk a small 2D town to explore the
portfolio: every building or NPC opens a section (About, Projects, Experience, Skills, Contact).

The original scrolling page is still available at `?view=classic` (or the **Classic view** button).

## Controls

| Input | Action |
| --- | --- |
| Tap / click | Walk to that spot. Tap a building or NPC to walk to its door and open it. |
| WASD / arrow keys | Walk. |
| E / Enter / Space | Open the section at the door you are standing on. |
| Esc | Close the open panel. |
| Sound button | Footsteps, UI sounds and music. Off by default; the choice is remembered. |

## Run Locally

```bash
node version used 24.^
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Test and Build

```bash
npm test
npm run build
```

## Structure

- `src/game/`: the town. `world.js` is the map and collision data, `pathfinding.js` is tap-to-move,
  `createGame.js` wires them to [Kaplay](https://kaplayjs.com/). The game bundle is lazy-loaded.
- `src/views/`: `GameView.vue` (the town) and `ClassicView.vue` (the scrolling page).
- `src/data/`: portfolio content shared by both views.

## Credits

Tilesets are [Tiny Town](https://kenney.nl/assets/tiny-town) and
[Tiny Dungeon](https://kenney.nl/assets/tiny-dungeon) by [Kenney](https://kenney.nl), released under
CC0. Sound effects come from Kenney's [Interface Sounds](https://kenney.nl/assets/interface-sounds) and
[RPG Audio](https://kenney.nl/assets/rpg-audio) (CC0, converted to WAV). Their licenses are kept in
`public/game/`. Technology icons are from [Simple Icons](https://simpleicons.org) (CC0); the logos remain
trademarks of their respective owners.
