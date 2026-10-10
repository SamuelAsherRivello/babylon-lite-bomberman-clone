# 2DPixelPerfect presentation

Babylon Lite 1.32.0 native SpriteRenderer renders the arena with WebGPU only.
Original code-authored 16×16 pixel textures live in src/content/art.js;
src/content/renderer.js maps its 64-frame atlas to native WebGPU sprites.
Renderer-owned runtime helpers live under `src/content/systems/`; the particle
profile/lifecycle module is `particle-effects-system.js` and the particle atlas
builder is `particle-effects-art.js`. `animation-system.js` is reserved for
shared presentation animation primitives.
The temporary authoring canvas produces the PNG atlas; it is not a fallback
game renderer.

The battle options include a client-local `Explosion: Classic` / `Explosion:
PFX` toggle in the `toggle-button-container` row. Classic is the default and keeps the existing bomb and blast
sprites. PFX loads the approved transparent `SmokePoff` and `FirePlume` frame
sequences from `public/assets/pfx/` into a nearest-sampled particle atlas and
dedicated Babylon Lite sprite layer. During the existing 2.5-second fuse, no
PFX smoke is shown. When authoritative blast cells appear, each cell plays one
`FirePlume` animation followed by a `SmokePoff` burst, with the puff starting
on FirePlume frame 4. The particles are cosmetic and never
determine blast timing, damage, or collision; see
particle-assets.md for source provenance and redistribution status.

## Resolution and layout

The browser's primary pointer selects the initial aspect: a fine pointer starts
in 16:9 landscape with the board-aspect gameplay region left of the information
panel; a coarse pointer starts in 9:16 portrait with the gameplay region above
the panel. The top-right
**Aspect: Landscape/Portrait** button changes that composition on either device
class. The selected aspect stays active across online/practice mode switches
and physical device rotation, then resets to the pointer-based default on a
page reload. Touch gestures remain available on touch devices and keyboard
controls remain available on PCs in either aspect. When a phone is held
sideways in portrait aspect, the stacked layout remains and the gameplay region shrinks
to keep the complete panel visible. The viewport keeps four residual gutters
where space is available, and all primary React UI stays inside it when
fullscreen.

The landscape layout gives the board the largest undistorted board-aspect region
that fits beside a usable information panel; portrait gives it the largest
board-aspect region that leaves room for the panel below. The rendered board
fills that region using integer tile pixels, so the layout does not reserve
black letterbox bands above or below the board. The panel receives the remaining
space after the board region is prioritized. Any remaining outer space belongs
to the responsive layout and is distinct from the board's rendered pixels.

Four noninteractive player-label `div`s are overlaid on the gameplay area's
outer corner cells: player 1 is anchored to grid `(0,0)`, player 2 to the
top-right outer cell, player 3 to the bottom-left outer cell, and player 4 to
the bottom-right outer cell. Each label uses the corresponding character's
original atlas frame. The label container is 64.8% of one tile/grid row (90% of
the previous 72% height),
vertically centered within that outer corner cell, while the icon and text
retain their existing text size and the icon is scaled to 80% of its current
size. The two left-side labels have an 8px left margin, and the two right-side
labels have an 8px right margin. Text may ellipsize horizontally but never grows
into another row; each label reserves extra trailing space after its text. The
local human's label has a 1px yellow border.
Practice shows one human and three CPUs; online labels follow the current room's
names and seat ownership.

Practice and online settings cover the full information panel and center their
controls inside it. On a short mobile viewport, the settings controls scroll
within that panel so the close action remains reachable.

Each initial level, practice restart, and online round starts with a
game-world `screen-transition` of type `screen-door`. Two grey panels, each
half the game-world square, slide inward for 0.5 seconds, hold closed for 0.2
seconds, and slide outward for 0.5 seconds. The shared animation system eases
the close with deceleration and reverses that curve for the open: slow at first,
then quickly accelerating before the final movement plateaus. The panels use
the supplied `public/assets/door-half.png` artwork; the right panel mirrors it
horizontally. The renderer keeps the previous arena presentation until the
doors meet, swaps to the new level graphics while they are closed, and then
reveals the new level. The screen-transition layer sits above the canvas and
corner player labels but is clipped to the arena stage, so the adjacent
menu/HUD panel and outer gutters remain visible.

The information panel header places the game title and Mode, Aspect, and GitHub
controls on one row in both modes. Narrow panels show shorter control labels
while retaining their full accessible names.

The live map grid sets the rendering dimensions. Each tile has a 16×16 authored
source and the displayed board uses one integer number of CSS pixels per tile,
selected as `floor(min(slotWidth / columns, slotHeight / rows))`, with a
minimum of one pixel. Thus LOW (15×13), MED (19×15), and HIGH (23×17) boards
produce integer render dimensions of `columns × tilePixels` by
`rows × tilePixels`. The complete board fills the board-aspect gameplay region;
the region is sized from the active grid's columns and rows and the integer tile
size that fits both the available width and height. The renderer never crops,
stretches, or assigns fractional render dimensions. On unusually short
viewports, the tile size is reduced so the board and compact panel remain inside
the viewport.

Foundation originally used a 320×272 logical stage with an internal border.
The updated template reconciliation separates that border into CSS UI space
and renders the arena directly, preventing touch controls from covering tiles.

| Term | Mapping |
| --- | --- |
| Logical resolution | Active columns and rows × 16 authored pixels; precise simulation coordinates ×16 |
| Render resolution | Active columns and rows × the selected positive integer `tilePixels` |
| CSS canvas size | Board-aspect gameplay region, maximized within the selected aspect composition |
| Display size | Render grid at one CSS pixel per render pixel, centered in the slot |
| Canvas backing | CSS canvas size × `devicePixelRatio`, managed by Babylon Lite |

The application never assigns `canvas.width` or `canvas.height`. Babylon Lite
owns the DPR-aware backing allocation. Sprite positions and sizes use the
integer tile mapping and DPR once; React UI stays at independent CSS resolution.

Nearest min/mag filtering, no mipmaps, clamp-to-edge, MSAA 1 and CSS pixelated
retain hard artwork boundaries. Precise predicted/interpolated positions are
not rounded per simulation tick. Fractional DPR can still place render pixels
between physical device pixels, but render dimensions and per-tile display
dimensions remain integer CSS pixels.

## Lifecycle and verification

Same-canvas initialization is serialized, disposal is idempotent, and
StrictMode cancels stale initialization. Unsupported WebGPU and allocation
failures display useful messages while surrounding UI remains mounted.

Foundation browser checks covered keyboard movement, bomb escape, elimination,
restart, pause/resume, fullscreen entry/exit, 125% zoom, unsupported WebGPU and
emulated multitouch cancellation at DPR 1.5. Current layout checks cover PC
landscape at multiple window shapes, mobile portrait and mobile held sideways,
the stacked mobile arrangement, board-aspect gameplay sizing, no-scroll panel fit,
fullscreen, and all four corner roles. The current UI check also covers manual
aspect switching on both pointer classes, mode changes, the three top-right
controls, removed debug outlines, and full-panel fit in both aspects. Graphics checks cover all three active map sizes
and integer render dimensions.

On 2026-10-09, local Chrome checks passed the PC landscape and mobile portrait
layouts in practice and the online lobby. The mobile layout remained stacked
when emulated at 390×844 and 844×390, with board-aspect gameplay sizing, no
layout scrolling, and a complete panel.

Physical touch hardware remains unverified.

## Template provenance and overrides

Initial source: e526677d65c6bacee5cddd17189213cf565d90c9.
Updated source: **6a6b7d1b6da77c36b76344c38d110ff56b6db889**, pulled successfully
on the first attempt after stable checkpoint **88b39a5**. Adapted instructions,
fixed landscape layout, four gutters, UI layer, rendering guidance and
initialization messages. Kept project history, bomberman-clone/ application root,
game assets, native render resolution and latest-stable OpenSpec 1.14.0 skills.
The user's explicit original music requirement overrides the template's advice
against music. Gameplay Polish implements original music and eight effects,
mute checkbox, volume and ?mute=1; see audio.md for provenance and verification.
Template showcase controls and assets are not gameplay.
