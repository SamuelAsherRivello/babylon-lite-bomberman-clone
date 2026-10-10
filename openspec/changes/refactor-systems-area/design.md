# Design

## Context

The current client keeps renderer orchestration, generated art, audio, and PFX
helpers directly under `bomberman-clone/src/content/`. The requested animation
runtime is already planned separately; this change establishes the stable
directory and naming boundary it will use without changing gameplay or the
current PFX behavior.

## Goals / Non-Goals

**Goals:**

- Create a clear `src/content/systems/` area for stateful renderer-owned
  runtime behavior.
- Rename the current particle modules to explicit system/art names.
- Keep renderer orchestration and resource ownership easy to locate.
- Make all internal import paths, tests, and documentation consistent.

**Non-Goals:**

- Do not change animation timing, easing, scale, position, or particle output.
- Do not alter authoritative gameplay, prediction, networking, input, or UI.
- Do not move every project module into one global systems directory.
- Do not move the UI arena-door transition into renderer content.

## Decisions

### Content layout

Use this structure:

```text
bomberman-clone/src/content/
├── renderer.js
├── art.js
├── audio.js
├── initialization.js
└── systems/
    ├── animation-system.js
    ├── particle-effects-system.js
    └── particle-effects-art.js
```

`animation-system.js` is the reserved home for the separately planned RPG-
inspired animation runtime. This change creates the architectural slot and
updates ownership documentation; it does not alter the runtime contract.

### Ownership boundaries

- `renderer.js`: Babylon Lite engine, layers, textures, sprite allocation,
  frame drawing, and disposal.
- `systems/animation-system.js`: future presentation-time animation primitives.
- `systems/particle-effects-system.js`: particle profiles and lifecycle.
- `systems/particle-effects-art.js`: particle source URLs and atlas assembly.
- `art.js`: static arena/player artwork generation.
- `audio.js`: Web Audio resource and playback lifecycle.
- `initialization.js`: renderer initialization and WebGPU failure handling.

Keep `src/game/`, `src/input/`, and `src/ui/` unchanged because their systems
belong to simulation, browser input, and React/UI presentation respectively.

### Migration strategy

Move files and update imports as one repository-local migration. Preserve named
exports and behavior so tests do not need semantic rewrites. Use repository-wide
search to remove stale paths, then run formatting, unit tests, build, and the
existing browser graphics checks.

## Risks / Trade-offs

- [Risk] A stale import could fail only in a browser path. → Search all source,
  tests, and documentation, then run both build and browser graphics tests.
- [Risk] A structural move could accidentally alter relative asset URLs. → Keep
  URL resolution centralized in the renamed art module and verify the atlas in
  the production build.
- [Risk] The new folder could become a catch-all. → Require each future module
  to be renderer-owned and stateful; keep layer-specific systems in their
  existing directories.
