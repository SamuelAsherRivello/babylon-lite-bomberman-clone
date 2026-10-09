# Spec Delta

## MODIFIED Requirements

### Requirement: Original readable feedback
The game SHALL use original scenery, distinct colored character silhouettes and walking animations, bomb fuse feedback, readable cross blasts, five distinguishable upgrade icons with visible names and meanings, sudden-death warnings and elimination effects. Important HUD and all supporting panel information SHALL remain readable within the viewport without covering the arena or requiring scrolling. By default, PCs SHALL use a landscape composition with the largest practical square arena slot on the left and the information panel on the right, while mobile devices SHALL use a portrait composition with the arena above the same responsive panel, including when physically held in landscape. A player-selected aspect SHALL use its corresponding composition on either device class. The complete panel SHALL fit by compacting its contents and reducing the arena slot as needed. Touch movement SHALL use directional swipes in the information panel and bomb placement SHALL use taps in the rendered arena. The four corner roles and outside gutters SHALL remain intact in windowed and fullscreen modes.

#### Scenario: PC default layout
- **WHEN** a PC browser displays an active round before the player selects an aspect
- **THEN** the 16:9 landscape composition places the square arena slot on the left and the complete, non-scrolling information panel on the right, regardless of the browser window's aspect ratio

#### Scenario: Touch battle
- **WHEN** a mobile browser displays an active round before the player selects an aspect
- **THEN** the 9:16 portrait composition places the square arena slot above the complete, non-scrolling information panel, and the full arena, scores, time, status, and simultaneous swipe movement and arena-tap bombing remain usable

#### Scenario: Player-selected composition
- **WHEN** a player selects the aspect opposite the device default
- **THEN** the corresponding 16:9 side-by-side or 9:16 stacked composition displays the complete arena and panel without scrolling, and the device's existing touch or keyboard controls remain usable

#### Scenario: Mobile device held in landscape
- **WHEN** a mobile browser displays an active round while the device is physically held in landscape
- **THEN** the selected composition remains active, all three top-navigation controls remain visible, and the arena slot shrinks as needed so the complete information panel remains visible without scrolling
