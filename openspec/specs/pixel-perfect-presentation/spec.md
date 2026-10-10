# pixel-perfect-presentation Specification

## Purpose
Present the complete arena with crisp authored pixel artwork, responsive controls and reliable browser initialization and recovery.

## Requirements

### Requirement: Whole arena pixel presentation
The game SHALL use one 16:9 landscape viewport with a separate UI area and show the entire current arena through a fixed top-down view. Desktop and mobile SHALL place a square arena slot left of the information panel. A portrait-held touch device SHALL show a rotate-to-landscape notice instead of a portrait game layout. The renderer SHALL derive positive integer render dimensions from the current grid rows and columns, preserve authored hard pixel edges without texture smoothing, and fit the complete arena using integer sizing without stretching, cropping, or fractional scaling. When the native render resolution cannot fit, the renderer SHALL use a lower integer render resolution or leave unused space so the complete arena remains pixel-aligned. Logical, render, backing, and display mappings and selected resolution SHALL be documented.

#### Scenario: Grid size changes
- **WHEN** the arena uses a different number of rows or columns
- **THEN** the render dimensions are recalculated from that grid and the complete arena remains visible in the responsive slot

#### Scenario: Available viewport cannot fit one logical pixel per CSS pixel
- **WHEN** the viewport becomes smaller than the native logical stage
- **THEN** the complete arena remains visible using positive integer render dimensions and integer pixel sizing, with reduced detail or unused space as needed and no fractional-fit fallback

#### Scenario: Integer pixel fit
- **WHEN** the arena slot is resized or the native render resolution does not fit
- **THEN** the renderer uses integer dimensions and integer pixel sizing, preserves crisp edges, and may leave unused space rather than stretch, crop, or fractionally scale the arena

#### Scenario: Device layout selection
- **WHEN** a desktop or mobile browser changes viewport size or aspect ratio
- **THEN** the game retains the landscape composition; a portrait-held touch device shows a rotate notice, and a landscape-held device fits the complete board into the available arena slot

### Requirement: Input and HUD
The game SHALL support WASD regardless of Caps Lock or Shift, arrows and Space, and readable HUD within the responsive viewport. On mobile devices, a tap in the rendered arena SHALL place a bomb and a directional swipe beginning anywhere in the surrounding UI area SHALL move the player in that direction while the gesture remains held. Releasing or cancelling a gesture, losing focus, or leaving the page SHALL clear its movement input. The game SHALL preserve the four title/links/settings/version corner roles.

#### Scenario: Touch movement and bomb placement
- **WHEN** a player swipes in the UI area and taps the rendered arena with separate fingers
- **THEN** movement and bomb placement both register

#### Scenario: Swipe release and cancellation
- **WHEN** a player releases or cancels a movement swipe, or the page loses focus
- **THEN** the associated movement input is cleared

#### Scenario: Fullscreen resize
- **WHEN** the player enters fullscreen or resizes the browser
- **THEN** the whole arena and essential HUD remain visible and controls map correctly to the resized display

#### Scenario: Capitalized controls
- **WHEN** a player presses and releases movement keys with Caps Lock or Shift active
- **THEN** their intended movement starts and stops normally without stuck input

### Requirement: Recovery and lifecycle
The game SHALL show useful unsupported-WebGPU and initialization-error messages and SHALL not duplicate loops, resources, listeners or held input after remount/restart. Local practice SHALL expose pause/resume.

#### Scenario: Unsupported device
- **WHEN** required rendering support is unavailable
- **THEN** the page shows the requirement and recovery guidance while surrounding UI remains usable

#### Scenario: Resume practice
- **WHEN** the player pauses and resumes practice
- **THEN** simulation resumes once without a fuse time jump or stuck movement
