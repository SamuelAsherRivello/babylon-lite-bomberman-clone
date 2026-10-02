## MODIFIED Requirements

### Requirement: Arena and movement
The game SHALL present a LOW, MED or HIGH arena of progressively larger dimensions with solid outer walls, fixed pillars, symmetric destructible blocks, clear corner escape routes, continuous collision-constrained movement and gentle corridor alignment.

#### Scenario: Move into an obstacle
- **WHEN** a player moves toward a solid wall or destructible block
- **THEN** their character stops at the obstacle without tunneling and can move along an open corridor
#### Scenario: Opposing blocks constrain motion
- **WHEN** a player has blocking tiles on both left and right, or both above and below
- **THEN** movement along that blocked axis stays fixed while open-axis movement retains forgiving collision

### Requirement: Blast propagation and elimination
The game SHALL create cross-shaped blasts dangerous for 0.5 seconds, stop rays at walls and destructible blocks, destroy hit blocks, trigger other bombs immediately, and eliminate any player including the owner touching a dangerous blast unless their lightning immunity is active. Outcomes SHALL be deterministic for the same initial state and input sequence.

#### Scenario: Chain blocked by geometry
- **WHEN** a blast reaches another bomb and a destructible block further along a ray
- **THEN** the reached bomb detonates once, the block is destroyed, and that ray does not extend beyond the blocking tile

#### Scenario: Owner caught in blast
- **WHEN** the non-immune owner touches their bomb's active blast
- **THEN** they are eliminated and practice presents a restart action
