# Proposal

## Why

The current fixed landscape viewport leaves substantial unused space around the arena and compresses supporting information into a narrow rail, especially on phones. Assigning the landscape composition to PCs and the portrait composition to mobile devices will make the arena and match information easier to use on each platform without asking players to choose a layout.

## What Changes

- Replace the fixed landscape-only composition with platform-specific layouts: PC uses a square arena slot on the left and the information panel on the right; mobile uses the arena at the top and the same panel below it, even when the mobile device is held in landscape.
- Fit all supporting information in the viewport without scrolling, compacting the panel and reducing the arena slot as needed. Preserve the four established corner roles.
- Keep keyboard movement on WASD/arrows and bomb placement on Space. On touch devices, tapping the rendered arena places a bomb; directional swipes that start in the surrounding UI area move the player while held, and release, cancellation, or loss of focus stops movement.
- Derive positive integer render dimensions from the current arena grid and fit the complete board into its slot while preserving pixel-perfect artwork. Use integer sizing and allow the board to be slightly smaller when needed; never stretch or crop the board. Support future row and column counts without layout-specific constants.
- Update rendering documentation and verification coverage for both platform layouts, device resizing/orientation changes, fullscreen, and touch input.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `arcade-presentation`: Replace the fixed landscape viewport presentation requirement with PC landscape and mobile portrait compositions, a complete no-scroll information panel, and preserved UI roles/fullscreen usability.
- `pixel-perfect-presentation`: Define grid-derived integer arena fitting and arena-tap / information-panel swipe touch controls while retaining keyboard controls and input cleanup.

## Impact

- Affected UI: `bomberman-clone/src/ui/Viewport.jsx`, `bomberman-clone/src/App.jsx`, `bomberman-clone/src/Online.jsx`, and `bomberman-clone/src/style.css`.
- Affected rendering and input: `bomberman-clone/src/content/renderer.js` and `bomberman-clone/src/input/controls.js`.
- Affected documentation and checks: `bomberman-clone/documentation/rendering.md` and the existing browser UI/input verification.
- No new dependency or server protocol is expected. The game rules and authoritative multiplayer model remain unchanged.
