# Spec Delta

## MODIFIED Requirements

### Requirement: Whole arena pixel presentation
The game SHALL use a responsive viewport with a separate UI area and show the entire current arena through a fixed top-down view. The selected landscape aspect SHALL use a 16:9 viewport with a square arena slot left of the UI; the selected portrait aspect SHALL use a 9:16 viewport with the square arena slot above the UI, regardless of device pointer class or physical window orientation. The renderer SHALL derive positive integer render dimensions from the current grid rows and columns, preserve authored hard pixel edges without texture smoothing, and fit the complete arena using integer sizing without stretching, cropping, or fractional scaling. When the native render resolution cannot fit, the renderer SHALL use a lower integer render resolution or leave unused space so the complete arena remains pixel-aligned. Logical, render, backing, and display mappings and selected resolution SHALL be documented.

#### Scenario: Grid size changes
- **WHEN** the arena uses a different number of rows or columns
- **THEN** the render dimensions are recalculated from that grid and the complete arena remains visible in the selected responsive slot

#### Scenario: Available viewport cannot fit one logical pixel per CSS pixel
- **WHEN** the viewport becomes smaller than the native logical stage
- **THEN** the complete arena remains visible using positive integer render dimensions and integer pixel sizing, with reduced detail or unused space as needed and no fractional-fit fallback

#### Scenario: Integer pixel fit
- **WHEN** the arena slot is resized or the native render resolution does not fit
- **THEN** the renderer uses integer dimensions and integer pixel sizing, preserves crisp edges, and may leave unused space rather than stretch, crop, or fractionally scale the arena

#### Scenario: Device default and override
- **WHEN** a PC or mobile browser first loads, or a player changes the selected aspect
- **THEN** the viewport uses the matching 16:9 landscape or 9:16 portrait composition and fits the complete board into its arena slot

#### Scenario: Physical orientation changes
- **WHEN** a browser window changes size or a mobile device is rotated
- **THEN** the selected aspect remains active and the complete board remains visible within the resized viewport

### Requirement: Input and HUD
The game SHALL support WASD regardless of Caps Lock or Shift, arrows and Space, and readable HUD within the responsive viewport. On mobile devices, a tap in the rendered arena SHALL place a bomb and a directional swipe beginning anywhere in the surrounding UI area SHALL move the player in that direction while the gesture remains held. Releasing or cancelling a gesture, losing focus, or leaving the page SHALL clear its movement input. The game SHALL preserve the four title/links/settings/version corner roles.

#### Scenario: Touch movement and bomb placement
- **WHEN** a player swipes in the UI area and taps the rendered arena with separate fingers
- **THEN** movement and bomb placement both register in either selected aspect

#### Scenario: Swipe release and cancellation
- **WHEN** a player releases or cancels a movement swipe, or the page loses focus
- **THEN** the associated movement input is cleared

#### Scenario: Fullscreen resize
- **WHEN** the player enters fullscreen or resizes the browser
- **THEN** the whole arena and essential HUD remain visible and controls map correctly to the resized display

#### Scenario: Capitalized controls
- **WHEN** a player presses and releases movement keys with Caps Lock or Shift active
- **THEN** their intended movement starts and stops normally without stuck input

## ADDED Requirements

### Requirement: Mode and aspect navigation
Both practice and online play SHALL show top-navigation buttons labeled `Mode: Offline` or `Mode: Online` and `Aspect: Landscape` or `Aspect: Portrait`, where each label reports the current state and pressing its button switches that state. Online SHALL be the initial mode when the URL has no `mode` argument; `mode=offline` SHALL open local practice. The initial aspect SHALL follow the browser's primary pointer class, and a player-selected aspect SHALL remain active across mode changes until the page is reloaded.

#### Scenario: Default online entry
- **WHEN** a player opens the game without a `mode` argument or room invitation
- **THEN** online play opens with `Mode: Online`, using the existing environment-specific backend default

#### Scenario: Direct offline entry
- **WHEN** a player opens the game with `mode=offline`
- **THEN** local practice opens with `Mode: Offline`

#### Scenario: Existing online links
- **WHEN** a player opens the game with `mode=online` or a room invitation
- **THEN** online play opens and the room invitation remains usable

#### Scenario: Room parameter with offline mode
- **WHEN** a URL contains both `room` and `mode=offline`
- **THEN** online play opens and handles the room code as it did before this change

#### Scenario: Switch to online play
- **WHEN** a player presses `Mode: Offline`
- **THEN** online play opens and the button reads `Mode: Online`

#### Scenario: Switch to local practice
- **WHEN** a player presses `Mode: Online`
- **THEN** local practice opens and the button reads `Mode: Offline`

#### Scenario: Switch aspect in either mode
- **WHEN** a player presses the aspect button
- **THEN** the selected composition changes and the button reports the new aspect in both the current mode and after a mode change

#### Scenario: Fresh page visit
- **WHEN** the game loads without a player aspect selection
- **THEN** a fine primary pointer starts in landscape and a coarse primary pointer starts in portrait

### Requirement: GitHub navigation control
Both modes SHALL show `GitHub ↗` in the top navigation as a link to the existing project repository, visually matching the mode and aspect buttons and remaining accessible at compact mobile sizes.

#### Scenario: Compact sideways-held phone
- **WHEN** a mobile browser displays the game in a narrow, physically landscape window
- **THEN** the GitHub link remains visible in the same top navigation as the other controls and opens the same repository destination
