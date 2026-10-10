# Proposal

## Why

The top navigation describes mode changes as actions rather than showing the current mode, and its GitHub link does not match the buttons or remain visible on sideways-held phones. Players also cannot choose between the existing 16:9 landscape and 9:16 portrait compositions when the pointer-based default does not suit them.

## What Changes

- Show three consistent top-navigation controls in local practice and online play: `Mode: Offline` or `Mode: Online`, `Aspect: Landscape` or `Aspect: Portrait`, and the existing `GitHub ↗` link styled like a button.
- Make the mode and aspect labels report the current state and allow their buttons to switch that state. The aspect defaults to landscape for a fine primary pointer and portrait for a coarse primary pointer; a player choice remains active across mode changes for the current page visit.
- Open online play when the URL has no `mode` argument. Keep `mode=online` and room invitation links working, and allow `mode=offline` to open local practice directly. This changes the initial game mode only: local Vite still defaults to its local backend, and the published client still defaults to the public backend.
- Use the selected aspect to display the 16:9 side-by-side composition or the 9:16 stacked composition on either pointer class. Keep device-appropriate keyboard and touch input, the complete arena, the four corner roles, and the information panel usable in windowed and fullscreen layouts.
- Keep all three controls visible and usable in compact mobile windows, including when a phone is physically held sideways. Preserve the GitHub text and destination.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `arcade-presentation`: Allow a player-selected composition while preserving the complete, readable arena and panel on PC and mobile.
- `pixel-perfect-presentation`: Define the aspect and mode controls, their labels and state, and viewport behavior after a composition switch.

## Impact

- Affected client UI and styles: `bomberman-clone/src/App.jsx`, `bomberman-clone/src/Online.jsx`, `bomberman-clone/src/ui/Viewport.jsx`, `bomberman-clone/src/style.css`, and a shared navigation component in `bomberman-clone/src/ui/`.
- Affected documentation and browser checks: `README.md`, `bomberman-clone/documentation/rendering.md`, `bomberman-clone/test/ui-browser.mjs`, and browser scripts that currently assume local practice is the default.
- No new dependency, game-rule change, server protocol change, or new external destination is expected.
