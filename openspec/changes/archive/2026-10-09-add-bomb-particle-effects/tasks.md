# Tasks

## 1. Asset and preference foundation

- [x] 1.1 Confirm and document redistribution provenance for the RPG `SmokePoff` and `FirePlume` PNG sequences, or replace them with approved equivalent artwork; verify the selected asset files and attribution record are present before implementation.
- [x] 1.2 Add the approved particle frame assets and animation profile metadata under the Bomberman content/public asset structure; verify frame counts, dimensions, transparent pixels, and nearest-neighbor atlas preparation with a focused asset/profile test.
- [x] 1.3 Add the client-local `classic`/`pfx` explosion preference with Classic as the normalized default, persistence, and the existing battle-options toggle row; verify malformed/missing saved values normalize to Classic and the setting does not enter gameplay input or room state.

## 2. PFX animation and renderer system

- [x] 2.1 Add the renderer-owned particle animation profiles and instance lifecycle, making `FirePlume` play once followed by `SmokePoff` on FirePlume frame 4 at authoritative blast cells; verify deterministic frame advancement, delayed activation, completion, and cleanup with unit tests.
- [x] 2.2 Drive the PFX sequence from authoritative blast cells without client-side fuse previews or gameplay calculations; verify non-blast cells remain unchanged.
- [x] 2.3 Build and load a nearest-sampled particle atlas and dedicated Babylon Lite sprite layer without adding a renderer dependency; verify renderer initialization succeeds with Classic mode and particle resources are disposed on teardown.
- [x] 2.4 Track PFX instances by round, blast ID, and cell; play one-shot FirePlume followed by delayed one-shot SmokePoff on FirePlume frame 4, and bound the sprite pool; verify simultaneous bombs, chain reactions, stale snapshots, and round resets with focused renderer tests.
- [x] 2.5 Preserve Classic rendering as a bypass path and keep PFX cosmetic-only; verify both modes render the same authoritative blast cells, fuse timing, dangerous interval, player outcomes, and online snapshots.

## 3. Browser verification and documentation

- [x] 3.1 Extend the WebGPU graphics browser test to verify Classic remains the default, PFX has no fuse smoke, each authoritative blast cell plays FirePlume followed by SmokePoff on FirePlume frame 4, and completed effects expire without changing gameplay pixels or state assertions.
- [x] 3.2 Verify PFX alignment after fullscreen, resize, device-pixel-ratio changes, practice restart, and online round transitions using the existing browser/UI checks; confirm no duplicate animation loops or stale particle sprites remain.
- [x] 3.3 Update rendering, project-structure, and relevant gameplay presentation documentation with the Classic/PFX setting, asset provenance, phase timing, renderer ownership, and verification commands; verify every documented path and command exists.
- [x] 3.4 Run `npm test`, `npm run build`, and the focused browser graphics command with both explosion styles; verify the requested files are the only implementation changes added and preserve the pre-existing working-tree modification in `bomberman-clone/src/game/rules.js`. The full suite's one compatibility failure is recorded as pre-existing and comes from that preserved rules modification.
