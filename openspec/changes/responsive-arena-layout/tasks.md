# Tasks

## 1. Landscape viewport and information panel

- [x] 1.1 Keep the shared viewport at 16:9 landscape with the arena left of the panel on fine- and coarse-pointer browsers, preserving four gutters; show a rotate notice on portrait-held touch devices and verify both states in `ui-browser.mjs`.
- [x] 1.2 Reflow practice and online HUD, status, power-up information, settings, instructions, links, version, and corner roles into the shared landscape panel; verify the panel is fully visible without scrolling and the arena slot is square on desktop and landscape-held mobile.

## 2. Grid-derived integer arena rendering

- [x] 2.1 Update renderer sizing to derive positive integer render dimensions from the active grid, fit the complete board within its slot without crop/stretch/fractional render dimensions, and preserve nearest-sampled edges; verify the LOW, MED, and HIGH boards remain fully visible through `graphics-browser.mjs` at representative slot sizes.
- [x] 2.2 Update `documentation/rendering.md` with the shared landscape layout, portrait rotation guidance, and logical, render, backing, and display mappings; verify each documented mapping matches the renderer behavior.

## 3. Touch gesture controls

- [x] 3.1 Add mobile arena-tap bomb placement and information-panel swipe steering that holds direction until release, using pointer identity/capture and cleanup on cancellation, blur, and page hide; add focused coverage for swipe thresholds, ordinary panel taps, simultaneous swipe-and-bomb input, and release cleanup.
- [x] 3.2 Preserve WASD/arrows/Space behavior and update `documentation/game-rules.md` to explain desktop keys and mobile gestures; verify keyboard capitalization/keyup and gesture documentation match the behavior.

## 4. Cross-mode verification

- [x] 4.1 Verify practice and online modes retain readable HUD, the four corner roles, fullscreen resizing, no-scroll panel fit in landscape, and a portrait-held rotate notice; run `npm test`, `npm run build`, and `npm run test:browser` where the required backend and Chrome WebGPU environment are available.
