# pixel-perfect-presentation Specification

## Purpose
Present the complete arena with crisp authored pixel artwork, responsive controls and reliable browser initialization and recovery.

## Requirements

### Requirement: Whole arena pixel presentation
The game SHALL show the entire arena through a fixed top-down view, preserve authored hard pixel edges without texture smoothing, center integer logical-to-CSS scaling when it fits, and use positive fractional fit otherwise without stretching. Logical/render/backing/display mappings and selected resolution SHALL be documented.

#### Scenario: Available viewport cannot fit one logical pixel per CSS pixel
- **WHEN** the viewport becomes smaller than the logical stage
- **THEN** the entire arena remains visible with positive fractional scale and the documented strict alignment limitation applies

### Requirement: Input and HUD
The game SHALL support WASD/arrows and Space, simultaneous touch direction and bomb actions, input release on blur/cancellation, readable HUD and controls within the viewport, and the four title/links/settings/version corner roles.

#### Scenario: Touch movement and bomb placement
- **WHEN** a player holds a direction and presses the bomb button on a narrow screen
- **THEN** movement and bomb intent both register and releasing or cancelling touches clears their respective input

#### Scenario: Fullscreen resize
- **WHEN** the player enters fullscreen or resizes the browser
- **THEN** the whole arena and essential HUD remain visible and controls map correctly to the resized display

### Requirement: Recovery and lifecycle
The game SHALL show useful unsupported-WebGPU and initialization-error messages and SHALL not duplicate loops, resources, listeners or held input after remount/restart. Local practice SHALL expose pause/resume.

#### Scenario: Unsupported device
- **WHEN** required rendering support is unavailable
- **THEN** the page shows the requirement and recovery guidance while surrounding UI remains usable

#### Scenario: Resume practice
- **WHEN** the player pauses and resumes practice
- **THEN** simulation resumes once without a fuse time jump or stuck movement
