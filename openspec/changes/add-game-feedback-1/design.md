# Design

## Context
The shipped game uses React/Vite, Babylon Lite WebGPU, a 16px original atlas, local deterministic simulation and a pinned Colyseus multiplayer client. The existing canvas assumes 15x13 cells, while the server assumes at least two humans. Local prototypes already explore variable maps, CPU intents, corridor locking, rare items and plants; preserve and review them rather than treating their presence as completion. The active change captures all follow-ups after the three archived delivery milestones.

## Goals / Non-Goals
Deliver every requested feature consistently in practice and multiplayer, with responsive local movement and readable remote effects. Preserve original music/audio controls, fullscreen, touch, WebGPU recovery and the README launch path. No new renderer, unrelated server-game edits, paid hosting migration or durable continuity beyond the accepted 300-second host limit.

## Decisions
### Landscape and logical resolution
Propose a fixed 16:9 landscape viewport, arena on the left and React menu/HUD/legend rail on the right. Reserve the existing title, links, settings and version corners. Arena dimensions are 240x208, 304x240 or 368x272 logical pixels for the proposed three map sizes. Keep tiles at 16 logical pixels, choose the largest integer fit in available arena space, and use positive fractional fit only when required. Do not stretch the world. Size renderer capacity for the largest map plus bounded effects; remove hard-coded tile indexing and camera dimensions. In narrow landscape/fullscreen, compact the rail and permit menu scrolling without hiding arena or play controls. Document actual logical/render/backing/display mapping and apply DPR once.

### Shared rules and authority
One deterministic rule implementation drives practice, server authority and client prediction. Carry map dimensions, selected options, plants, sliding bomb position/direction, glove possession and immunity deadlines in authoritative snapshots. Validate host-only CPU/map/plant messages and reject forged stats/positions. Cosmetic Bomb Flash is local and persisted; Plant affects the shared match. Settings change before a new match, not midway through live simulation.

### Four seats and fair CPUs
Separate four battle-seat records from human network connections. Fill each unoccupied seat with a CPU; reserved disconnected human seats remain vulnerable and idle for the existing 15-second window. At expiry or deliberate departure, CPU control resumes. Human arrivals take over an available CPU seat; proposed policy preserves position, life, upgrades and score, with eliminated seats staying eliminated until the next round. Readiness counts only connected humans, requires at least one, and never waits for CPUs. Zero connected humans returns to lobby; retain Colyseus disposal and honest failed-recovery guidance. Validate host reassignment and color uniqueness.

The pure CPU controller emits ordinary movement/bomb intents. Forecast bombs and chains, respect terrain/plants/warned walls, seek reachable upgrades and check escape before planting. LOW/MED/HARD differ in reaction cadence, hazard horizon and aggression; no speed, immunity, hidden-item knowledge or capacity cheats. Use the same controller in practice and on the server, adapting package import paths without diverging behavior.

### Collision, pushing and rare items
Normalize single-character keys on both keydown and keyup; retain blur/cancel cleanup. Opposing solid left/right neighbors lock horizontal movement; opposing above/below neighbors lock vertical movement, retaining small body clearance for open directions. Test offset bodies and intersections so locking cannot strand a legal actor.

A rare original boxing-glove icon grants pushing until death/round reset. Proposed sliding speed is six tiles/second. A pushed bomb keeps moving until wall/block impact and then detonates; suspend its stationary fuse while sliding, but allow chain detonation. Define and test bomb/bomb, plant, boundary and simultaneous push interactions consistently; proposed policy treats bomb or plant contact as blocking impact. Never allow tunneling, double explosions or lingering capacity ownership.

An original lightning icon grants ten seconds of immunity to every lethal source, including blasts, plants and closing walls. Flash the character, accelerate during the final second, and stop immediately on expiration. Proposed wall policy allows an immune actor already overlapped by a closing wall to leave that cell without granting passage through other walls; death applies if still inside on expiry. A new lightning pickup refreshes duration to ten seconds. Reset powers on death/new life. Preserve classic caps and safe item reveal; expose all five meanings in the UI.

### Plant
Plant defaults OFF. When enabled, guarantee exactly one valid initial segment away from clear corner starts, using a placement fallback if procedural generation has no candidate. Propose growth every five seconds into cardinal available floor cells, one frontier step per interval. Do not grow into walls, blocks, bombs or active blasts; plants can consume exposed items. Contact kills unless lightning immunity is active. Each bomb ray removes the first plant segment it reaches and stops there, allowing segment-by-segment clearing. Once all segments are destroyed, do not respawn during that round. Include plants in CPU hazard/target planning.

### Death presentation and fuse flash
Capture the authoritative lethal scene, including responsible blast/plant/wall and final actor position. Hold it for three seconds before displaying a retry/results prompt. A locally eliminated online player sees a frozen presentation while server simulation and other browsers continue; clear held input, keep receiving state, then resume spectating. At final round resolution, hold the final scene for three seconds, show scores for a proposed further three seconds, then the usual countdown. Delay match-result/rematch controls similarly. Practice holds its lethal snapshot before retry; restart clears snapshots/timers.

Bomb Flash defaults ON and is a checkbox with visible ON/OFF text. Render exactly two bright pulses in the last 0.5 seconds using the authoritative detonation deadline; OFF removes these pulses without changing timing. Chain detonation and moving bombs use actual deadlines/state and never promise a fuse that no longer applies. Lightning expiration flashing remains distinct from the bomb-specific preference.

## Risks / Trade-offs
CPU takeover changes previous late-join/spectator expectations and score ownership; document the proposed policy visibly. Larger arenas affect sprite budgets, prediction and sudden-death waves; retain two-minute rounds and one-second warnings on every map. A local death freeze may hide continued battle briefly, so label it clearly and restore the latest state after three seconds. In-memory host resets remain possible before five minutes; preserve truthful room recreation guidance.

## Migration Plan
Review prototypes, complete shared rules and fixtures, then integrate server seats/settings/snapshots and CPU control. Update the original artwork, renderer and React UI. Release a compatible shared server/client artifact before pinning the game to it. Replace obsolete expectations with meaningful new four-seat checks, retain smoothness/regression checks, publish and verify README-launched multiplayer. Sync accepted specs and archive only after implementation and verification; planning does not update durable specs.

## Open Questions
User requests are captured above. Defaults and takeover/scoring, plant cadence, sliding collision policy and immune-wall escape remain proposed design choices for review; no missing credentials or new hosting plan is assumed. Playtest can adjust CPU balance and rarity without changing the requested behavior.

## Implementation evidence (in progress)
- 33 client unit checks pass, including selected map stride, 600 plant-generation cases and exact death-view timing; build passes.
- WebGPU browser UI verification passes 16:9, fullscreen, resize, DPR 1.25, forced mute and unsupported-device recovery.
- Real Colyseus admission/reconnect/capacity/isolation and first-to-three/rematch tests both pass after updating deterministic scenarios to four humans (two original peers still verify synchronized outcomes).
- Complete shared-server regressions remain running; public release, pinned client update and full feedback browser acceptance remain pending. These results do not establish final delivery.

## Final implementation decisions and verification
The implementation uses the documented defaults: 16:9, LOW map, MED CPU, Plant OFF with five-second growth and Bomb Flash ON. Human takeover retains the seat's score/life/position. Sliding uses six tiles/second and explodes on blocking terrain/bomb/plant; lightning refreshes to ten seconds and permits escape from an overlapping closing wall. These are implementation choices within the delegated scope, not additional user requirements.

As of 2026-10-02: 40 client tests and build pass against immutable v0.9.7 with byte-normalized rule parity. All 70 shared-server regressions and typecheck passed, and the release CI repeated them successfully. Canonical v0.9.7 health and direct live admission/recovery rerun pass; the initial deploy verification timeout remains disclosed. Real WebGPU pixel checks cover all five pickup types, plants, both bomb-flash states, two final-half-second pulses and accelerated last-second lightning blinking. Delayed/jittered snapshots preserve pushed impact, interpolate intermediate bomb positions and retain authoritative plant/immunity outcomes. Two browser full-match acceptance and real-time four-human draw/automatic next round pass. Fullscreen/DPR/resize/recovery, real death-delay, preferences and audio checks pass. Publication/version audit and OpenSpec sync/archive remain outstanding.
