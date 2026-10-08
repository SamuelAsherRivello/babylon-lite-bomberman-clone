# 2DPixelPerfect presentation

Babylon Lite 1.32.0 native SpriteRenderer renders the arena with WebGPU only.
Original code-authored 16×16 pixel textures live in src/content/art.js;
src/content/renderer.js maps its 64-frame atlas to native WebGPU sprites.
The temporary authoring canvas produces the PNG atlas; it is not a fallback
game renderer.

## Resolution and layout

The primary pointer selects the composition: fine-pointer PC browsers always
use landscape with the square arena on the left and the information panel on
the right; coarse-pointer mobile browsers use portrait with the arena above
the panel. The mobile composition stays stacked when the phone is held
sideways, using the available viewport height to fit both regions. There is no
aspect-ratio selector or saved override. The viewport keeps four residual
gutters where space is available, and all primary React UI stays inside it
when fullscreen.

The live map grid sets the rendering dimensions. Each tile has a 16×16 authored
source and the displayed board uses one integer number of CSS pixels per tile,
selected as `floor(min(slotWidth / columns, slotHeight / rows))`, with a
minimum of one pixel. Thus LOW (15×13), MED (19×15), and HIGH (23×17) boards
produce integer render dimensions of `columns × tilePixels` by
`rows × tilePixels`. The complete board is centered in the square arena slot;
unused space is left when the grid's aspect ratio or integer tile size does not
fill it. The renderer never crops, stretches, or assigns fractional render
dimensions.

Foundation originally used a 320×272 logical stage with an internal border.
The updated template reconciliation separates that border into CSS UI space
and renders the arena directly, preventing touch controls from covering tiles.

| Term | Mapping |
| --- | --- |
| Logical resolution | Active columns and rows × 16 authored pixels; precise simulation coordinates ×16 |
| Render resolution | Active columns and rows × the selected positive integer `tilePixels` |
| CSS canvas size | Square arena slot, maximized within the active platform composition |
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
the stacked mobile arrangement, square arena, no-scroll panel fit, fullscreen,
and all four corner roles. Graphics checks cover all three active map sizes
and integer render dimensions.

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
