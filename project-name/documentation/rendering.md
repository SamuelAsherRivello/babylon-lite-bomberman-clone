# 2DPixelPerfect presentation

Babylon Lite 1.32.0 native SpriteRenderer renders the arena with WebGPU only.
Original code-authored 16×16 pixel textures live in src/content/art.js;
src/content/renderer.js maps its 64-frame atlas to native WebGPU sprites.
The temporary authoring canvas produces the PNG atlas; it is not a fallback
game renderer.

## Resolution and layout

The chosen orientation is **landscape**, with a fixed **16:9 viewport ratio**.
The same landscape rectangle is centered in desktop and portrait browser
windows. Four residual gutters occupy the outside space. All primary React
UI, including the four template corners, lives inside ui_layer and remains
available in fullscreen. There is no orientation selector or saved override.

The selected map renders at **240×208**, **304×240** or **368×272**, derived from LOW 15×13, MED 19×15 or HIGH 23×17 tiles at 16px.
The canvas has its own CSS region between the HUD and controls. Integer scale
is floor(min(canvasWidth/logicalWidth, canvasHeight/logicalHeight)); when that is zero, use the
positive fractional fit. Center the whole arena without stretching or clipping.
Small portrait phone windows necessarily show a smaller arena; a larger or
landscape browser window improves readability without changing game orientation.

Foundation originally used a 320×272 logical stage with an internal border.
The updated template reconciliation separates that border into CSS UI space
and renders the arena directly, preventing touch controls from covering tiles.

Internal render resolution is **Native**: Babylon Lite renders directly into
its DPR-aware backing canvas, without a reduced intermediate target. Authored
16px textures, nearest sampling and integer presentation provide the pixel-art
look. Reducing native resolution merely to evoke an era would discard detail
and worsen moving sprite edges, so the template's showcase Quarter/Half/Double
picker is not included in this game.

| Term | Mapping |
| --- | --- |
| Logical resolution | Selected map width×16 and height×16; precise simulation coordinates ×16 |
| CSS canvas size | Space reserved for the arena within the fixed viewport |
| Display size | Logical size × integer fit, or positive fractional fallback |
| Internal render resolution | Native backing resolution |
| Canvas backing | CSS canvas size × devicePixelRatio, managed by Lite |

The application never assigns canvas.width or canvas.height. DPR is applied
once to sprite backing coordinates; the engine owns backing allocation.
React UI stays at independent CSS resolution.

Nearest min/mag filtering, no mipmaps, clamp-to-edge, MSAA 1 and CSS pixelated
retain hard artwork boundaries. Precise predicted/interpolated positions are
not rounded per simulation tick. Fractional DPR and fractional fit suspend
strict physical pixel-alignment guarantees.

## Lifecycle and verification

Same-canvas initialization is serialized, disposal is idempotent, and
StrictMode cancels stale initialization. Unsupported WebGPU and allocation
failures display useful messages while surrounding UI remains mounted.

Foundation browser checks covered keyboard movement, bomb escape, elimination,
restart, pause/resume, fullscreen entry/exit, 125% zoom, unsupported WebGPU and
emulated multitouch cancellation at DPR 1.5. Those historical screenshots use
the earlier framing; current multiplayer screenshots show the reconciled layout.
Current browser checks assert fixed ratio, four gutters, four UI corners, a
positive visible canvas and touch controls outside the canvas.

Physical touch hardware remains unverified.

## Template provenance and overrides

Initial source: e526677d65c6bacee5cddd17189213cf565d90c9.
Updated source: **6a6b7d1b6da77c36b76344c38d110ff56b6db889**, pulled successfully
on the first attempt after stable checkpoint **88b39a5**. Adapted instructions,
fixed landscape layout, four gutters, UI layer, rendering guidance and
initialization messages. Kept project history, project-name/ application root,
game assets, native render resolution and latest-stable OpenSpec 1.14.0 skills.
The user's explicit original music requirement overrides the template's advice
against music. Gameplay Polish implements original music and eight effects,
mute checkbox, volume and ?mute=1; see audio.md for provenance and verification.
Template showcase controls and assets are not gameplay.
