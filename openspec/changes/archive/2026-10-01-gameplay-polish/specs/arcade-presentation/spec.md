## Purpose
Make the original pixel arena readable and expressive with animated characters, clear event feedback and controllable original audio.

## ADDED Requirements

### Requirement: Original readable feedback
The game SHALL use original scenery, distinct colored character silhouettes and walking animations, bomb fuse feedback, readable cross blasts, three distinguishable upgrade icons, sudden-death warnings and elimination effects. Important HUD and simultaneous touch controls SHALL remain inside the fixed landscape viewport without covering the arena or requiring scrolling to play. The four corner roles and outside gutters SHALL remain intact in windowed and fullscreen modes.

#### Scenario: Touch battle
- **WHEN** a narrow touch browser displays an active round
- **THEN** the full arena, scores, time, status and movement/bomb buttons are visible and simultaneous actions work

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
