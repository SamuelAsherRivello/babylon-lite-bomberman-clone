# Tasks

## 1. Animation system foundation

- [ ] 1.1 Create `bomberman-clone/src/content/systems/animation-system.js` with real-time profile validation, clamped progress, completion state, frame resolution, and delayed-start handling; verify with focused unit tests for pre-start, mid-animation, final-frame, and completion cases.
- [ ] 1.2 Add easing and interpolation helpers for scalar and vector visual properties, including a named ease-out function; verify unit tests distinguish eased progress from linear progress without mutating input values.
- [ ] 1.3 Document the animation-system contract and renderer-only ownership in `bomberman-clone/documentation/rendering.md` and `bomberman-clone/documentation/project-structure.md`; verify every referenced path exists.

## 2. Particle system migration

- [ ] 2.1 Move and rename `src/content/particle-effects.js` to `src/content/systems/particle-effects-system.js` and preserve FirePlume/SmokePoff frame timing, delayed start, compound sequencing, and retirement; verify `particle-effects.test.mjs` passes with updated imports.
- [ ] 2.2 Move and rename `src/content/particle-art.js` to `src/content/systems/particle-effects-art.js`, keeping atlas dimensions, nearest sampling, and asset URLs unchanged; verify the production build loads the particle atlas path.
- [ ] 2.3 Update PFX renderer integration to use the animation system for frame progress and optional eased offset, scale, and opacity while keeping each effect anchored to its authoritative blast cell; verify focused particle tests and WebGPU pixel assertions pass.
- [ ] 2.4 Add focused tests for eased particle properties, including zero offset/identity behavior and completion retirement; verify gameplay state and danger timing are not changed by particle advancement.

## 3. Ownership cleanup and integration

- [ ] 3.1 Update all imports, documentation references, and test fixtures to the new `content/systems/` paths, then verify no stale `particle-effects.js` or `particle-art.js` imports remain with repository-wide search.
- [ ] 3.2 Keep `src/game/`, `src/input/`, and `src/ui/` systems in their existing layers and record the ownership boundary in the project-structure documentation; verify the renderer has no dependencies from content systems into gameplay, input, networking, or React UI.
- [ ] 3.3 Run `npm test`, `npm run format:check`, and `npm run build`; verify the existing Classic/PFX toggle and all unrelated gameplay tests remain green.
- [ ] 3.4 Run the WebGPU graphics browser test and verify FirePlume starts first, SmokePoff starts on the configured overlap frame, eased visual properties remain cell-local, and all PFX instances retire.
