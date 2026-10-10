# Proposal

## Why

The existing landscape viewport leaves substantial unused space around the arena and compresses supporting information into a narrow rail, especially on phones. The project remains landscape-only. Reflowing the arena and information panel within one 16:9 composition will improve readability without adding an orientation choice.

## What Changes

- Keep one 16:9 landscape viewport on desktop and mobile, with a square arena slot on the left and the information panel on the right. A portrait-held phone shows a rotate-to-landscape notice rather than a second game layout.
- Fit all supporting information in the viewport without scrolling, compacting the panel and reducing the arena slot as needed. Preserve the four established corner roles.
- Keep keyboard movement on WASD/arrows and bomb placement on Space. On touch devices, tapping the rendered arena places a bomb; directional swipes that start in the surrounding UI area move the player while held, and release, cancellation, or loss of focus stops movement.
- Derive positive integer render dimensions from the current arena grid and fit the complete board into its slot while preserving pixel-perfect artwork. Use integer sizing and allow the board to be slightly smaller when needed; never stretch or crop the board. Support future row and column counts without layout-specific constants.
- Update rendering documentation and verification coverage for landscape desktop and touch devices, portrait rotation guidance, resizing, fullscreen, and touch input.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `arcade-presentation`: Keep the landscape viewport requirement while adding a complete no-scroll information panel, a portrait-held rotate notice, and preserved UI roles/fullscreen usability.
- `pixel-perfect-presentation`: Define grid-derived integer arena fitting and arena-tap / information-panel swipe touch controls while retaining keyboard controls and input cleanup.

## Impact

- Affected UI: `bomberman-clone/src/ui/Viewport.jsx`, `bomberman-clone/src/App.jsx`, `bomberman-clone/src/Online.jsx`, and `bomberman-clone/src/style.css`.
- Affected rendering and input: `bomberman-clone/src/content/renderer.js` and `bomberman-clone/src/input/controls.js`.
- Affected documentation and checks: `bomberman-clone/documentation/rendering.md` and the existing browser UI/input verification.
- No new dependency or server protocol is expected. The game rules and authoritative multiplayer model remain unchanged.
