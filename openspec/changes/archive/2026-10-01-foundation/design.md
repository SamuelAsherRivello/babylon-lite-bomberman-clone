# Design

## Context

See proposal.md for scope and delivery-brief.md for the complete three-milestone contract. Observed baseline: React/Vite ESM, `project-name/src/App.jsx` corner UI, no renderer or networking dependencies, source-string template tests, root npm scripts, existing Pages and patch release workflows. Vite base and UI repository URL still point to the template. OpenSpec 1.14.0 doctor is healthy; specs inventory is empty. No server checkout, API compatibility, hosting or release behavior has been verified.

## Goals / Non-Goals

**Goals:** isolate gameplay from rendering and browser input, preserve future server authority, deliver playable local practice, implement resolution policy with explicit mappings, and establish truthful README/OpenSpec entry points.

**Non-Goals:** networking, server deployment, complete match progression or final polish in Foundation. Local practice is an intermediate gate, not a replacement for multiplayer.

## Decisions

1. Keep the npm root and `project-name/` application root per AGENTS.md, overriding the older checklist's directory rename instruction. Use React for UI, Babylon Lite for WebGPU 2D content. Add only the actual verified/pinned Lite package; inspect its declarations and current template code before selecting APIs. Existing React-only canvas substitutes and full Babylon.js are rejected because the user selected Lite.
2. Proposed module boundaries: `src/game/` pure ESM rules/state and deterministic fixed-step updates, `src/content/` renderer/assets/lifecycle, `src/input/` keyboard/touch intents, `src/ui/` React HUD/settings. Renderer consumes snapshots/events; inputs describe desired actions, never directly set gameplay outcomes. This avoids rewriting browser-bound rules for Colyseus. Local practice runs one human with stationary destructible practice targets, exposes elimination and restart; no AI dependency is needed.
3. Use a seeded symmetric 15×13 arena and stable event ordering. Accumulate elimination for each simulation tick before deciding results. Bomb owner passage permission ends once they leave its tile. Snap bomb placement to the occupied tile, reject blocked/occupied tiles and exhausted capacity; fixed-step deadlines drive 2.5-second fuse and 0.5-second blast. Chain processing visits each bomb once. Define/update blast blockers deterministically so sequential iteration cannot create contradictory paths.
4. Evaluate 16px tiles and a 320×240 logical stage as a candidate, not a claimed verified final resolution. It fits the 240×208 arena with 80 horizontal and 32 vertical pixels for framing; React controls may require extra viewport space. Compare against a stage derived directly from arena dimensions, then choose based on narrow-screen/control tests. Keep render mapping explicit: logical authored units → centered integer CSS stage scale → DPR-aware backing coordinates exactly once. If a logical render target is used, composite nearest-sampled without smoothing. Do not inherit the template showcase's fixed native-size sprite behavior for all game sprites; authored tiles must scale consistently with the stage.
5. Nearest sampling, no mipmaps/MSAA, CSS pixelated; engine owns backing sizing. Full-precision movement stays in simulation; visual alignment is evaluated separately to preserve smooth movement. Fractional fit is the documented small-screen fallback. Primary UI stays inside viewport and corners retain roles. Local settings may pause practice; later online settings stop inputs while server simulation continues.
6. Replace template-specific identity assertions with actual behavior/layout checks and rule tests, retaining useful corner/version invariants. Test gameplay independently using the root test script and inspect real browser output; build success alone is insufficient.
7. README keeps a single Live Demo link: during Foundation label any verified preview as local-practice scope, never multiplayer-complete. Final milestone replaces it with Play Multiplayer Demo only after two public clients complete a match/rematch. Document local commands and OpenSpec navigation; preserve original prompt separately from interpreted requirements.

## Risks / Trade-offs

- [Current local template predates 2DPixelPerfect] → inspect current upstream source, selectively adapt rendering/lifecycle and record revisions; preserve local work.
- [Fractional DPR/small screens weaken physical pixel alignment] → document logical-to-CSS guarantee and fallback; test zoom/DPR, fullscreen and touch reachability.
- [Server/client rules diverge] → keep pure rule module and deterministic fixtures; decide shared distribution during server exploration, require parity checks.
- [Server hosting/access unknown] → resolve before milestone-two proposal and treat absent live secure endpoint as a delivery blocker, not a client success.
- [WebGPU or browser tooling unavailable] → retain clear recovery UI and mark browser acceptance unverified; do not close milestone prematurely.

## Migration Plan

Implement Foundation in scoped commits, update Vite subpath and workflow checks, verify local practice and any published preview. Retain version.txt as workflow source of truth. Roll back a faulty deployed client to the last verified revision via existing workflow without resetting unrelated work. Sync/archive Foundation only after acceptance passes; then inspect actual server and propose Multiplayer Setup.

## Open Questions

- Which exact logical dimensions best preserve mobile control clearance? Resolve through the bounded comparison above during Foundation verification.
- Which Lite version and native sprite APIs are compatible with current template and runtime? Verify package/source declarations before implementation; do not assume the template's documented version is current.
