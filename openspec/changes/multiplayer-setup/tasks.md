# Tasks

## 1. Authoritative server

- [x] 1.1 Export shared deterministic arena rules from the server client package and verify parity fixtures and tarball packaging.
- [x] 1.2 Implement Bomberman simulation, lobby readiness/countdown, unique colors, late-join spectating and round outcomes; verify deterministic lifecycle and simultaneous-elimination tests.
- [x] 1.3 Register isolated private code admission with capacity four and bounded payload/rate/input validation; verify code errors, isolation, stale/invalid input and fifth-seat rejection.
- [x] 1.4 Add 15-second Colyseus reconnection support and additive shared-client recovery for Bomberman; verify identity/score preservation, input expiry, vulnerability, consent leave and timeout removal.
- [x] 1.5 Update registry, client API and server consumer documentation and live tests; verify typecheck, full existing-game regressions and package contents.

## 2. Server release

- [ ] 2.1 Commit/push scoped server changes, invoke existing release/deploy workflow and verify release asset, canonical health version and live Bomberman two-client actions.
- [ ] 2.2 Record hosting-duration evidence and recovery limitations, verify requested game rules are unchanged, and resolve any actual deployment failure without claiming preserved state after host reset.

## 3. Game client

- [ ] 3.1 Pin verified release tarball and production endpoint, integrate shared lifecycle with create/join/ready/color/retry UI; verify two-browser lobby, errors and capacity.
- [ ] 3.2 Add sequenced input, local prediction/reconciliation, remote interpolation, pending bomb visuals and server-time fuse presentation; verify responsive motion and consistent outcomes under latency/jitter.
- [ ] 3.3 Add spectator/round-result and reconnect UX preserving local practice; verify blur/settings neutral input, expiry recovery and clean teardown.
- [ ] 3.4 Document multiplayer endpoint/release/controls and add meaningful synchronization checks; verify npm test/build and README claims.

## 4. Public milestone acceptance

- [ ] 4.1 Deploy client through existing Pages workflow and verify two public browsers joining a code, readying, fighting, completing a round and recovering a brief disconnect.
- [ ] 4.2 Validate all milestone specs and record latency/jitter, mobile and runtime evidence; verify no failed regression checks or unreported hosting limits.

After all implementation and acceptance tasks pass: sync/archive, scoped commit/push, then explore and propose Gameplay Polish. Its complete first-to-three match/rematch, progression, assets/audio and public release acceptance remain mandatory.


