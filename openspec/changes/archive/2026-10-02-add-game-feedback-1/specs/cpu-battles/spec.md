## Purpose
Provide fair four-combatant battles with CPU opponents filling available human seats and selectable intelligence in both play modes.

## ADDED Requirements
### Requirement: Four combatants
Every battle SHALL contain four combatant seats, with one to four humans and the remaining seats controlled by CPUs. CPU seats SHALL not block human admission or vote on readiness.
#### Scenario: Human count changes
- **WHEN** a battle has one, two, three or four human participants
- **THEN** it has respectively three, two, one or zero CPUs and four total combatant seats
#### Scenario: Human takes an available CPU seat
- **WHEN** a human joins an available CPU-controlled seat
- **THEN** control transfers without adding a fifth actor or reviving an eliminated actor

### Requirement: Selectable fair intelligence
The main menu SHALL offer CPU: LOW, MED and HARD. CPUs SHALL obey the same movement, collision, bomb, pickup and damage rules as humans and SHALL use observable arena information.
#### Scenario: Difficulty choice
- **WHEN** the authorized player selects a CPU difficulty before the match
- **THEN** all CPU seats use that choice and difficulty changes intelligence rather than granting physical cheats
