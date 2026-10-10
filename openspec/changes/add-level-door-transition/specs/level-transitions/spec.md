# Spec Delta

## Purpose

Provide an arcade-style visual handoff between Bomberman levels and rounds so
new arena layouts appear behind a clear, timed reveal while the surrounding
interface remains stable and usable.

## ADDED Requirements

### Requirement: Timed screen-door sequence

At each level or round start, the game world SHALL show the `screen-door` type
with two grey doors that slide from outside the world to meet at its center in
0.5 seconds, remain closed for 0.2 seconds, and slide fully offscreen in 0.5
seconds.

#### Scenario: New level reveal
- **WHEN** a new level or round starts
- **THEN** the left and right doors close symmetrically, hold closed, and open with the specified total timing of 1.2 seconds

### Requirement: Eased screen-door motion

The `screen-door` type SHALL use the shared animation system to ease its
position. Closing SHALL decelerate into the center, and opening SHALL be the
reverse motion: slow at first, quickly accelerating, then flattening into a
longer final movement.

#### Scenario: Closing decelerates
- **WHEN** the close phase progresses from zero to one
- **THEN** its eased position progress is greater than linear progress before the midpoint and approaches the center near completion

#### Scenario: Opening reverses the close ease
- **WHEN** the open phase begins at the center
- **THEN** the doors initially move slowly away from the center, accelerate quickly, and finish with a plateau-like eased movement

### Requirement: Closed-door graphics cut

The previous level SHALL remain visible while the doors close, and the new or
reset level graphics SHALL become visible only after the doors meet in the
center and before the doors open.

#### Scenario: Reset behind closed doors
- **WHEN** the doors finish closing at the 0.5-second mark
- **THEN** the arena switches from the previous level presentation to the new level presentation while the doors fully obscure the change

### Requirement: Arena-only foreground coverage

The doors SHALL cover the complete game-world square, including its canvas and
player text labels, while leaving the menu, HUD panel, gutters, and other
outside-arena UI uncovered.

#### Scenario: Transition layering
- **WHEN** the doors are partially or fully closed
- **THEN** they render above all content inside the game-world square and do not render over the adjacent menu/HUD panel

### Requirement: Repeatable responsive lifecycle

The transition SHALL run at the initial level and at every subsequent practice
restart or online round start, once per level event, across the existing
landscape and portrait compositions. Gameplay simulation, AI, and player input
SHALL remain paused until the transition reports completion.

#### Scenario: Online round change
- **WHEN** an online client receives a new round
- **THEN** that client runs one game-world `screen-transition` of type `screen-door` for the new round, gates local simulation/input until completion, and does not change the authoritative round state

#### Scenario: Practice restart
- **WHEN** practice is restarted or a fresh practice level is created
- **THEN** the old arena remains covered during the closed-door cut, the new practice arena is reset at the midpoint callback, and gameplay starts only after the transition completion callback

### Requirement: Game transition handshake

The transition SHALL notify the game when the doors meet, wait for the game to
finish resetting or redrawing the level and explicitly continue, and notify the
game when the doors finish opening.

#### Scenario: Midpoint redraw acknowledgement
- **WHEN** the doors reach the center after 0.5 seconds
- **THEN** the transition pauses at the closed state, the game redraws or resets the level, and the doors remain closed until the game continues them

#### Scenario: Completion acknowledgement
- **WHEN** the doors finish opening after the game has continued the transition
- **THEN** the transition reports completion and the game may start animation, AI, and input processing
