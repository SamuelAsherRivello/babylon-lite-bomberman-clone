# Spec Delta

## MODIFIED Requirements

### Requirement: Original readable feedback
The game SHALL use original scenery, distinct colored character silhouettes and walking animations, bomb fuse feedback, readable cross blasts, five distinguishable upgrade icons with visible names and meanings, sudden-death warnings and elimination effects. Important HUD and all supporting panel information SHALL remain readable within the viewport without covering the arena or requiring scrolling. Desktop and mobile SHALL use one 16:9 landscape composition with the largest practical square arena slot on the left and the information panel on the right. A portrait-held touch device SHALL prompt rotation to landscape rather than present a second game layout. The complete panel SHALL fit in landscape by compacting its contents and reducing the arena slot as needed. Touch movement SHALL use directional swipes in the information panel and bomb placement SHALL use taps in the rendered arena. The four corner roles and outside gutters SHALL remain intact in windowed and fullscreen modes.

#### Scenario: Landscape play
- **WHEN** a desktop browser or landscape-held mobile browser displays an active round
- **THEN** the 16:9 composition places the square arena slot on the left and the complete, non-scrolling information panel on the right

#### Scenario: Touch battle
- **WHEN** a landscape-held mobile browser displays an active round
- **THEN** the full arena, scores, time, status, and simultaneous swipe movement and arena-tap bombing remain usable in the landscape composition

#### Scenario: Mobile device held in portrait
- **WHEN** a touch device is held in portrait
- **THEN** the landscape viewport remains 16:9 and shows a prompt to rotate the device before play
