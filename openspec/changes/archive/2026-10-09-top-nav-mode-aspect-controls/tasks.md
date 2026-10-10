# Tasks

## 1. Mode entry and shared top navigation

- [x] 1.1 Make `App.jsx` open online play by default, honor `mode=offline`, and keep `mode=online` and room links compatible; verify direct-entry cases in the browser UI check without changing `resolveMultiplayerServer` defaults.
- [x] 1.2 Add a shared upper-right navigation component for both modes with current-state Mode and Aspect buttons plus the existing GitHub anchor styled as a button; verify the labels, toggles, and GitHub destination in both modes through the browser UI check.
- [x] 1.3 Update browser scripts that assume practice loads with no arguments or click the old `Play online` label, using explicit `mode=offline` for practice checks; verify their entry assertions and run the affected local browser checks against an isolated backend where online checks require one.
- [x] 1.4 Document default online entry, `mode=offline`, existing server defaults, and the three nav controls in `README.md`; verify the documented URLs match the browser entry checks.

## 2. Selectable aspect and responsive presentation

- [x] 2.1 Keep the pointer-based default and a page-visit aspect override in `App.jsx`, pass the effective aspect to both mode views and `Viewport.jsx`, and verify the selected aspect survives mode switches but resets on reload.
- [x] 2.2 Refactor `style.css` so the selected aspect controls 16:9 side-by-side or 9:16 stacked composition while pointer-specific input styling remains device-based; verify desktop portrait and touch landscape combinations in the browser UI check.
- [x] 2.3 Fit the shared header/nav at compact portrait and sideways-held mobile sizes without hiding GitHub or scrolling the information panel; verify all controls, corner bounds, square arena, complete panel, and fullscreen behavior in the browser UI check for both modes and aspects.
- [x] 2.4 Update `bomberman-clone/documentation/rendering.md` with the pointer default, manual aspect selection, 16:9 and 9:16 mappings, and page-visit lifetime; verify its described layout matrix matches the browser checks.

## 3. Integrated verification

- [x] 3.1 Run `npm test`, `npm run build`, and the updated browser UI check from the repository root; verify all pass with no React or browser page errors.
- [x] 3.2 Run the multiplayer browser smoke path with `BACKEND_URL` set to a separate local or test backend, including default online entry and a room invitation; verify the client connects to that backend and never targets the public backend unintentionally.
