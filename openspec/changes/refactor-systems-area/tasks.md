# Tasks

## 1. Establish the renderer systems boundary

- [x] 1.1 Create `bomberman-clone/src/content/systems/` and add the reserved `animation-system.js` module boundary without changing runtime behavior; verify the module is importable from the content layer.
- [x] 1.2 Move `src/content/particle-effects.js` to `src/content/systems/particle-effects-system.js` while preserving all exports and behavior; verify `particle-effects.test.mjs` passes.
- [x] 1.3 Move `src/content/particle-art.js` to `src/content/systems/particle-effects-art.js` while preserving atlas generation and asset URLs; verify the production build completes and the PFX atlas loads.

## 2. Update ownership references

- [x] 2.1 Update renderer, tests, and any other imports to the new paths; verify repository-wide search finds no stale `./particle-effects.js` or `./particle-art.js` imports.
- [x] 2.2 Update `bomberman-clone/documentation/project-structure.md`, `rendering.md`, and `particle-assets.md` with the new ownership map; verify every documented path exists.
- [x] 2.3 Record that `src/game/`, `src/input/`, and `src/ui/` remain layer-specific and are not moved into `content/systems/`; verify no unrelated files are changed.

## 3. Structural verification

- [ ] 3.1 Run `npm run format:check`, `npm test`, and `npm run build`; verify all checks pass without gameplay or PFX behavior changes.
- [x] 3.2 Run the WebGPU graphics browser test; verify Classic/PFX selection, FirePlume/SmokePoff sequencing, occupied-cell filtering, and effect retirement remain unchanged.
