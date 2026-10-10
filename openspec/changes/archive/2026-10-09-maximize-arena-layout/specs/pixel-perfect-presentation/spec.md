# Spec Delta

## MODIFIED Requirements

### Requirement: Whole arena pixel presentation
The game SHALL use a responsive viewport with a separate UI area and show the entire arena through a fixed top-down view. Fine-pointer devices SHALL use a landscape layout with the largest practical undistorted gameplay region left of the UI; coarse-pointer devices SHALL use a portrait layout with the complete gameplay region above the UI, regardless of viewport aspect ratio. The arena SHALL preserve authored hard pixel edges without texture smoothing, remain uncropped and undistorted, and use the space available after the gameplay region is prioritized. Logical, render, backing, display mappings and selected resolution SHALL be documented.

#### Scenario: Landscape maximum board fit
- **WHEN** a fine-pointer viewport has enough width for the arena and panel
- **THEN** the gameplay region expands to the largest board-aspect area that fits the usable viewport while the panel contracts to its smallest readable complete layout

#### Scenario: Available viewport cannot fit one logical pixel per CSS pixel
- **WHEN** the viewport becomes smaller than the logical stage
- **THEN** the entire arena remains visible with positive fractional scale and the documented strict alignment limitation applies

#### Scenario: Portrait dead-space recovery
- **WHEN** a coarse-pointer viewport uses the stacked composition
- **THEN** the complete board remains fully visible and space that would otherwise become board letterboxing is made available to the panel without introducing scrolling

#### Scenario: Integer pixel presentation
- **WHEN** the arena slot is resized or the native render resolution does not fit
- **THEN** the complete arena remains visible with crisp authored edges, no stretching or cropping, and the documented integer tile sizing or supported fit behavior

#### Scenario: Fullscreen and resize
- **WHEN** the player enters fullscreen or resizes the browser
- **THEN** the arena and panel recompute their sizes and mappings while preserving the selected pointer-based composition

### Requirement: Input and HUD
The game SHALL support WASD regardless of Caps Lock or Shift, arrows and Space, simultaneous touch direction and bomb actions, input release on blur/cancellation, readable HUD and controls within the viewport, and the four title/links/settings/version corner roles.

#### Scenario: Touch movement and bomb placement
- **WHEN** a player holds a direction and presses the bomb button on a narrow screen
- **THEN** movement and bomb intent both register and releasing or cancelling touches clears their respective input

#### Scenario: Fullscreen resize
- **WHEN** the player enters fullscreen or resizes the browser
- **THEN** the whole arena and essential HUD remain visible and controls map correctly to the resized display

#### Scenario: Capitalized controls
- **WHEN** a player presses and releases movement keys with Caps Lock or Shift active
- **THEN** their intended movement starts and stops normally without stuck input

#### Scenario: Player-label placement
- **WHEN** the arena uses LOW, MED, or HIGH map dimensions
- **THEN** all four player labels remain inside the rendered gameplay bounds, align with the first or last playable row at their matching left/right corners, have a border-box height no greater than one tile, and remain unclipped without changing their player order

### Requirement: Recovery and lifecycle
The game SHALL show useful unsupported-WebGPU and initialization-error messages and SHALL not duplicate loops, resources, listeners or held input after remount/restart. Local practice SHALL expose pause/resume.

#### Scenario: Unsupported device
- **WHEN** required rendering support is unavailable
- **THEN** the page shows the requirement and recovery guidance while surrounding UI remains usable

#### Scenario: Resume practice
- **WHEN** the player pauses and resumes practice
- **THEN** simulation resumes once without a fuse time jump or stuck movement
