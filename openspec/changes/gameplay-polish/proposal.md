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
- Respect the current five-minute host limit, disclose expiry and provide actionable room recreation without shortening round timers or the victory target. The user explicitly accepted this limit on 2026-10-01.

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

Current Vercel configuration limits connections to 300 seconds and stores rooms in memory. The user explicitly directed us to respect the five-minute limit, replacing the earlier long-session continuity gate. Keep the existing host and disclose session expiry/process resets; do not request or assume a paid service. Public full-match/rematch verification within the accepted host lifetime and useful room recreation remain required for final acceptance. The user separately authorized publishing the latest WIP before further testing; that playtest publication is distinct from final acceptance.
