# Design

## Context

See proposal.md for motivation. Foundation and Multiplayer Setup are archived. The client uses Lite 1.32.0, native WebGPU sprites and a 240×208 logical arena inside a fixed 320:272 landscape viewport. Shared rules are an exported pure JavaScript subpath; server runs 60Hz and snapshots 20Hz. Local input predicts immediately with spring corrections; remote players use a 100ms buffer. The current simulation has lobby/countdown/playing/results but no full match progression. Existing Node and WebGPU browser tests are available.

## Goals / Non-Goals

Goals: extend the same authoritative simulation, finish the approved full loop, preserve smooth presentation and provide traceable public verification. No accounts, bots, unrelated game changes or replacement renderer. Vercel's in-memory state is not durable recovery.

## Decisions

- Keep one shared deterministic rules file. Enhance its seeded generator with horizontal and vertical mirror orbits as well as 180-degree rotation; a rectangular 15×13 board cannot have true 90-degree symmetry. This gives all four starts equal mirrored topology, rather than only equal diagonal pairs. Hidden upgrade types use the same mirrored orbits. Server snapshots omit unrevealed hidden items; clients render only authoritative exposed items.
- Collect upgrades after elimination resolution. Store destroyed-block items as pending until every dangerous blast on their cell expires; later blasts remove exposed items. Clamp stats at capacity 5, range 8 and speed level 3, with speed = base × (1 + .15 × level). Reset through createGame every round. Reuse pure movement prediction, returning position only, so predicted collection cannot grant upgrades.
- Precompute deterministic concentric inward wall waves from the initial board. Each closure wave contains mirrored cells, warns for 60 ticks, and follows the previous wave at 45-tick intervals beginning at tick 5400. Walls close after that tick's movement; remove covered bombs/items, resolve touched characters together, and keep blast geometry blocked by newly solid walls. Persistent warning/closed-cell state supports presentation even if one-tick events are not in a 20Hz snapshot.
- Extend the Bomberman room with rematch messages and server phases. Start a match from the ready lobby, automatically advance score-break → countdown → round, and stop at matchResults when a player reaches three. Rematch votes reuse per-person readiness; all connected players must ready. Reset score/round/input buffers only when a fresh match starts. Keep 15-second identity recovery and late-join spectating; return to lobby with fewer than two connected participants after round resolution.
  Accumulate elapsed monotonic time into fixed 60Hz ticks, with bounded catch-up for stalls. Directly stepping once per timer callback allowed clock drift in a loaded local runtime, slowing fuses and draining the interpolation buffer. Real-client tests now measure fuse duration as well as outcomes.
- Expand the original code-authored atlas with four distinct silhouettes, direction/walk frames, collectible icons and warning/effect frames. Detect persistent snapshot transitions for bounded client-only effects. Drive walking animation from presentation time and preserve exact smoothed positions; never snap movement to a simulation pixel grid. Fuse effects derive from authoritative deadlines. Preserve native render resolution and template layout.
- Use Web Audio synthesis: an original short arcade melody and eight effects (placement, explosion, block destruction, pickup, elimination, countdown, wall warning, victory). Unlock after a pointer/key gesture, cap concurrent nodes, stop schedules on teardown, and apply master mute/volume to everything. Share a small audio controller between practice and online presentation. URL mute=1 overrides preferences. No copied recordings or additional audio package.
- Add visible score/status strips and shareable code/link actions; keep room recovery actionable. Public launch uses mode=online. Hide touch action buttons while lobby dialogs are active; test full play in narrow portrait browser windows without changing the landscape game orientation.
- Keep game rules tests deterministic and fast; exercise complete server phases with simulated ticks, then require real-time two-browser matches/rematches without test-only gameplay overrides. Test caps, reveal/destruction, wall warnings/crushing, timeout/draw, reset, reconnect and existing games. Verify production version and assets separately from workflow success.

## Risks / Trade-offs

- Current maxDuration 300 can interrupt long matches → deployment acceptance is blocked until supported configuration or an authorized persistent host/authoritative durable continuity is verified. Existing host access was requested; no answer or new service authorization is assumed. Gameplay work is independent of this external deployment gate. A read-only hosting capability probe may use existing deployment credentials without logging secrets; do not change billing or unrelated consumers.
- More snapshot fields → omit hidden items and redundant schedule data from public state; cap effects and retain the four-player arena.
- Prediction advances a cloned rule state → expose only predicted position and reconcile all new outcomes with server snapshots.
- Auto-round flow changes milestone browser expectations → update them to score breaks/next countdown while retaining meaningful movement, identity and outcome assertions.
- Shared backend changes concurrently → fetch before scoped commit/release, preserve other games and run full regressions; ordinary push only.

## Migration Plan

Implement and verify shared rules/server first, release with the existing backend workflow, confirm canonical health and live checks, then pin the immutable client artifact. Finish client presentation and verify locally. Resolve the hosting gate, release/deploy the Pages client and prove complete public matches/rematches and a session beyond five minutes. Roll back only through the existing workflow if an actual deployment regression occurs. Sync/archive after every acceptance task passes, then commit/push and fast-forward generated version commits.
