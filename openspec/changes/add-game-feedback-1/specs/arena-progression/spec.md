## MODIFIED Requirements

### Requirement: Fair capped upgrades
Every round SHALL begin with one active bomb slot, range two and base movement speed. Some symmetric destructible blocks SHALL hide bomb-slot, range, speed or rare boxing-glove and lightning power-ups. Collection SHALL cap bomb capacity at five, range at eight and speed at three upgrades, each adding 15% of base movement speed. Block and upgrade distribution SHALL give mirrored corner starts equal opportunities. All upgrades SHALL reset between rounds.

#### Scenario: Collect beyond a cap
- **WHEN** a player collects an upgrade after reaching its limit
- **THEN** its stat remains capped and no extra active bomb, range or speed is granted

#### Scenario: New round
- **WHEN** a score break ends and the next round begins
- **THEN** the arena and all player upgrades reset with equally clear starting escape routes

### Requirement: Telegraphed sudden death
Rounds SHALL last at most two minutes. During the final 30 seconds, walls SHALL close in a deterministic inward pattern with each affected tile warned one second before closure. Closing walls SHALL eliminate touching players without active lightning immunity and remain solid. If no single survivor remains at timeout, the round SHALL draw.

#### Scenario: Escape a warned tile
- **WHEN** a tile is marked for closure
- **THEN** players have one second to leave before it becomes a solid lethal wall

#### Scenario: Simultaneous wall elimination
- **WHEN** closure eliminates all remaining players in one simulation tick
- **THEN** the round is a draw and awards no points

## ADDED Requirements
### Requirement: Map selection
The main menu SHALL offer MAP: LOW, MED and HIGH, producing progressively larger arenas with four fair corner starts. The whole selected arena SHALL remain visible, and online participants SHALL share the selected size.
#### Scenario: Larger map
- **WHEN** the authorized player selects HIGH before a new match
- **THEN** all participants receive a larger arena than MED or LOW with clear starting escape routes

### Requirement: Boxing glove
A rare boxing-glove pickup SHALL let its collector push bombs for the remainder of that life. Pushed bombs SHALL move until a blocking collision and then explode; chain reactions SHALL still detonate them. The power SHALL reset on death or a new round.
#### Scenario: Push into a block
- **WHEN** a glove-equipped player pushes a bomb down an open corridor toward a block
- **THEN** the bomb travels to that block and explodes once on impact
#### Scenario: New life
- **WHEN** that player dies and receives a fresh life
- **THEN** bomb pushing requires another glove pickup

### Requirement: Lightning immunity
A lightning pickup SHALL grant complete invulnerability for ten seconds. The character SHALL flash during the power and blink faster in its final second. Immunity SHALL expire and reset between lives.
#### Scenario: All lethal sources
- **WHEN** an immune player touches a blast, plant or closing wall during the ten seconds
- **THEN** they remain alive and become vulnerable when the duration ends
#### Scenario: Expiration hint
- **WHEN** the power has one second remaining
- **THEN** blinking accelerates until immunity expires

### Requirement: Optional growing plant
The main menu SHALL offer a Plant ON/OFF checkbox. ON SHALL create one plant in a random available position, grow into adjacent available cells periodically, kill non-immune players touching it and allow bombs to remove individual segments. OFF SHALL create no plant.
#### Scenario: Growth and cutting
- **WHEN** growth is due and an explosion reaches a plant segment
- **THEN** growth occupies only adjacent available cells and the explosion removes the reached segment without clearing the entire connected plant
#### Scenario: Disabled plant
- **WHEN** a new match starts with Plant OFF
- **THEN** no plant appears or grows
