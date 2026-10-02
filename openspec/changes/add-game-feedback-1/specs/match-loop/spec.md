## MODIFIED Requirements

### Requirement: Complete match progression
The last survivor SHALL gain one round win; simultaneous final eliminations or timeout without one survivor SHALL award none. A short score break and countdown SHALL lead automatically to the next round while at least one human remains connected. The first player with three wins SHALL win the match. The HUD SHALL show player status, scores, remaining time and round number; eliminated players SHALL spectate after their three-second death view; late human joins SHALL take available CPU seats without reviving eliminated actors.

#### Scenario: Three wins
- **WHEN** a player wins their third round
- **THEN** all clients show the same match winner and no further round starts until rematch readiness

#### Scenario: Draw
- **WHEN** all final survivors are eliminated on one tick
- **THEN** scores remain unchanged and the next round starts after the score break and countdown

### Requirement: Ready rematch
The match-result screen SHALL offer a rematch readiness action. At least one connected human and readiness from every connected human SHALL reset scores and start a new match with fresh arena and upgrades. Leaving zero connected humans SHALL return to lobby after resolving the current round.

#### Scenario: Replay together
- **WHEN** connected players ready for a rematch after a completed match
- **THEN** scores reset to zero, the next match starts at round one, and no old bombs, blasts, upgrades or held inputs carry over
