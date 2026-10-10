# Design

## Context

The existing React viewport uses `src/style.css` to select a landscape or portrait composition through `data-aspect`. `.game-layout` owns the arena/panel grid, `.arena-stage` owns the board-aspect gameplay region, and the renderer owns the board's logical-to-display mapping. The change must preserve the existing pointer-based composition, pixel-art rendering, corner roles, and no-scroll viewport behavior.

## Goals / Non-Goals

**Goals:**

- Make the board region the first-class sizing constraint in landscape aspect.
- Let the information panel contract to the remaining readable width.
- Make portrait arena-row sizing stop reserving avoidable space and give that space to the panel.
- Keep layout calculations separate from renderer resolution and input mapping.
- Remove temporary visual diagnostics after the layout is accepted.
- Keep all four player labels inside the gameplay region as compact corner-row overlays: top labels occupy the first playable row, bottom labels occupy the last playable row, and each label is no taller than that row's tile size.

**Non-Goals:**

- No change to game rules, arena maps, player controls, networking, audio, or WebGPU setup.
- No change to pointer-class aspect selection or the user-facing aspect behavior.
- No stretching, cropping, or deliberate distortion of the rectangular board; the visible arena region may use the active board aspect so intrinsic letterboxing is not presented as layout space.
- No new dependency or server change.

## Decisions

### Prioritize the gameplay region through the layout grid

Adjust the landscape grid's competing minimums so the gameplay region is calculated from the largest board-aspect area that fits the usable viewport, while the panel receives only the remaining width required for its compact readable layout. The gameplay region and panel remain separate grid items and may not overlap.

The alternative of allowing the panel to retain its current preferred width was rejected because it preserves the exact failure visible in the landscape aspect: the panel receives more width than the player's primary gameplay view needs.

### Give portrait space to the panel through explicit row allocation

Keep the portrait grid stacked, but derive the first row from the board-aspect gameplay region's available width and the second row from the remaining height. Replace fixed or overly conservative panel-height reservation with a compact minimum that is verified against the complete panel contents. This allows the panel to expand into recovered space without letterboxed layout bands.

The alternative of retaining a square slot was rejected because it reserves visible black bands around the rectangular board and directly conflicts with the user's requirement to give that space to the menu.

### Size the visible gameplay region to the board aspect

The layout slot and visible gameplay region will use the active board aspect, derived from the current map dimensions, so the rendered 15×13, 19×15, or 23×17 board does not reserve black bands above and below it. The renderer continues to determine the logical board's pixel mapping and integer tile size inside that region. CSS sizing must preserve square pixels and the complete board while the panel receives the recovered space.

The alternative of stretching the board to fill a square was rejected because it would violate crisp, undistorted pixel presentation. The earlier square-slot assumption is superseded by the user's explicit requirement to transfer visible dead space to the menu.

### Place player labels on playable corner rows

Position the four noninteractive labels as overlays within the rendered gameplay region. The top pair is anchored to the first playable row and the bottom pair to the last playable row; left labels are anchored to the left corner and right labels to the right corner. The overlay row height is exactly one tile, and each label's total border-box height is capped at one tile so its text appears on one grid row. The top pair and bottom pair retain their left/right ordering and continue to track the four arena corner players. Horizontal text may ellipsize when needed, but labels may not grow vertically or move into the surrounding gap.

The alternative of leaving labels inset toward the board center was rejected because it makes the player identity appear detached from its corner and can obscure multiple grid rows.

### Verify with browser geometry, not screenshot appearance alone

Extend the existing browser layout checks to measure the gameplay and panel rectangles, assert the active board aspect, compare the gameplay region against the usable viewport and panel minimum, and assert that the panel fits without scrolling. Capture representative landscape, portrait, mobile-held-landscape, resize, and fullscreen evidence after the geometry checks pass.

### Remove diagnostics only after geometry passes

Remove the temporary red arena and purple viewport outlines from the final CSS or markup once the browser assertions establish the intended boundaries. They remain implementation diagnostics only and are not part of the layout contract.

## Risks / Trade-offs

- [Risk] A narrower panel can cause text or controls to wrap excessively. -> [Mitigation] Use the existing compact panel rules and assert readable, complete content at the minimum panel width.
- [Risk] A portrait panel may overflow at very short heights. -> [Mitigation] Test short/tall portrait viewports and preserve the existing compacting rules; fail the layout check if scrolling or clipping appears.
- [Risk] Labels can obscure the corner tiles or collide with each other on narrow maps. -> [Mitigation] Use one-tile corner rows, cap each label's border-box height to one tile, retain compact text sizing/ellipsis, and assert row alignment, height, and bounds in every tested map and viewport.
- [Risk] Changing grid constraints can affect fullscreen and unusual aspect ratios. -> [Mitigation] Run resize/fullscreen checks across wide, narrow, tall, and short viewport profiles before acceptance.
