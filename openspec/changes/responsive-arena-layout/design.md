# Design

## Context

See proposal.md for motivation and specs for observable behavior. `Viewport.jsx` currently renders a centered fixed-ratio stage surrounded by four gutters. Practice and online modes each render their own canvas and React HUD. `style.css` already uses the `pointer: coarse` media feature for touch behavior. `renderer.js` derives board dimensions from the live grid and uses 16 logical pixels per tile; the presentation helper uses an integer fit when it is at least 1× and a fractional fit below 1×.

## Goals / Non-Goals

**Goals:**

- Keep PC and mobile composition consistent with the platform, even when the physical viewport ratio differs from the usual one.
- Let the arena use the largest square slot that leaves enough room for the entire information panel.
- Keep rendering dimensions integer-valued and preserve the complete grid and hard pixel edges.
- Support simultaneous arena taps and panel steering gestures without losing keyboard controls or existing UI actions.

**Non-Goals:**

- No changes to game rules, simulation, authoritative multiplayer behavior, or server protocol.
- No player-facing aspect-ratio selector or settings that switch between PC and mobile compositions.
- No redesign of the game's art, audio, or existing information content.

## Decisions

### Select composition by platform input class

Use the existing primary-pointer media signal: browsers reporting a coarse primary pointer use the mobile stacked composition; browsers reporting a fine primary pointer use the PC side-by-side composition. Do not select composition from viewport aspect ratio. This builds on an input distinction the project already uses and avoids adding a user setting or device user-agent parser. On hybrid devices, follow the browser's reported primary pointer.

### Keep one viewport shell and reflow its content

Retain the shared `Viewport` shell and its four gutters. Inside it, give the canvas a square arena slot and arrange the same information-panel sequence beside it for PC and below it for mobile. Apply the same layout contract in practice and online mode while leaving their mode-specific React state and controls in their existing components. Use the available viewport dimensions to size the square slot; on mobile, reserve enough height for the complete panel before maximizing the slot. Compact panel spacing and type to fit; do not add panel scrolling. In a physically landscape mobile window, keep the stacked composition and shrink the arena slot as necessary.

The four corner roles remain associated with the overall viewport: title at upper left, project links at upper right, settings at lower left, and version at lower right. Place each within the reflowed composition without covering the rendered arena or hiding panel content.

### Derive integer rendering dimensions from the active grid

Use the current grid's width and height instead of the fixed arena dimensions to derive positive integer render dimensions. Keep nearest-sampled artwork and center the full grid within the square slot. Prefer an integer logical-to-display fit; when the full native resolution cannot fit cleanly, select a lower integer render resolution or leave unused room around the board. Never crop, stretch, or use fractional render dimensions to fill the slot. Document the selected logical, render, backing, and display mappings in `documentation/rendering.md`.

This keeps future maps with different row or column counts within the same layout. A continuously fractional fit would fill more of the slot, but would weaken the requested pixel alignment; the plan accepts some unused room or reduced arena detail to retain crisp pixels.

### Use pointer gestures on existing render and panel areas

Keep keyboard input in `controls.js`. On mobile, a tap in the canvas area sends the existing bomb action. A touch gesture may begin anywhere in the information panel; after the pointer movement crosses a small direction threshold, hold that direction until pointer release, cancellation, blur, or page hide. Use pointer IDs and capture so each finger releases only its own action and a panel swipe can coexist with a separate arena tap. A stationary tap on an interactive panel control continues to activate that control; a gesture that crosses the threshold steers instead of activating it. This replaces the visible movement pad and bomb button with the gesture areas described in the proposal.

## Risks / Trade-offs

- [Risk] A hybrid device may be classified according to an unexpected primary pointer → Follow the browser's primary-pointer report, retain keyboard support, and include coarse- and fine-pointer checks.
- [Risk] A short mobile viewport can make the square arena small when the complete panel must fit without scrolling → Compact panel spacing and typography first, then reduce the arena slot; verify portrait and physically landscape mobile windows.
- [Risk] Lower integer rendering resolution can reduce sprite detail → Preserve nearest sampling and full-board visibility, and document the selected mapping.
- [Risk] Gesture handling can interfere with panel buttons or leave movement active → Apply a swipe threshold, preserve ordinary taps, use pointer capture, and clear input on every release and lifecycle cancellation path.

## Migration Plan

This is a client presentation and input change with no persisted-data or server migration. Update both practice and online layouts and their browser coverage together. If the layout or gesture behavior needs rollback, revert the client UI, renderer sizing, input, and rendering-documentation changes as one release.
