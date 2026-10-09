# Tasks

## 1. Platform-specific viewport and information panel

- [x] 1.1 Update the shared viewport shell and styles to select the PC landscape layout for fine-pointer browsers and the mobile stacked layout for coarse-pointer browsers, preserving the four gutters; verify desktop/mobile layout selection at multiple viewport shapes in `ui-browser.mjs`.
- [x] 1.2 Reflow practice and online HUD, status, power-up information, settings, instructions, links, version, and corner roles into the shared panel pattern; extend `ui-browser.mjs` to verify the panel is fully visible without scrolling, the arena slot is square, and mobile remains stacked when held in landscape.

## 2. Grid-derived integer arena rendering

- [x] 2.1 Update renderer sizing to derive positive integer render dimensions from the active grid, fit the complete board within its slot without crop/stretch/fractional render dimensions, and preserve nearest-sampled edges; verify the LOW, MED, and HIGH boards remain fully visible through `graphics-browser.mjs` at representative slot sizes.
- [x] 2.2 Update `documentation/rendering.md` with PC/mobile layout selection and logical, render, backing, and display mappings, removing outdated fixed-landscape and fractional-fit claims; verify each documented mapping matches the renderer behavior.

## 3. Touch gesture controls

- [x] 3.1 Add mobile arena-tap bomb placement and information-panel swipe steering that holds direction until release, using pointer identity/capture and cleanup on cancellation, blur, and page hide; add focused coverage for swipe thresholds, ordinary panel taps, simultaneous swipe-and-bomb input, and release cleanup.
- [x] 3.2 Preserve WASD/arrows/Space behavior and update `documentation/game-rules.md` to explain desktop keys and mobile gestures; verify keyboard capitalization/keyup and gesture documentation match the behavior.

## 4. Cross-mode verification

- [x] 4.1 Verify practice and online modes retain readable HUD, the four corner roles, fullscreen resizing, no-scroll panel fit, and correct PC/mobile composition; run `npm test`, `npm run build`, and `npm run test:browser` where the required backend and Chrome WebGPU environment are available.
