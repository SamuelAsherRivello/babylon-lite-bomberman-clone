# authoritative-arena Specification

## Purpose

Keep online arena outcomes consistent and validated while players experience responsive local movement and smooth remote motion.

## Requirements

### Requirement: Gameplay authority
The server SHALL own movement/collision, bomb capacity/placement/timing, blast propagation, chains, destruction, power-up spawning/collection/caps, elimination, sudden death, round outcomes, match scores and rematch progression. Invalid or stale inputs SHALL not alter authoritative state.

#### Scenario: Forged position
- **WHEN** a client sends coordinates, damage claims or stale sequenced movement
- **THEN** the server ignores those claims and preserves valid simulation state

#### Scenario: Forged upgrade or victory
- **WHEN** a client claims a collected item, increased capacity or match win
- **THEN** only valid server-simulated collection and round outcomes can change stats or scores

### Requirement: Responsive presentation
Local movement SHALL respond before network acknowledgement, reconcile against server state and smooth small corrections. Remote players SHALL interpolate. Bomb feedback SHALL remain cosmetic until server confirmation; fuse/blast deadlines SHALL follow server simulation time.

#### Scenario: Latency and bomb rejection
- **WHEN** a player moves and requests an invalid bomb under simulated latency and jitter
- **THEN** movement responds immediately and the rejected pending bomb disappears without causing damage

### Requirement: Online verification
The deployed client and released backend SHALL be verified with two independent browsers sharing a room. Existing supported games SHALL pass regressions after the server extension.

#### Scenario: Public synchronized battle
- **WHEN** two browsers enter from the public client and detonate bombs
- **THEN** both observe consistent destruction, elimination and round outcomes using the verified released server
