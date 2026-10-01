## Purpose
Give players fair tactical upgrades and a clearly telegraphed shrinking arena while preserving deterministic competitive outcomes.

## ADDED Requirements

### Requirement: Fair capped upgrades
Every round SHALL begin with one active bomb slot, range two and base movement speed. Some symmetric destructible blocks SHALL hide bomb-slot, range or speed power-ups. Collection SHALL cap bomb capacity at five, range at eight and speed at three upgrades, each adding 15% of base movement speed. Block and upgrade distribution SHALL give mirrored corner starts equal opportunities. All upgrades SHALL reset between rounds.

#### Scenario: Collect beyond a cap
- **WHEN** a player collects an upgrade after reaching its limit
- **THEN** its stat remains capped and no extra active bomb, range or speed is granted

#### Scenario: New round
- **WHEN** a score break ends and the next round begins
- **THEN** the arena and all player upgrades reset with equally clear starting escape routes

### Requirement: Safe reveal and destruction
Hidden power-ups SHALL appear only after the destroying blast has cleared their tile. Later blasts SHALL destroy exposed power-ups. Eliminated players SHALL not collect items.

#### Scenario: Reveal beneath a destroyed block
- **WHEN** a block containing an upgrade is destroyed
- **THEN** the upgrade stays unavailable during the dangerous blast, appears after it clears, and can subsequently be collected or destroyed by another explosion

### Requirement: Telegraphed sudden death
Rounds SHALL last at most two minutes. During the final 30 seconds, walls SHALL close in a deterministic inward pattern with each affected tile warned one second before closure. Closing walls SHALL eliminate touching players and remain solid. If no single survivor remains at timeout, the round SHALL draw.

#### Scenario: Escape a warned tile
- **WHEN** a tile is marked for closure
- **THEN** players have one second to leave before it becomes a solid lethal wall

#### Scenario: Simultaneous wall elimination
- **WHEN** closure eliminates all remaining players in one simulation tick
- **THEN** the round is a draw and awards no points
