# Proposal

## Why

The project instructions still pin an older OpenSpec release even though the current stable CLI updates and validates this repository successfully. The Codex user configuration also has the Windows allowed-app setting in the wrong TOML shape, causing Codex to ignore it and print a warning.

## What Changes

- Use the latest stable OpenSpec CLI and require generated skill metadata to match the installed CLI version.
- Update the repository's OpenSpec environment note to reflect the current CLI.
- Store the existing Edge allow-list value in the documented string-array format so Codex recognizes the setting.

## Capabilities

This maintenance change does not alter game behavior or another user-facing capability. The change opts out of spec deltas with `skip_specs: true`.

## Impact

Repository setup guidance, OpenSpec context, generated OpenSpec skills, and the user-level Codex TOML configuration are affected. No application code or game dependencies are changed.
