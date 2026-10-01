# Tasks

## 1. Shared gameplay and server

- [x] 1.1 Implement mirrored block/hidden-item generation, safe reveal, collection/destruction and capped upgrades in shared rules; verify all four starts, reveal timing, exposed-item blasts, eliminated-player rejection, exact caps and reset fixtures.
- [x] 1.2 Implement deterministic inward sudden-death waves and one-second warnings; verify warning/closure tick boundaries, escape, solid-wall collision, simultaneous crushing and two-minute draw behavior.
- [x] 1.3 Extend server round/match/rematch phases and validated rematch messages; verify first-to-three scoring, no points for same-tick draws, automatic score-break/countdown, fresh upgrade/input reset, late spectating and fewer-than-two lobby return.
- [ ] 1.4 Update server registry/API documentation and meaningful integration checks, run typecheck/full existing-game tests and tarball packaging, then release/deploy and verify canonical version and live actions before pinning the game to that exact artifact.

## 2. Complete client experience

- [x] 2.1 Add original walking/direction frames, distinct silhouettes, pickup/fuse/blast/wall/elimination feedback and bounded local effects; verify actual WebGPU pixels, clear icons and smooth motion with the new rules.
- [x] 2.2 Add original arcade music and eight event effects, mute checkbox, volume and mute=1 override with activation/teardown handling; verify silent URL, live mute/volume and resource cleanup in the browser.
- [x] 2.3 Finish scores, status, timer, upgrade HUD, spectating, score breaks, rematch readiness and shareable room links; verify complete desktop and narrow-mobile flow, simultaneous touch, blur/settings neutralization, fullscreen/resize/zoom/DPR and unsupported-WebGPU recovery.
- [ ] 2.4 Run meaningful two-browser local complete-match/rematch checks including ordered latency/jitter, authoritative pickup/chain/draw scenarios and reconnect; verify npm test/build and capture representative current screenshots with no runtime or asset failures.

## 3. Host-limited production delivery

- [x] 3.1 Verify current hosting capabilities with existing authorized access; respect the user-accepted 300-second limit, disclose expiry and retain unchanged round timer/victory target without credential leakage or billing changes.
- [ ] 3.2 Release and deploy the game with the checked-in workflows, then launch from the README in two independent public browsers; verify a full first-to-three match and rematch, public assets, endpoint connectivity, controls, scores, recovery and displayed release version.
- [x] 3.3 Verify expired-room/interruption guidance and creating a fresh public room under the accepted five-minute host limit; disclose that host resets do not preserve identities or scores.

## 4. Final evidence

- [ ] 4.1 Finish README Play Multiplayer Demo launch link, original prompt/follow-ups, setup/gameplay/rendering/audio provenance, releases, current screenshots, limits and template delivery scorecard; verify links, actual commands and GitHub About metadata against the completed game.
- [ ] 4.2 Run strict OpenSpec validation and requirement-by-requirement delivery audit, verify applicable checks and synchronize both local checkouts with remote release commits; only then sync/archive, scoped commit and push, and report all three milestones complete.
