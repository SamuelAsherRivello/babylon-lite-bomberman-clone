# Project structure

This is the existing Bomberman Clone repository. The repository root owns npm dependencies, Vite configuration, CI, OpenSpec, and versioning. `bomberman-clone/` is the Vite application root; keep that path and its history. The shared multiplayer server is a separate repository and is consumed through the pinned `@rmc/multiplayer-client` package.

| Path | Responsibility | Main entry or consumer |
| --- | --- | --- |
| `bomberman-clone/index.html` | Browser document and `ui_layer` mount point | Vite |
| `bomberman-clone/src/main.jsx` | React root and global styles | `index.html` |
| `bomberman-clone/src/App.jsx` | Default online entry, page-visit aspect selection, and local practice loop | `main.jsx` |
| `bomberman-clone/src/Online.jsx` | Room connection, online input, snapshots, and online HUD | `App.jsx` |
| `bomberman-clone/src/game/` | Local deterministic rules, CPU choices, online prediction, practice death view, server URL resolution, and invite link construction | Practice and online modes, tests |
| `bomberman-clone/src/input/` | Keyboard and pointer input with cleanup on focus loss and disposal | Practice and online modes |
| `bomberman-clone/src/content/` | Babylon Lite WebGPU renderer, generated pixel art, audio, and initialization errors | Practice and online modes |
| `bomberman-clone/src/content/systems/` | Renderer-owned runtime systems, including particle lifecycle, particle atlas assembly, and the animation-system boundary | `content/renderer.js` |
| `bomberman-clone/src/ui/` | Reused React viewport, top navigation, arena player labels, options, legends, and audio settings | Practice and online modes |
| `bomberman-clone/src/style.css` | Viewport, HUD, overlays, and responsive presentation | `main.jsx` |
| `bomberman-clone/test/` | Local `*.test.mjs` checks, named browser scenarios, and explicit backend safety gate | Root npm scripts and README |
| `bomberman-clone/documentation/` | Current rules, rendering and audio details, verification records, and historical briefs/assets | README and contributors |
| `openspec/` | Accepted specifications and proposed/archived changes | Substantial behavior changes |
| `scripts/dev-multiplayer.mjs` | Prepare the compatible local server release and start separate play/test processes with Vite | Root `npm run dev` |

## Dependency and state boundaries

React mode components compose the input, game, content, and UI modules. `src/game/rules.js` owns local practice simulation and exposes deterministic state transitions. Online outcomes come from the remote authoritative room; `src/game/prediction.js` uses the local rules to predict movement and draw a reconciled view. The pinned client package provides the room connection. Do not treat rendered or predicted state as a source of authoritative damage, scoring, or room progression.

`src/content/renderer.js` owns Babylon Lite engine creation and disposal. `src/content/systems/` owns renderer-side runtime systems and particle presentation helpers; it does not own authoritative game state. `src/content/audio.js` owns Web Audio resources. `src/input/controls.js` owns browser input listeners and releases held input on loss of focus. `src/ui/preferences.js` owns browser storage for battle options, visual toggles, audio settings, and the remembered online/offline mode. React owns menus, HUD, settings, and the four corner roles. Keep primary UI inside the viewport so fullscreen remains usable.

## Where changes belong

- Put deterministic arena behavior and CPU decisions in `src/game/`; update the local tests and the shared server/client contract when online behavior also changes.
- Put network connection and room UI changes in `Online.jsx`; keep server-owned decisions on the server.
- Put input translation in `src/input/`, static graphics and resource orchestration in `src/content/`, and stateful renderer-only systems in `src/content/systems/`.
- Put reusable React controls in `src/ui/`. Add a new shared component only when both modes need the same behavior; preserve their different pause and network semantics.
- Put current implementation guidance in `documentation/`. Keep dated verification records and historical prompts clearly historical.
- Put deterministic tests in `test/*.test.mjs`; use the named browser scripts for WebGPU, presentation, audio, or live multiplayer behavior.

See [coding standards](coding-standards.md) for source conventions and [rendering](rendering.md) for the pointer-based aspect default and selectable 16:9/9:16 presentation mapping.
