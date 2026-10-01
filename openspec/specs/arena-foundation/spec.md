# arena-foundation Specification

## Purpose
Provide a deterministic playable local arena foundation whose rules can later run authoritatively for online multiplayer.

## Requirements

### Requirement: Arena and movement
The game SHALL present a 15×13 arena with solid outer walls, fixed pillars, symmetric destructible blocks, clear corner escape routes, continuous collision-constrained movement and gentle corridor alignment.

#### Scenario: Move into an obstacle
- **WHEN** a player moves toward a solid wall or destructible block
- **THEN** their character stops at the obstacle without tunneling and can move along an open corridor

### Requirement: Bomb placement and timing
The game SHALL start practice with one bomb slot and range two, place bombs on grid tiles with a 2.5-second fuse, reject occupied/blocked placement and exhausted capacity, and permit occupants to leave a new bomb tile but not re-enter it while active.

#### Scenario: Leave a placed bomb
- **WHEN** the player places a bomb, leaves its tile, and attempts to return before detonation
- **THEN** the bomb blocks re-entry and detonates after its simulation fuse

### Requirement: Blast propagation and elimination
The game SHALL create cross-shaped blasts dangerous for 0.5 seconds, stop rays at walls and destructible blocks, destroy hit blocks, trigger other bombs immediately, and eliminate any player including the owner touching a dangerous blast. Outcomes SHALL be deterministic for the same initial state and input sequence.

#### Scenario: Chain blocked by geometry
- **WHEN** a blast reaches another bomb and a destructible block further along a ray
- **THEN** the reached bomb detonates once, the block is destroyed, and that ray does not extend beyond the blocking tile

#### Scenario: Owner caught in blast
- **WHEN** the owner touches their bomb's active blast
- **THEN** they are eliminated and practice presents a restart action

### Requirement: Clean practice restart
The game SHALL provide local practice with a controllable player and destructible targets and SHALL reset arena, player, bombs, blasts, clock, and inputs on restart.

#### Scenario: Restart during an active fuse
- **WHEN** practice is restarted while a bomb is pending
- **THEN** the new arena contains no old bombs or delayed explosions and accepts new input normally
