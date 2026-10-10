# Tasks

## 1. Transition presentation state

- [x] 1.1 Generalize the shared arena transition controller into a `screen-transition` parent with a `screen-door` type and retain level-key handling for initial load, practice restart, and online round changes; verify repeated renders of one level key do not restart the transition.
- [x] 1.2 Add old/new arena presentation snapshot handling so the prior graphics remain visible until the 0.5-second closed-door cut and the new graphics are selected before opening; verify the cut with deterministic timing tests.
- [x] 1.3 Add midpoint continue and completion callbacks, and gate practice/online simulation, AI, and input while the transition is blocking; verify the handshake with deterministic timing tests.

## 2. Arena door layer

- [x] 2.1 Add the two grey, half-width arena doors inside the existing arena stage with responsive full-height sizing, symmetric offscreen transforms, and pointer-events disabled; verify the doors cover the canvas and player labels but not the adjacent menu/HUD panel.
- [x] 2.2 Use `src/content/systems/animation-system.js` to implement eased `screen-door` movement: close with ease-out deceleration and open with the reversed slow-start/fast-acceleration/plateau profile; preserve the 0.5-second close, 0.2-second hold, and 0.5-second open phases and verify the total 1.2-second sequence in browser timing checks at landscape and portrait sizes.
- [x] 2.3 Add the supplied `public/assets/door-half.png` artwork, use it for the left door, and mirror it for the right door; verify the focused browser check loads the textured door layer.

## 3. Mode integration and focused verification

- [x] 3.1 Integrate the transition into practice initial level creation/restart and online round presentation, pausing local simulation, AI, and input until completion without changing authoritative state; verify one transition per practice restart and online round change.
- [x] 3.2 Rename the presentation component and CSS hooks to the generic `screen-transition` parent plus `screen-door` type, then add focused unit/browser checks and documentation for the arena-only boundary, closed-door level cut, handshake, eased timing, and responsive compositions; verify the relevant browser assertions pass.
- [x] 3.3 Run `npm run build` and the existing applicable browser verification, confirming no menu/HUD regressions and no duplicate transition loops or listeners after remount; record the results with the change.

Verification: `npm run build`, focused screen-transition unit tests, and
`screen-transition-browser.mjs` pass. The full unit suite has one unrelated
pre-existing failure in `feedback-edge-cases.test.mjs` because its expected
plant-off seeded snapshot no longer matches the current power-up layout.
