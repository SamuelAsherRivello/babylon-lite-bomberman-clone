# Tasks

## 1. Foundation setup

- [x] 1.1 Verify current template revision and Lite package declarations, selectively adapt 2DPixelPerfect integration and pin compatible dependency; verify npm ci and a WebGPU initialization smoke check.
- [x] 1.2 Generate repository-local OpenSpec skills with the current OpenSpec CLI using the supported generator without hand-editing; verify names/generatedBy match the CLI, doctor, and document any required workspace reopen.
- [x] 1.3 Update project identity, UI repository URL and Vite base to /babylon-lite-bomberman-clone/ while preserving project-name/; verify build paths and project corner/version tests.

## 2. Deterministic arena rules

- [x] 2.1 Implement seeded symmetric 15×13 arena and collision-constrained continuous movement with corridor assistance; verify symmetry, spawn escape and wall/block collision tests.
- [x] 2.2 Implement bomb capacity, placement, owner exit permission and 2.5-second fuse; verify placement rejection, non-reentry and exact simulation deadlines.
- [x] 2.3 Implement cross rays, blocking/destruction, chain processing and 0.5-second dangerous blasts; verify chain-once, blocker and owner-elimination fixtures and deterministic repeated input sequences.
- [x] 2.4 Implement local practice targets, elimination, pause/resume and clean restart; verify old events/inputs cannot survive restart and paused fuse resumes without jumping.
- [x] 2.5 Document state, timing and event contracts for later authoritative reuse; verify documentation against rule fixtures and include tests in npm test.

## 3. Rendering and controls

- [x] 3.1 Integrate Lite sprite rendering with original authored arena/player/bomb/block/blast assets; verify visible gameplay and record actual asset provenance.
- [x] 3.2 Compare 16px tiles with candidate 320×240 stage against arena-derived dimensions, select and document final logical/internal/backing/CSS mapping; verify whole-arena/control clearance at desktop and narrow mobile sizes.
- [x] 3.3 Implement nearest/no-mipmap/MSAA-1 policy, centered integer letterboxing, fractional fallback and DPR once; verify resize, fullscreen, zoom and fractional DPR screenshots without stretching or zero-size stage.
- [x] 3.4 Add keyboard and concurrent touch intent handling with blur/cancellation release; verify movement plus bomb action, no UI shortcut interception and no stuck inputs.
- [x] 3.5 Add HUD, instructions, settings and restart preserving corner roles; verify fullscreen essential UI remains visible and document controls.
- [x] 3.6 Add unsupported-WebGPU/error recovery and safe initialization/cleanup; verify unsupported/error states and repeated remount/restart without duplicate listeners or loops.

## 4. README and delivery wiring

- [x] 4.1 Replace template-only source assertions with relevant gameplay/layout checks, preserve version/corner invariants and configure workflows to execute them; verify npm test and npm run build.
- [x] 4.2 Document verified setup/run commands, browser requirements, current practice scope, all three milestones, and README OpenSpec navigation; verify all documented commands and local links.
- [x] 4.3 Preserve actual full prompt and follow-ups in collapsible Original AI Prompt, document provenance/resolution and capture actual practice screenshot; verify README content is truthful and image resolves.
- [x] 4.4 Wire Pages/release for correct repository subpath and version source; verify production assets and any authorized public preview, labeling it practice until online acceptance passes.

## 5. Integration acceptance and milestone transition

- [x] 5.1 Play a complete local practice loop, elimination/restart and pause/resume in a real WebGPU browser with keyboard and emulated touch; capture desktop/mobile evidence, runtime errors and any physical-device limitations.
- [x] 5.2 Validate all Foundation spec scenarios and template delivery items applicable to this milestone; verify focused checks and build pass and keep unavailable browser acceptance explicitly unverified.
- [ ] 5.3 After authorized implementation passes acceptance, sync specs, archive Foundation, commit/push scoped files normally and check revision/status alignment; verify no unrelated work or PR creation.
- [ ] 5.4 After Foundation completion and continuation authorization, explore actual shared-server code, access, secure hosting endpoint and release workflow, then propose Multiplayer Setup using delivery-brief.md; verify the next proposal retains final README two-client match/rematch acceptance and defers Gameplay Polish proposal until milestone two completes.




