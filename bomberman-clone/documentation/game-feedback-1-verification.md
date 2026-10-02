# Game Feedback 1 delivery audit

Date: 2026-10-02. Game v0.0.5, shared server/client v0.9.7.

## Requested behavior and evidence

| Request | Implementation and verification |
| --- | --- |
| Full landscape with additional UI space | Fixed 16:9, whole arena left and primary React UI rail right; UI/browser checks cover fullscreen, resize, DPR and compact controls. |
| Four fighters; CPU LOW/MED/HARD | Shared fair intent controller and separate human connections/battle seats; server tests and public cpu-browser cover all 1–4 human mixes, solo readiness, takeover and authoritative HARD selection. |
| Caps Lock and Shift input | Both key edges normalize letter case; unit and real-browser keyboard checks cover uppercase press/lowercase release and blur. |
| Pickup meanings in UI | Actual five-icon atlas legend with names, effects, caps and durations; feedback and WebGPU graphics browser checks. |
| No wiggle between opposing blocks | Shared blocked-axis constraint preserves the small collider and open-axis movement; horizontal/vertical unit fixtures and browser corridor check. |
| Three-second death view | Captured lethal presentation holds without changing online authority; exact timer fixtures, browser death/retry timing and full-match results. |
| MAP LOW/MED/HIGH | 15x13, 19x15 and 23x17; shared indexing, mirrored starts, size-aware sudden death, menu/browser checks and public HIGH admission. |
| Rare boxing glove | Life-scoped power, six tiles/second sliding, impact/chain detonation, capacity release; deterministic fixtures and delayed/jittered snapshot motion checks. |
| Ten-second lightning | Exactly 600 ticks, all lethal sources, refresh/reset/expiration and wall escape; deterministic fixtures and actual WebGPU regular/final-second blink pixels. |
| Two final-half-second bomb flashes | Two timed bright pulses verified from actual WebGPU pixels. |
| Bomb Flash ON/OFF | Persisted personal checkbox; reload and pixel checks verify OFF without changing fuse timing. |
| Plant ON/OFF | One seed, five-second cardinal growth, valid-cell exclusions, lethal contact and single-segment cutting; 600 seed/map fixtures, authority/delayed-snapshot tests and public host option. |

`npm test` passes 40 checks; `npm run build` passes against the immutable v0.9.7 client. A parity check compares the shared deterministic rules with practice. The shared server typecheck and all 70 local regressions pass, including existing games. WebGPU graphics, audio, UI, feedback, two-browser full-match and real-time four-human sudden-death draw commands passed locally. These checks use legitimate inputs or deterministic isolated fixtures, not production gameplay overrides.

## Releases and limits

Game implementation fb75dc8 is included in release commit 9f758e2. [Release run 36964512957](https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone/actions/runs/36964512957) and [Pages run 36964555745](https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone/actions/runs/36964555745) succeeded. Shared implementation 7015392 is included in release commit 8e21243; both local checkouts include their generated release commits.

[Shared release/deployment run 36888433521](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/36888433521) published and deployed v0.9.7. Its second attempt passed Bomberman public admission/bombs/isolation/capacity/recovery and 68/70 public regressions, but failed Neon Breaker input sync and Ring Rivals forfeit startup. Rollback failed with Vercel HTTP 402. The overall shared deployment check is therefore not green; unrelated games were not modified or their checks weakened.

The accepted 300-second hosting limit remains. Admission or identity recovery can fail earlier if the in-memory host loses a room. An initial v0.0.5 public offline-recovery check observed that failure; a subsequent public run recovered and completed first-to-three and a fresh rematch. Room recreation guidance is part of the game and README. This is not a durable-host guarantee. Physical mobile hardware and speaker output remain unverified.

## Final public acceptance

With `GAME_URL` set to the README live online URL and `EXPECTED_VERSION=0.0.5`, `node bomberman-clone/test/online-browser.mjs` passed: two independent Chrome browsers completed first-to-three and a fresh rematch, ordered 180–240ms input latency/jitter, immediate local pixels and remote convergence, legal pickups/chains, common winner, offline identity recovery, mobile simultaneous movement/bomb/cancellation, capacity rejection, invalid codes and room isolation, without page errors. Current multiplayer screenshots come from that passing public run. The compact layout assertion checks nonoverlapping arena/touch rectangles in either the right rail or below the arena, rather than requiring the previous below-arena placement.

The public CPU browser check passed solo readiness, three CPUs, all 1–4 human mixes and live seat takeover with HIGH map, HARD intelligence and Plant enabled. Current local feedback checks and screenshot verify v0.0.5. OpenSpec strict validation and sync/archive are the final bookkeeping gates; their authoritative records are the accepted specs and archived change.

## OpenSpec finalization

All 29 readiness tasks passed. Eight capability deltas were merged and compared requirement-by-requirement, retaining unrelated requirements and surviving scenarios. Strict validation passed all nine accepted specifications. The CLI archived the change to `openspec/changes/archive/2026-10-02-add-game-feedback-1`; no active changes remain. The final scoped commit contains this audit, current README/screenshots, browser verification, accepted specifications and archive; remote commit history is the authoritative push record.
