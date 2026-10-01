## Purpose
Let friends complete and replay first-to-three multiplayer matches with clear scoring, synchronized rounds and recoverable sessions.

## Requirements

### Requirement: Complete match progression
The last survivor SHALL gain one round win; simultaneous final eliminations or timeout without one survivor SHALL award none. A short score break and countdown SHALL lead automatically to the next round while at least two players remain connected. The first player with three wins SHALL win the match. The HUD SHALL show player status, scores, remaining time and round number; eliminated players and late joins SHALL spectate until eligible for a new round.

#### Scenario: Three wins
- **WHEN** a player wins their third round
- **THEN** all clients show the same match winner and no further round starts until rematch readiness

#### Scenario: Draw
- **WHEN** all final survivors are eliminated on one tick
- **THEN** scores remain unchanged and the next round starts after the score break and countdown

### Requirement: Ready rematch
The match-result screen SHALL offer a rematch readiness action. At least two connected players and readiness from every connected participant SHALL reset scores and start a new match with fresh arena and upgrades. Leaving fewer than two connected players SHALL return to lobby after resolving the current round.

#### Scenario: Replay together
- **WHEN** connected players ready for a rematch after a completed match
- **THEN** scores reset to zero, the next match starts at round one, and no old bombs, blasts, upgrades or held inputs carry over

### Requirement: Public full-loop delivery
The README Play Multiplayer Demo link SHALL open the live online lobby without installation or credentials. Two independent public browsers SHALL complete a first-to-three match and start a rematch with consistent outcomes within the accepted five-minute host limit. The server SHALL retain its 300-second limit without shortening the requested round timer or victory target. The game and README SHALL disclose session expiry and offer actionable room recreation. Host resets and failed recovery SHALL be reported honestly; durable room continuity beyond five minutes is not required after the user's explicit acceptance.

#### Scenario: Public match and rematch
- **WHEN** two browsers launch from the README, join one code and play through three wins
- **THEN** both agree on the match winner and can ready for a fresh rematch

#### Scenario: Host-limited session
- **WHEN** a live session crosses five minutes
- **THEN** the game reports the interruption or expired room and allows creating a fresh room without promising preserved identities or scores
