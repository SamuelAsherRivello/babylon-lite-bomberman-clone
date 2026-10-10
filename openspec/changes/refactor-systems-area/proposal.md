# Proposal

## Why

The client currently mixes renderer orchestration, particle lifecycle, particle
art, and other presentation responsibilities directly under `src/content/`.
The code needs a clear systems area before the RPG-inspired animation and easing
runtime is brought in, so future visual systems have predictable ownership and
the renderer does not become a monolith.

## What Changes

- Add `bomberman-clone/src/content/systems/` for renderer-owned runtime systems.
- Add `animation-system.js` for real-time progress, frame timing, easing, and
  scalar/vector interpolation.
- Rename and move `particle-effects.js` to
  `systems/particle-effects-system.js`.
- Rename and move `particle-art.js` to
  `systems/particle-effects-art.js`.
- Keep `renderer.js` as the Babylon engine and draw orchestration entry point.
- Keep static art, initialization, and audio beside the renderer because they
  are resource/orchestration modules rather than visual runtime systems.
- Keep gameplay rules/prediction, input controls, and React/UI transitions in
  their existing layer-specific directories.
- Update imports, tests, documentation, and project structure references.
- Preserve all runtime behavior, including Classic/PFX selection, blast timing,
  danger windows, occupied-cell filtering, and existing particle sequencing.

## Capabilities

### New Capabilities

None. This is an implementation-only organization and naming refactor.

### Modified Capabilities

None. No user-visible or gameplay contract changes are intended.

## Impact

- Affected files are renderer modules, renderer tests, and renderer
  documentation under `bomberman-clone/`.
- No server, rules, prediction, network, input, or React behavior changes.
- No dependency changes.
- The migration is a breaking internal import-path change only; all consumers
  are within the repository and will be updated together.
