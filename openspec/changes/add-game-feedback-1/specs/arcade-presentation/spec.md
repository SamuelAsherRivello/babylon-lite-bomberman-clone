## MODIFIED Requirements

### Requirement: Original readable feedback
The game SHALL use original scenery, distinct colored character silhouettes and walking animations, bomb fuse feedback, readable cross blasts, five distinguishable upgrade icons with visible names and meanings, sudden-death warnings and elimination effects. Important HUD and simultaneous touch controls SHALL remain inside the fixed landscape viewport without covering the arena or requiring scrolling to play. The four corner roles and outside gutters SHALL remain intact in windowed and fullscreen modes.

#### Scenario: Touch battle
- **WHEN** a narrow touch browser displays an active round
- **THEN** the full arena, scores, time, status and movement/bomb buttons are visible and simultaneous actions work

## ADDED Requirements
### Requirement: Death cause visibility
The game SHALL hold the visible lethal scene for three seconds before presenting a death, retry or round/match-result prompt. A local online death view SHALL not pause other players or authoritative simulation.
#### Scenario: Local online elimination
- **WHEN** the local player dies while other combatants remain alive
- **THEN** that browser holds the cause-of-death scene for three seconds before spectating while other browsers continue play
#### Scenario: Final elimination
- **WHEN** a round ends through elimination
- **THEN** the final scene remains visible for three seconds before the result prompt and a subsequent round cannot skip that view

### Requirement: Optional bomb warning flash
Bombs SHALL flash twice during the final 0.5 seconds before timed explosion when the player's Bomb Flash checkbox is ON. OFF SHALL suppress that warning flash without changing gameplay timing or other players' preferences.
#### Scenario: Preference disabled
- **WHEN** the player selects Bomb Flash OFF
- **THEN** their bombs show no warning flashes and explode at the same authoritative time
#### Scenario: Preference enabled
- **WHEN** a timed bomb enters its final half-second with Bomb Flash ON
- **THEN** it displays exactly two warning flashes before exploding
