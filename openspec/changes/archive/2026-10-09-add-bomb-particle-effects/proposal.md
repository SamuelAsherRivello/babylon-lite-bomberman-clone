# Proposal

## Why

Bombs currently communicate their fuse with a small static sprite and replace
the blast cells with a static cross-blast sprite. The existing RPG project has
an animated smoke/fire effect system that can make the fuse readable as a
growing visual warning while preserving the current authoritative timing and
blast rules.

## What Changes

- Add a client-side bomb particle-effects system using the RPG's animated
  `SmokePoff` and `FirePlume` artwork, subject to asset provenance approval.
- Add a presentation setting with `Explosion: Classic` as the default and
  `Explosion: PFX` as the opt-in animated style. The setting is client-local
  and must not affect authoritative gameplay or other players' preferences.
- When a bomb is placed, show looping smoke particles on the cardinal cells
  that the current blast-ray rules allow the bomb to reach. The bomb tile stays
  occupied by the bomb sprite; smoke occupies the surrounding ray cells.
- In PFX mode, keep the smoke preview active for the existing bomb fuse duration (currently
  2.5 seconds), without changing fuse timing or making smoke dangerous.
- When the authoritative blast begins, remove/replace the smoke preview on
  those cells with one-shot `FirePlume` effects. Fire remains cosmetic; the
  authoritative blast state continues to determine damage and danger.
- Preserve wall, destructible-block, plant, bomb, chain-reaction, and range
  behavior by deriving preview cells from the same rule-limited paths rather
  than inventing a second propagation model.
- Support multiple simultaneous and chained bombs, round resets, online
  snapshots, practice mode, responsive scaling, and renderer disposal.
- Add focused unit and browser visual checks for the smoke preview, fire
  transition, bounded effect lifetime, and unchanged gameplay state.

## Capabilities

### New Capabilities

- `bomb-particle-effects`: Cosmetic smoke previews during bomb fuses and
  one-shot fire effects during authoritative explosions.

### Modified Capabilities

- None.

## Impact

- Affected client renderer and content modules under
  `bomberman-clone/src/content/`, plus new static particle assets under
  `bomberman-clone/public/assets/` if provenance is approved.
- The Babylon Lite WebGPU renderer will gain an animated particle sprite layer
  or equivalent renderer-owned effect layer; no new rendering engine or
  dependency is required.
- `src/game/rules.js`, the shared multiplayer protocol, authoritative timing,
  collision, damage, and blast propagation remain unchanged.
- Existing graphics-browser coverage will be extended to verify the new
  presentation without weakening current gameplay tests.
