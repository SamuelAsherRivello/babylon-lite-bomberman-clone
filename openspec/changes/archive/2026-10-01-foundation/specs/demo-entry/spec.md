## Purpose

Give players a truthful README launch path and developers accurate setup and OpenSpec workflow navigation throughout delivery.

## ADDED Requirements

### Requirement: Truthful launch entry
The README SHALL identify Bomberman Clone, document verified local commands and browser requirements, and distinguish local practice from completed online multiplayer. A public demo link SHALL point to the actual project deployment and SHALL only claim multiplayer completion after two public clients complete a match and rematch with the live server.

#### Scenario: Foundation documentation
- **WHEN** a reader opens the README after Foundation
- **THEN** local practice setup is accurate and multiplayer work is explicitly pending rather than represented as complete

#### Scenario: Final multiplayer launch gate
- **WHEN** the final milestone is accepted
- **THEN** the README Play Multiplayer Demo link opens the live room lobby without installation or credentials and two browsers can complete an online match and rematch

### Requirement: OpenSpec navigation and provenance
The README SHALL link active changes and accepted specs, describe the sequential three-milestone OpenSpec workflow, preserve the actual original prompt and follow-ups in a collapsible section, and document asset provenance and verification limitations.

#### Scenario: Developer follows milestone progress
- **WHEN** a developer follows README OpenSpec links
- **THEN** they can find the current change and accepted specs and understand explore, propose, apply, verify, sync and archive steps
