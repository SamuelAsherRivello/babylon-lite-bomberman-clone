# Proposal

## Why

The renderer currently owns sprite animation timing, particle lifecycle, and
presentation-specific updates in a small set of content files. That makes the
new bomb PFX difficult to extend with the RPG project's reusable time-based
motion and easing patterns, and it leaves animation responsibilities mixed with
Babylon resource management. A shared presentation animation system will give
particles and future visual effects one place to resolve frame progress,
easing, position, scale, and retirement without changing gameplay rules.

## What Changes

- Add a presentation animation system based on the RPG's real-time motion
  profiles, normalized progress, and easing/interpolation pattern.
- Reorganize renderer-facing modules under `bomberman-clone/src/content/systems/`
  with a clear split between animation primitives and particle-effect behavior.
- Rename the existing particle modules to reflect their system ownership:
  `particle-effects.js` becomes `systems/particle-effects-system.js`, and
  `particle-art.js` becomes `systems/particle-effects-art.js`.
- Add `systems/animation-system.js` for reusable frame timing, delayed starts,
  normalized progress, easing functions, and scalar/vector interpolation.
- Move other renderer-owned systems into the same directory when they have a
  lifecycle or stateful presentation responsibility; keep the Babylon engine
  adapter and static art/configuration modules separate.
- Apply the animation system to the PFX path so FirePlume and SmokePoff can
  use eased visual properties while remaining anchored to their authoritative
  blast cells.
- Preserve the existing Classic/PFX toggle, authoritative blast timing,
  occupied-cell filtering, gameplay danger windows, and particle assets.

## Capabilities

### New Capabilities

- `presentation-animation-system`: Provides deterministic real-time animation
  progress, easing, interpolation, delayed starts, and lifecycle completion for
  renderer-owned visual effects.

### Modified Capabilities

- None. This change reorganizes implementation and adds presentation behavior;
  the existing gameplay and explosion-mode contracts remain unchanged.

## Impact

- Affected client modules: `bomberman-clone/src/content/renderer.js`, the
  current particle modules, and renderer-focused tests/documentation.
- New renderer-only modules under
  `bomberman-clone/src/content/systems/`.
- No server, rules, prediction, network, or gameplay API changes.
- No new dependency; use the existing Vite/ESM and Babylon Lite runtime.
- **Recommended scope:** migrate only PFX animation first. Move the arena-door
  transition separately after the shared contract is proven, to keep this
  change focused and reduce visual regressions.
