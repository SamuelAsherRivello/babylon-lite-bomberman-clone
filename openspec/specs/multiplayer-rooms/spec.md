# multiplayer-rooms Specification

## Purpose

Let one to four humans enter private competitive rooms and recover brief connection interruptions while preserving identity.

## Requirements

### Requirement: Private lobby
The game SHALL create and join six-character rooms, limit human seats to four, provide unique player colors, and start a countdown only after at least one human is connected and every connected human is ready.

#### Scenario: Two players ready
- **WHEN** two players join a code and ready up
- **THEN** both see the same countdown and enter the same arena

#### Scenario: Full room
- **WHEN** a fifth player requests admission
- **THEN** admission is rejected with a useful full-room message
#### Scenario: Solo human online battle
- **WHEN** one connected human readies in a room
- **THEN** the countdown starts with that human and three CPUs

### Requirement: Bounded reconnect
An unconsented disconnect SHALL stop movement but keep the character vulnerable and reserve its seat for 15 seconds. Reconnection in that window SHALL preserve identity and scores; expiry SHALL replace its control with a CPU. Zero connected humans SHALL return to lobby after resolving the round.

#### Scenario: Recover before deadline
- **WHEN** a disconnected client reconnects within 15 seconds
- **THEN** its identity, seat and score are restored and prior vulnerability outcomes remain authoritative

### Requirement: Honest connection recovery
The game SHALL expose connection/retry/error states and distinguish an expired room or host reset from successful session recovery.

#### Scenario: Room reset
- **WHEN** the host destroys a room before the player reconnects
- **THEN** the client reports the expired session and provides room recreation rather than claiming preserved progress
