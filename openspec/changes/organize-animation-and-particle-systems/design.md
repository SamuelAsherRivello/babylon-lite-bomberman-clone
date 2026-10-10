# Design

## Context

The current renderer owns Babylon setup and draw orchestration in
`src/content/renderer.js`, while PFX definitions and lifecycle helpers are in
`src/content/particle-effects.js` and atlas generation is in
`src/content/particle-art.js`. The RPG reference uses a real-time profile,
normalized progress, frame resolution, and small easing functions; its
particle-specific code does not itself provide eased position or scale.

## Goals / Non-Goals

**Goals:**

- Establish a reusable renderer-side animation contract for time, frame,
  progress, easing, interpolation, delayed start, and completion.
- Use that contract for FirePlume and SmokePoff without moving gameplay timing
  or collision logic out of the authoritative state.
- Give renderer-owned systems a predictable directory and naming convention.
- Preserve pixel-perfect, nearest-sampled Babylon Lite rendering.

**Non-Goals:**

- No changes to bomb rules, blast propagation, occupancy, danger windows, or
  server snapshots.
- No migration of all project modules into one global `Systems` directory.
- No new animation dependency or full Babylon.js replacement.
- No initial migration of the UI arena-door transition; it remains a separate
  UI-owned system until a later change proves a shared transition contract is
  useful there.

## Decisions

### Directory and naming

Use a lowercase directory consistent with the existing source layout:

```text
bomberman-clone/src/content/
├── renderer.js                 # Babylon engine/resource orchestration
├── art.js                      # static/generated arena art
├── audio.js                    # Web Audio resource and playback ownership
├── initialization.js           # WebGPU setup/error handling
└── systems/
    ├── animation-system.js     # time, frames, easing, interpolation
    ├── particle-effects-system.js
    └── particle-effects-art.js # particle atlas construction/loading
```

`AnimationSystem` is preferred over `AnimationStem`; the latter is ambiguous
and would make the module sound like a base class rather than a runtime system.
`ParticleEffectsSystem` is preferred over `ParticleEffects`; the name clearly
signals lifecycle ownership and matches the proposed directory.

### Animation contract

Port the RPG pattern, not its files wholesale. The system will expose pure
helpers for resolving elapsed time, clamped progress, frame selection, easing,
and scalar/vector interpolation. Particle instances will carry their
presentation start time, profile, cell, frame, and optional visual-property
parameters. The renderer will convert cell plus eased offset/scale into the
Babylon sprite update.

Use a default linear interpolation and small named easing functions such as
`easeOutQuad`; profiles can opt into another function without embedding easing
math in the renderer. Keep frame-sheet timing separate from visual-property
timing so FirePlume and SmokePoff can retain their current 17-frame/90ms and
9-frame/80ms playback while their placement properties are eased.

### Particle ownership

`particle-effects-system.js` owns profiles, instance creation, frame/lifecycle
advancement, compound timing, and the optional eased visual state. It remains
cosmetic and consumes authoritative blast snapshots supplied by the renderer.
`particle-effects-art.js` owns only source asset URLs and atlas creation. It
does not advance time or decide when effects exist.

### Other existing systems

Do not move `src/game/rules.js` or `src/game/prediction.js`; they are simulation
and reconciliation systems, not renderer systems. Do not move
`src/input/controls.js`; it owns browser input listeners. Keep
`src/ui/arena-transition.js` under `src/ui/` because React owns its lifecycle
and CSS owns the visible door animation. `src/content/audio.js` is a resource
manager with a different lifecycle and remains beside the renderer rather than
being forced into the visual-effects system.

### Compatibility and migration

Move the modules first while preserving exports and behavior, then update
imports. Add focused unit tests for the animation contract and keep the
existing WebGPU pixel test for PFX visibility and sequencing. If eased scaling
or offsets cause visual regressions, profiles can initially use identity
easing and zero offset while the system remains available for later tuning.

## Risks / Trade-offs

- [Risk] Per-particle scale or offsets could soften the intended pixel-art
  footprint. → Keep nearest sampling, use integer-safe cell-space placement,
  and validate actual browser pixels.
- [Risk] A shared animation helper could accidentally become gameplay timing.
  → Keep it under `src/content/systems/`, pass authoritative timestamps in, and
  test that it never mutates game state.
- [Risk] Renaming modules can leave stale imports or documentation. → Use a
  repository-wide import search, build, focused tests, and browser graphics
  verification before considering the migration complete.
