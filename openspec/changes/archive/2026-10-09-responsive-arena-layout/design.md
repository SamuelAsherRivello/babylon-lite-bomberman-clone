# Design

## Context

See proposal.md for motivation and specs for observable behavior. `Viewport.jsx` currently renders a centered fixed-ratio stage surrounded by four gutters. Practice and online modes each render their own canvas and React HUD. `style.css` already uses the `pointer: coarse` media feature for touch behavior. `renderer.js` derives board dimensions from the live grid and uses 16 logical pixels per tile; the presentation helper uses an integer fit when it is at least 1× and a fractional fit below 1×.

## Goals / Non-Goals

**Goals:**

- Keep one landscape composition on PC and mobile. A portrait-held touch device prompts rotation instead of switching layouts.
- Let the arena use the largest square slot that leaves enough room for the entire information panel.
- Keep rendering dimensions integer-valued and preserve the complete grid and hard pixel edges.
- Support simultaneous arena taps and panel steering gestures without losing keyboard controls or existing UI actions.

**Non-Goals:**

- No changes to game rules, simulation, authoritative multiplayer behavior, or server protocol.
- No player-facing aspect-ratio selector or settings that switch between PC and mobile compositions.
- No redesign of the game's art, audio, or existing information content.

## Decisions

### Keep one landscape composition

Use the same 16:9 landscape viewport and side-by-side arena/panel layout for fine- and coarse-pointer browsers. Coarse-pointer media rules may compact typography and spacing without changing orientation or region order. A coarse-pointer device held in portrait displays a rotate-to-landscape notice over the viewport; it does not present a playable portrait layout. Keep keyboard support on hybrid devices and do not add an orientation selector or saved override.

### Keep one viewport shell and reflow its content

Retain the shared `Viewport` shell and its four gutters. Inside it, give the canvas a square arena slot and arrange the same information-panel sequence beside it on PC and mobile. Apply the same layout contract in practice and online mode while leaving their mode-specific React state and controls in their existing components. Use the available landscape viewport dimensions to size the square slot. Compact spacing and type on narrow touch devices so the complete panel fits without scrolling.

The four corner roles remain associated with the overall viewport: title at upper left, project links at upper right, settings at lower left, and version at lower right. Place each within the reflowed composition without covering the rendered arena or hiding panel content.

### Derive integer rendering dimensions from the active grid

Use the current grid's width and height instead of the fixed arena dimensions to derive positive integer render dimensions. Keep nearest-sampled artwork and center the full grid within the square slot. Prefer an integer logical-to-display fit; when the full native resolution cannot fit cleanly, select a lower integer render resolution or leave unused room around the board. Never crop, stretch, or use fractional render dimensions to fill the slot. Document the selected logical, render, backing, and display mappings in `documentation/rendering.md`.

This keeps future maps with different row or column counts within the same layout. A continuously fractional fit would fill more of the slot, but would weaken the requested pixel alignment; the plan accepts some unused room or reduced arena detail to retain crisp pixels.

### Use pointer gestures on existing render and panel areas

Keep keyboard input in `controls.js`. On mobile, a tap in the canvas area sends the existing bomb action. A touch gesture may begin anywhere in the information panel; after the pointer movement crosses a small direction threshold, hold that direction until pointer release, cancellation, blur, or page hide. Use pointer IDs and capture so each finger releases only its own action and a panel swipe can coexist with a separate arena tap. A stationary tap on an interactive panel control continues to activate that control; a gesture that crosses the threshold steers instead of activating it. This replaces the visible movement pad and bomb button with the gesture areas described in the proposal.

## Risks / Trade-offs

- [Risk] A hybrid device may report an unexpected primary pointer → Pointer class changes only compact styling and gestures; the landscape composition and keyboard support remain stable.
- [Risk] A short mobile landscape viewport can make the square arena or panel small → Compact panel spacing and typography first, then reduce the arena slot; verify both regions in landscape and the rotation notice in portrait.
- [Risk] Lower integer rendering resolution can reduce sprite detail → Preserve nearest sampling and full-board visibility, and document the selected mapping.
- [Risk] Gesture handling can interfere with panel buttons or leave movement active → Apply a swipe threshold, preserve ordinary taps, use pointer capture, and clear input on every release and lifecycle cancellation path.

## Migration Plan

This is a client presentation and input change with no persisted-data or server migration. Update both practice and online layouts and their browser coverage together. If the layout or gesture behavior needs rollback, revert the client UI, renderer sizing, input, and rendering-documentation changes as one release.
