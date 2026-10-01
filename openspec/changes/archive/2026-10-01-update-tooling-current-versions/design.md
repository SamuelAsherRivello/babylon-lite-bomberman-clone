# Design

## Context

See proposal.md for motivation. OpenSpec 1.14.0 is the current stable registry version and its `update` command regenerated this project's Codex skills with matching `metadata.generatedBy`. `openspec doctor --json` reports a healthy root. The Codex configuration contains a table for `computer_use.windows.always_allowed_app_ids`, while the official configuration reference defines that field as an array of strings.

## Goals / Non-Goals

**Goals:** Keep project setup guidance compatible with current OpenSpec releases and preserve the existing `msedge.exe` allow-list value in a valid form.

**Non-Goals:** Change game behavior, add dependencies to the application, or revise the unrelated in-progress Foundation implementation.

## Decisions

- Describe OpenSpec as latest stable and verify generated metadata against the installed CLI. This allows compatible future updates without baking the old 1.13.1 pin into setup instructions.
- Use `computer_use.windows.always_allowed_app_ids = ["msedge.exe"]`, preserving the existing entry while matching the documented `array<string>` type.
- Use `skip_specs: true` because this is tooling and configuration maintenance with no game behavior contract changes.

## Risks / Trade-offs

- A future OpenSpec release may change its skill output format; `openspec update`, `openspec doctor`, and metadata checks provide a clear point to catch that change.
- The Edge identifier may no longer be valid for a future Computer Use implementation; Codex config parsing and warning checks verify recognition, while desktop settings remain the source for managing saved approvals.
