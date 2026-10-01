# Proposal

## Why

Foundation is playable and committed but has no online opponents. Add authoritative private Colyseus rooms and responsive client synchronization so two to four humans can play together through the deployed browser game.

## What Changes

- Register an isolated `bomberman` game on the existing shared backend, preserving all existing consumers.
- Add room creation/joining via six-character codes, unique color selection, readiness and countdown, elimination/spectating and basic round completion.
- Reuse the shared client and deterministic arena rules for server simulation and client prediction; acknowledge bounded sequenced inputs and interpolate remote players.
- Implement a 15-second reconnect window preserving player identity and scores, neutralize disconnected inputs and retain vulnerability until expiry.
- Publish and verify a shared server/client release before wiring the game to that exact release artifact and secure endpoint.
- Update both repositories' registry, documentation, tests and deployment checks; verify two browser clients on the public Pages build.

Acceptance: two public browsers create/join the same private room, ready, move/place bombs with consistent authoritative outcomes and reconnect within 15 seconds. Existing-game regression checks pass. Final first-to-three match/rematch acceptance remains mandatory in Gameplay Polish.

## Capabilities

### New Capabilities
- `multiplayer-rooms`: private lobby admission, color selection, readiness, lifecycle and bounded reconnects.
- `authoritative-arena`: validated inputs, shared simulation outcomes, prediction/reconciliation and interpolation.

### Modified Capabilities
None; local practice and existing presentation contracts remain supported. Final demo-entry completion gate remains unchanged.

## Impact

Game client/UI/network tests and the shared server's game registry, room implementation, shared browser client, release package and live checks change. Source checkout: `.tmp/bomberman-server` within the game workspace, separate Git repository. Existing shared client 0.7.0 supports private gungeon codes but reconnects with fresh identities; Bomberman recovery therefore requires an additive contract, not a claim that existing recovery already works.

Hosting constraint discovered: `vercel.json` sets maxDuration 300 seconds and README documents in-memory resets. A full first-to-three Bomberman match can exceed that duration. Investigate supported deployment duration/session continuity before finalizing design; do not reduce round timers or victory target to disguise this constraint. Admin/push access to both repositories is verified; backend hosting credentials and deployment behavior still need live checks.
