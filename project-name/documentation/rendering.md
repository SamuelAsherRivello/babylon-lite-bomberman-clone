# 2DPixelPerfect presentation

The game uses Babylon Lite 1.32.0 native SpriteRenderer on WebGPU. All textures
are original code-authored 16×16 pixel frames in `src/content/renderer.js`;
there are no imported copyrighted game assets. The small canvas in that file
authors a PNG atlas only; Babylon Lite renders every arena frame.

The current logical stage is **320×272**. The 15×13 arena occupies 240×208,
offset 40 pixels horizontally and 32 vertically. A 320×240 stage leaves only
16 pixels above/below; 272 gives 32 for HUD/frame clearance while retaining
one logical-to-CSS pixel per pixel on 390px-wide mobile screens. Direct
240×208 arena framing leaves no internal border. Desktop 1280×900 and mobile
390×844 browser screenshots show the selected whole-arena presentation.

Integer CSS scale is floor(min(availableWidth/320, availableHeight/272)).
When that is zero the positive fractional fit is used. The stage is centered
without stretching. Babylon Lite renders directly to its native DPR-aware
backing buffer; there is no reduced intermediate render target. Logical
positions/sizes map through CSS scale and DPR once into backing coordinates.
The engine owns canvas.width/height, so application code never sets them.
React HUD and controls stay at CSS resolution independently of the game.

Nearest min/mag filters, no mipmaps, clamp-to-edge, MSAA 1 and CSS pixelated
preserve hard texture boundaries. Simulation positions retain full precision.
Fractional DPR and fractional fallback do not promise universal physical pixel
alignment. Resize observes current canvas CSS dimensions on each draw.

Initialization for the same canvas is serialized and disposal is idempotent,
including React StrictMode initialization/remount. A failed adapter request
shows an error and keeps surrounding UI mounted.

Verification so far: Chrome WebGPU desktop keyboard bomb elimination,
restart and pause/resume; mobile emulated touch bomb elimination/restart,
concurrent touch/cancellation, DPR 1.5; no page exceptions in either run.
Screenshots are `foundation-desktop.png` and `foundation-mobile.png`.
Additional browser checks passed for movement with bomb escape, fullscreen entry/exit, CSS zoom at 125%, and unsupported-WebGPU recovery. Physical touch hardware remains unverified.


Template source inspected: e526677d65c6bacee5cddd17189213cf565d90c9. Foundation production preview passed the same WebGPU play-through under /babylon-lite-bomberman-clone/.
