## MODIFIED Requirements

### Requirement: Gameplay authority
The server SHALL own movement/collision, bomb capacity/placement/timing, blast propagation, chains, destruction, power-up spawning/collection/caps, elimination, sudden death, round outcomes, match scores and rematch progression. Invalid or stale inputs SHALL not alter authoritative state.

#### Scenario: Forged position
- **WHEN** a client sends coordinates, damage claims or stale sequenced movement
- **THEN** the server ignores those claims and preserves valid simulation state

#### Scenario: Forged upgrade or victory
- **WHEN** a client claims a collected item, increased capacity or match win
- **THEN** only valid server-simulated collection and round outcomes can change stats or scores
