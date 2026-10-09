# Spec Delta

## MODIFIED Requirements

### Requirement: Original readable feedback
The game SHALL use original scenery, distinct colored character silhouettes and walking animations, bomb fuse feedback, readable cross blasts, five distinguishable upgrade icons with visible names and meanings, sudden-death warnings and elimination effects. Important HUD and all supporting panel information SHALL remain readable within the viewport without covering the arena or requiring scrolling. Fine-pointer devices SHALL use a landscape composition with the largest practical undistorted gameplay region on the left and a narrower information panel on the right. Coarse-pointer devices SHALL use a portrait composition with the complete gameplay region above the same responsive panel, including when physically held in landscape. The panel SHALL use the space remaining after the gameplay region is prioritized, and the four corner roles and outside gutters SHALL remain intact in windowed and fullscreen modes.

#### Scenario: Landscape arena priority
- **WHEN** a fine-pointer browser displays an active round
- **THEN** the landscape composition gives the board the largest practical fully visible undistorted region and uses the remaining width for a complete, readable, non-scrolling information panel

#### Scenario: Touch battle
- **WHEN** a narrow touch browser displays an active round
- **THEN** the full arena, scores, time, status and movement/bomb buttons are visible and simultaneous actions work

#### Scenario: Portrait space allocation
- **WHEN** a coarse-pointer browser displays an active round
- **THEN** the portrait composition keeps the complete board above the panel and assigns space that would otherwise become vertical letterboxing to the complete information panel rather than leaving avoidable dead space

#### Scenario: Mobile device held in landscape
- **WHEN** a mobile browser displays an active round while physically held in landscape
- **THEN** the portrait composition remains stacked, the arena remains fully visible and undistorted, and the panel remains complete without scrolling

#### Scenario: Layout resize and fullscreen
- **WHEN** the viewport is resized or enters fullscreen in either composition
- **THEN** the arena and panel are recalculated without overlap, cropping, or loss of essential information

#### Scenario: In-arena player names
- **WHEN** an active arena displays the four player seats
- **THEN** each player name is rendered in a compact `div` overlay on the corresponding gameplay corner row: players 1 and 2 occupy the first playable row, players 3 and 4 occupy the last playable row, each label is no taller than one grid/tile row, and left/right labels are anchored to their matching corners

### Requirement: Controllable original audio
The game SHALL provide original arcade music and event sound effects, a mute checkbox and volume setting. The documented mute URL argument SHALL force all audio silent for automated testing. Audio SHALL begin only after permitted user activation and SHALL release timers and resources on teardown.
#### Scenario: Silent launch
- **WHEN** the public game opens with mute=1
- **THEN** music and every effect remain silent regardless of saved audio preferences

#### Scenario: Change volume and mute
- **WHEN** a player changes volume or enables mute
- **THEN** the setting affects music and effects immediately without affecting authoritative gameplay

### Requirement: Verified delivery and provenance
Documentation SHALL state actual setup and release commands, controls, rendering mappings, original asset/audio provenance, browser requirements, screenshots and verified limits. Release/deployment SHALL verify public assets and displayed version, and local checkouts SHALL include generated release commits. All three sequential OpenSpec milestones SHALL be complete before claiming final delivery.

#### Scenario: Release audit
- **WHEN** the final game release is delivered
- **THEN** public gameplay, release version, README links and local/remote revisions match the recorded verification evidence

### Requirement: Death cause visibility
Local practice SHALL hold the visible lethal scene for three seconds before presenting a death or retry prompt. Online play SHALL display each current authoritative state without a local death or result hold.

#### Scenario: Online elimination
- **WHEN** the local player dies while other combatants remain alive
- **THEN** that browser immediately spectates the continuing room without holding the cause-of-death scene

#### Scenario: Practice elimination
- **WHEN** the local practice player dies
- **THEN** that browser holds the visible lethal scene for three seconds before presenting the retry prompt

#### Scenario: Final elimination
- **WHEN** a round ends through elimination
- **THEN** online browsers show the result prompt when the authoritative room enters results, while local practice retains its three-second death view

### Requirement: Optional bomb warning flash
Bombs SHALL flash twice during the final 0.5 seconds before timed explosion when the player's Bomb Flash checkbox is ON. OFF SHALL suppress that warning flash without changing gameplay timing or other players' preferences.

#### Scenario: Preference disabled
- **WHEN** the player selects Bomb Flash OFF
- **THEN** their bombs show no warning flashes and explode at the same authoritative time

#### Scenario: Preference enabled
- **WHEN** a timed bomb enters its final half-second with Bomb Flash ON
- **THEN** it displays exactly two warning flashes before exploding
