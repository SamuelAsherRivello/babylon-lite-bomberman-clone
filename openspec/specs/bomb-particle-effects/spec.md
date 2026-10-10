# bomb-particle-effects Specification

## Purpose
Provide an optional animated presentation for bomb fuses and explosions while
preserving the existing authoritative blast timing, propagation, and damage.

## Requirements

### Requirement: Explosion presentation preference

The game SHALL provide `Explosion: Classic` and `Explosion: PFX` presentation
choices, with Classic selected by default. The choice SHALL be local to the
current player's client and SHALL NOT change gameplay state or other clients.

#### Scenario: Default classic presentation

- **WHEN** a player has no saved explosion presentation preference
- **THEN** the game uses the existing classic bomb and blast visuals

#### Scenario: Select PFX presentation

- **WHEN** a player selects `Explosion: PFX`
- **THEN** that client uses the animated smoke and fire presentation for later bomb events without changing fuse or blast timing

#### Scenario: Online preference isolation

- **WHEN** two online clients choose different explosion presentations
- **THEN** each client renders its own selected presentation while authoritative bomb and blast state remains identical

### Requirement: PFX explosion sequence

When PFX presentation is selected, an accepted active bomb SHALL keep its
classic bomb presentation during the fuse. When its authoritative blast begins,
each authoritative blast cell SHALL play one `FirePlume` followed by one
`SmokePoff` puff, with SmokePoff beginning on FirePlume frame 4. Both effects SHALL remain
cosmetic and SHALL NOT change the authoritative dangerous interval.

#### Scenario: No fuse smoke

- **WHEN** a PFX bomb is placed and its fuse is active
- **THEN** no PFX smoke is shown before the authoritative blast begins

#### Scenario: Authoritative cell sequence

- **WHEN** an authoritative blast begins on a cell
- **THEN** that cell plays fire and then puff on FirePlume frame 4, with no effects on non-blast cells

#### Scenario: Effects do not cause damage

- **WHEN** a player touches a PFX effect
- **THEN** the player is affected only by the authoritative blast rules, not by the visual effect

### Requirement: PFX explosion transition

When an authoritative blast begins in PFX presentation, the client SHALL play
one-shot SmokePoff followed by one-shot FirePlume on each authoritative blast
cell. Neither animation SHALL extend, shorten, or otherwise control the
authoritative dangerous interval.

#### Scenario: Fuse becomes an explosion

- **WHEN** the bomb's authoritative blast appears after the existing fuse
- **THEN** FirePlume plays once and SmokePoff follows once on each affected cell

#### Scenario: Chain reaction transition

- **WHEN** multiple bombs enter the same authoritative blast tick
- **THEN** each affected blast cell plays its own fire-then-puff sequence without restarting unrelated completed effects

#### Scenario: Classic mode bypass

- **WHEN** Explosion: Classic is selected
- **THEN** the client does not create PFX smoke or FirePlume instances and retains the existing classic visuals

### Requirement: Effect lifecycle and presentation resilience

PFX effects SHALL remain aligned to the arena grid across supported viewport,
fullscreen, device-pixel-ratio, practice, and online presentation changes.
Completed effects SHALL be retired, round changes SHALL clear stale instances,
and renderer disposal SHALL release particle resources and animation work.

#### Scenario: Round reset

- **WHEN** a practice or online round changes while PFX effects are active
- **THEN** effects from the previous round are removed before the new round's effects render

#### Scenario: Resize during effect

- **WHEN** the viewport or device-pixel ratio changes while smoke or fire is visible
- **THEN** the effect remains on its corresponding grid cell at the new presentation scale

#### Scenario: Renderer teardown

- **WHEN** the arena renderer is disposed while an effect animation is active
- **THEN** particle sprites, timers, and animation callbacks are retired without continuing work
