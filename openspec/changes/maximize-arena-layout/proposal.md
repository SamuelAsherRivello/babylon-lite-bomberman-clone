# Proposal

## Why

The current responsive compositions preserve a square arena, but they do not allocate space according to the game's priority: the playable world should be as large as practical before the surrounding menu receives space. In landscape aspect, the menu reserves more width than necessary; in portrait aspect, unused vertical space around the gameplay presentation reduces the space available to the menu.

## What Changes

- Make the landscape aspect allocate the largest practical undistorted board region before sizing the information panel.
- Allow the landscape information panel to become narrower while remaining readable, complete, and non-scrolling.
- Make the portrait aspect transfer unnecessary vertical dead space around the gameplay presentation to the information panel.
- Preserve a fully visible, uncropped, undistorted arena whose visible gameplay bounds follow the active board aspect so letterboxed dead space is not reserved ahead of the menu.
- Preserve pointer-based aspect selection: fine-pointer devices use landscape and coarse-pointer devices use portrait, including when a mobile device is held in landscape.
- Remove temporary red arena and purple viewport debug outlines from the final presentation.
- Render all four player-name labels as compact gameplay-area corner-row overlays: top labels on the first playable row, bottom labels on the last playable row, with each label no taller than one tile/grid row and anchored to its matching left or right corner.
- Add browser verification for arena prioritization, portrait space recovery, panel fit, no overlap, no scrolling, resize, fullscreen, and mobile-held-landscape behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `arcade-presentation`: Change the responsive composition so the gameplay region receives priority sizing and the complete supporting panel uses the remaining viewport space.
- `pixel-perfect-presentation`: Clarify board-aspect gameplay sizing and responsive fit behavior for both landscape and portrait aspects without cropping, stretching, or losing pixel alignment.

## Impact

- `bomberman-clone/src/style.css`: responsive grid allocation, arena sizing, panel sizing, and removal of temporary debug outlines.
- `bomberman-clone/src/ui/Viewport.jsx` and related UI components only if the final debug-outline cleanup requires markup changes.
- `bomberman-clone/test/` browser layout checks: assertions for maximum practical board-aspect sizing, recovered portrait menu space, panel fit, and no-scroll behavior.
- `bomberman-clone/src/ui/ArenaPlayers.jsx` and related styles/tests: in-game player-label placement at the four playable corner cells.
- `bomberman-clone/documentation/rendering.md` and related layout documentation: update the sizing contract and verification evidence.
- No new dependencies, server changes, gameplay rules, input behavior, or public API changes are expected.
