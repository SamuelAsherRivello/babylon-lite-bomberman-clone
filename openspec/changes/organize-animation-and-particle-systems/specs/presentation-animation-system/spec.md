# Spec Delta

## Purpose

Provides a shared presentation-time animation contract for renderer-owned visual
effects, including frame playback, delayed starts, easing, interpolation, and
deterministic completion without changing authoritative game state.

## ADDED Requirements

### Requirement: Visual animations resolve from real-time progress

The presentation animation system SHALL resolve a visual animation from a
start time and duration into bounded progress, completion, and frame state.

#### Scenario: Non-looping animation advances

- **WHEN** a non-looping animation is sampled before its duration elapses
- **THEN** it returns the corresponding frame and incomplete state
- **AND** sampling at or after its duration returns the final frame and complete state

#### Scenario: Delayed animation remains inactive

- **WHEN** an animation has a future start time
- **THEN** sampling before that time returns inactive state without advancing its frame

### Requirement: Visual properties support easing and interpolation

The presentation animation system SHALL allow an effect to map normalized
progress through an easing function and interpolate numeric or vector visual
properties such as position, offset, scale, and opacity.

#### Scenario: Eased scale is resolved

- **WHEN** an effect defines a start scale, end scale, and easing function
- **THEN** the sampled scale follows the eased progress rather than raw linear progress

#### Scenario: Eased position is resolved

- **WHEN** an effect defines a cell-relative position offset over its lifetime
- **THEN** the renderer receives the interpolated offset while the authoritative cell remains unchanged

### Requirement: Animation lifecycle remains cosmetic

The presentation animation system SHALL not mutate gameplay state, blast cells,
collision results, occupancy, or danger timing, and SHALL permit completed
visual instances to be retired independently of authoritative events.

#### Scenario: Particle completion does not change gameplay

- **WHEN** a FirePlume or SmokePoff visual completes
- **THEN** only its renderer-owned instance is retired
- **AND** the authoritative blast and danger state are unchanged

### Requirement: Renderer systems have stable ownership boundaries

Renderer-owned animation and particle behavior SHALL live under
`bomberman-clone/src/content/systems/`, while engine/resource orchestration,
static art generation, gameplay simulation, input, and React UI remain in their
existing layers.

#### Scenario: Particle system is isolated from gameplay

- **WHEN** the particle-effects system is imported by the renderer
- **THEN** it consumes presentation snapshots and produces cosmetic instances
- **AND** it has no dependency on rules, prediction, networking, or React UI

#### Scenario: Unrelated systems retain their layer

- **WHEN** the project is reorganized
- **THEN** gameplay systems remain under `src/game/`, input remains under `src/input/`, and UI transition behavior remains under `src/ui/`
