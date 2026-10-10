# Tasks

## 1. Responsive layout sizing

- [x] 1.1 Update the landscape `.game-layout` grid constraints so the undistorted board receives the largest practical usable region before the information panel, and verify the gameplay rectangle expands while the panel becomes narrower at a wide landscape viewport.
- [x] 1.2 Update the portrait grid row allocation so the board-aspect gameplay region remains fully visible while letterboxed dead space is transferred to the panel, and verify the panel grows into the recovered space without scrolling at portrait and mobile-held-landscape viewports.
- [x] 1.3 Preserve the separate arena-slot, panel, renderer, and input boundaries while adjusting CSS sizing, and verify there is no overlap, cropping, stretching, or changed pointer-based aspect selection.
- [x] 1.4 Re-anchor the four player-name label divs to the matching left/right corners of the first/last playable rows, cap each label's total height at one tile/grid row, and preserve player ordering; verify no label is outside, taller than its row, or clipped.

## 2. Browser layout coverage

- [x] 2.1 Extend the browser layout checks to measure landscape arena/panel rectangles and assert the largest-practical board-aspect region and compact-readable-panel relationship across wide, narrow, short, and tall landscape viewports.
- [x] 2.2 Extend the browser layout checks to assert portrait board-aspect sizing, recovered panel space, complete panel fit, no scrollbars, and the unchanged stacked composition when a mobile device is held in landscape.
- [x] 2.3 Add resize and fullscreen assertions for both aspects, including complete arena visibility, stable input/display mapping, and preserved four corner roles; verify the relevant browser test command passes.
- [x] 2.4 Extend browser geometry assertions to verify all four labels are inside the gameplay bounds, aligned with the first/last playable rows, anchored to matching left/right corners, no taller than one tile, ordered correctly, and visible across LOW, MED, and HIGH maps.

## 3. Diagnostics and documentation

- [x] 3.1 Remove the temporary red arena and purple viewport outlines after the geometry checks pass, and verify the final browser presentation contains neither debug outline.
- [x] 3.2 Update `bomberman-clone/documentation/rendering.md` with the final arena-priority sizing rules, the distinction between outer layout space and intrinsic board letterboxing, and the verified viewport profiles; verify the documented behavior matches the browser checks.
- [x] 3.3 Document the in-game player-label corner-row placement and one-tile height cap in `bomberman-clone/documentation/rendering.md`; verify the documentation matches the browser geometry assertions.

## 4. Integration verification

- [x] 4.1 Run `npm run format:check`, `npm test`, and `npm run build`, and resolve any regressions caused by the layout change.
- [x] 4.2 Run the relevant browser verification with the isolated local test backend when multiplayer startup is required, inspect screenshots for landscape and portrait aspects, and verify the final arena/menu relationship against the acceptance scenarios.
