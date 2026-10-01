# Proposal

## Why

The public multiplayer milestone supports battles but still returns to a lobby after one round. Complete the approved game with tactical upgrades, escalating sudden death, first-to-three matches, rematches and original arcade presentation, then verify the full public README launch path.

## What Changes

- Add symmetric hidden bomb, range and speed upgrades; reveal only after blasts clear, destroy exposed items in later blasts, enforce caps and reset upgrades every round.
- Add the two-minute timer and final-30-second deterministic inward walls, warning every affected tile one second before closure.
- Progress through countdowns and score breaks automatically, award simultaneous-elimination draws correctly, end at three wins and require ready rematch votes before resetting scores.
- Finish original walking animations, distinct silhouettes, collectible icons, fuse/blast/wall feedback, elimination effects, readable scores/status and shareable room links.
- Create original arcade music and eight event sound effects with mute checkbox, volume and documented silent-testing URL argument.
- Preserve immediate local prediction, smooth reconciliation and buffered remote motion while new outcomes remain authoritative.
- Release updated shared rules/server first, pin its verified artifact, publish the game release and verify two public browsers completing a match and rematch from the README.
- Resolve production continuity for matches longer than the current five-minute connection lifetime; do not shorten round timers or victory target to fit hosting.

## Capabilities

### New Capabilities
- `arena-progression`: capped upgrades, fair hidden distribution and telegraphed sudden death.
- `match-loop`: first-to-three rounds, score breaks, draws, spectating and ready rematches.
- `arcade-presentation`: original animation/audio, clear gameplay feedback and silent test controls.

### Modified Capabilities
- `authoritative-arena`: extend gameplay authority to upgrades, sudden death, match scoring and rematches; retain existing prediction and online verification contracts.

Existing demo-entry, pixel presentation and recovery requirements remain mandatory; their final acceptance gate is not weakened.

## Impact

Shared rules, Bomberman simulation/room handlers, focused game/server tests, released client package, React UI, renderer, original audio, browser checks, documentation and release workflows. Server edits remain in the isolated `.tmp/bomberman-server` checkout and preserve unrelated games, including concurrent Ring Rivals changes. No new runtime package is planned; Web Audio can synthesize original music/effects after user activation.

Unresolved external dependency: current Vercel configuration limits connections to 300 seconds and stores rooms in memory. Existing persistent-host access has been requested from the user; none is verified yet. Verify supported hosting configuration using existing authorized access, or an available persistent Node host/durable continuity solution. Final acceptance stays incomplete until long-session continuity is demonstrated. No paid service, unverified credential or durable state is assumed.
