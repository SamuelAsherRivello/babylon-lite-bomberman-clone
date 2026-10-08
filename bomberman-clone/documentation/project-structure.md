# Project structure

This is the existing Bomberman Clone repository. The repository root owns npm dependencies, Vite configuration, CI, OpenSpec, and versioning. `bomberman-clone/` is the Vite application root; keep that path and its history. The shared multiplayer server is a separate repository and is consumed through the pinned `@rmc/multiplayer-client` package.

| Path | Responsibility | Main entry or consumer |
| --- | --- | --- |
| `bomberman-clone/index.html` | Browser document and `ui_layer` mount point | Vite |
| `bomberman-clone/src/main.jsx` | React root and global styles | `index.html` |
| `bomberman-clone/src/App.jsx` | Mode selection and local practice loop | `main.jsx` |
| `bomberman-clone/src/Online.jsx` | Room connection, online input, snapshots, and online HUD | `App.jsx` |
| `bomberman-clone/src/game/` | Local deterministic rules, CPU choices, prediction, death view, and invite link construction | Practice and online modes, tests |
| `bomberman-clone/src/input/` | Keyboard and pointer input with cleanup on focus loss and disposal | Practice and online modes |
| `bomberman-clone/src/content/` | Babylon Lite WebGPU renderer, generated pixel art, audio, and initialization errors | Practice and online modes |
| `bomberman-clone/src/ui/` | Reused React viewport, options, legends, and audio settings | Practice and online modes |
| `bomberman-clone/src/style.css` | Viewport, HUD, overlays, and responsive presentation | `main.jsx` |
| `bomberman-clone/test/` | Local `*.test.mjs` checks and named browser scenarios | Root npm scripts and README |
| `bomberman-clone/documentation/` | Current rules, rendering and audio details, verification records, and historical briefs/assets | README and contributors |
| `openspec/` | Accepted specifications and proposed/archived changes | Substantial behavior changes |

## Dependency and state boundaries

React mode components compose the input, game, content, and UI modules. `src/game/rules.js` owns local practice simulation and exposes deterministic state transitions. Online outcomes come from the remote authoritative room; `src/game/prediction.js` uses the pinned client package only to predict local movement and draw a reconciled view. Do not treat rendered or predicted state as a source of authoritative damage, scoring, or room progression.

`src/content/renderer.js` owns Babylon Lite engine creation and disposal. `src/content/audio.js` owns Web Audio resources. `src/input/controls.js` owns browser input listeners and releases held input on loss of focus. React owns menus, HUD, settings, and the four corner roles. Keep primary UI inside the viewport so fullscreen remains usable.

## Where changes belong

- Put deterministic arena behavior and CPU decisions in `src/game/`; update the local tests and the shared server/client contract when online behavior also changes.
- Put network connection and room UI changes in `Online.jsx`; keep server-owned decisions on the server.
- Put input translation in `src/input/` and graphics or sound resources in `src/content/`.
- Put reusable React controls in `src/ui/`. Add a new shared component only when both modes need the same behavior; preserve their different pause and network semantics.
- Put current implementation guidance in `documentation/`. Keep dated verification records and historical prompts clearly historical.
- Put deterministic tests in `test/*.test.mjs`; use the named browser scripts for WebGPU, presentation, audio, or live multiplayer behavior.

See [coding standards](coding-standards.md) for source conventions and [rendering](rendering.md) for the current presentation mapping. The current orientation implementation is outside this standardization pass.
