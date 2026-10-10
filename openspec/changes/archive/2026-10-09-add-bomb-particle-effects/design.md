# Design

## Context

See `proposal.md` for the motivation. Bomberman currently uses a generated
16px sprite atlas in `src/content/art.js` and renders the board, bombs, blasts,
players, and bounded elimination particles through the Babylon Lite renderer
in `src/content/renderer.js`. Authoritative bomb state comes from the existing
game snapshot and already contains bomb IDs, deadlines, ranges, and blast cells.

The RPG reference uses individual transparent PNG frames, animation profiles,
particle instances, and a compound bomb effect. Bomberman needs the same
presentation concept while retaining its existing WebGPU-only and pixel-perfect
rendering constraints.

## Goals / Non-Goals

**Goals:**

- Add a client-local Classic/PFX presentation preference with Classic as the
  default.
- Play one-shot `FirePlume` followed by one-shot `SmokePoff` on authoritative
  blast cells in PFX mode, with SmokePoff starting on FirePlume frame 4.
- Keep all gameplay timing, collision, chain reactions, and damage in the
  existing rules and snapshot flow.
- Reuse the current Babylon Lite renderer, scaling, lifecycle, and browser
  verification patterns.

**Non-Goals:**

- Changing fuse length, blast duration, blast propagation, or damage.
- Sending presentation choices to the server or synchronizing them between
  players.
- Replacing the existing classic visuals or making PFX mandatory.
- Adding a second renderer or a general-purpose particle engine dependency.

## Decisions

### Use a dedicated Babylon Lite particle atlas and sprite layer

Copy the approved transparent PNG frames into the application's public assets,
compose them into a nearest-sampled particle atlas at initialization, and load
that atlas into a dedicated sprite layer. Particle atlas cells can be larger
than the existing 16px world-art cells, allowing the source effects to retain
their authored silhouettes while the renderer controls their destination size.

This is preferred over a DOM overlay because the game already owns a WebGPU
canvas, grid-to-pixel mapping, fullscreen behavior, and device-pixel-ratio
handling. A DOM overlay would introduce a second coordinate system and require
additional resize and clipping synchronization.

### Drive effects from authoritative blast cells

PFX will not preview the fuse or calculate a client-side blast path. It will
create the smoke and fire sequence only from authoritative blast cells, keeping
the presentation aligned with server timing and avoiding effects on occupied
or non-blast cells.

The renderer uses authoritative `g.blasts` cells directly. This handles board
changes, chain reactions, remote snapshots, and any discrepancy without
allowing presentation to alter gameplay.

### Model smoke and fire as separate animation phases

Each accepted bomb in PFX mode gets a stable effect key per bomb and cell:

```text
pfx:<round>:<bomb-id>:<cell>
```

Fire uses a non-looping `FirePlume` profile at the start of the authoritative
blast. Smoke uses a non-looping `SmokePoff` profile scheduled on FirePlume frame
4, and is retired when its frames finish.

The renderer detects new bomb IDs/cells from snapshots and tracks its own
cosmetic instances. It will not use a wall-clock timer to decide when damage
starts; the authoritative blast snapshot performs the phase transition.

### Keep the preference in existing client settings

The explosion style belongs with existing battle presentation options and uses
the current local preference persistence path. The value is an enum-like
`classic`/`pfx` choice, defaults to `classic`, and is read by both practice and
online render loops. It is never included in gameplay input or multiplayer
room state.

## Risks / Trade-offs

- [Asset provenance is not yet verified] -> Confirm the RPG particle artwork
  may be redistributed before copying it; otherwise create equivalent original
  frames with the same profile contract.
- [Many simultaneous blast cells can consume sprite slots] -> Allocate a
  bounded pool sized for the maximum arena cell count plus existing sprites,
  retire completed effects, and test worst-case chain reactions.
- [A remote blast snapshot can arrive late] -> Use the authoritative cells and
  preserve the server's gameplay timing; the effect remains cosmetic only.
- [A puff may obscure arena readability] -> Use the source artwork at
  a controlled cell-relative size, verify contrast against floors/blocks, and
  retain Classic as the default fallback.
- [Saved preference can be stale or malformed] -> Normalize unknown values to
  Classic and keep the option independent from gameplay persistence.

## Migration Plan

1. Add and validate the asset/profile pipeline while Classic remains the
   default.
2. Add the preference and PFX renderer path behind the opt-in value.
3. Run unit, build, and browser graphics checks for both styles.
4. If PFX initialization fails, report the renderer error and preserve the
   existing Classic path; do not alter gameplay or server state.
