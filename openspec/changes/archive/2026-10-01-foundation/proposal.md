# Proposal

## Why

The current repository is a React/Vite starter with no game. Create the playable foundation for a complete original 2–4-player competitive Bomberman Clone, ultimately launched from the README as a public Colyseus multiplayer demo.

## What Changes

- Establish milestone one, Foundation, with local practice, original arena presentation, keyboard/touch controls, deterministic movement/collision/bomb rules, elimination, and restart.
- Adapt the current template's 2DPixelPerfect policy and select a game-appropriate resolution based on browser verification.
- Preserve application root and four corner roles; update project identity, dependency/build configuration, tests, and documentation.
- Include OpenSpec workflow instructions and links in the README.
- Record the complete product contract and the later Multiplayer Setup and Gameplay Polish milestones in `delivery-brief.md`. Propose those sequentially only after the preceding milestone passes verification and is finalized.

Foundation acceptance: complete local practice and restart in a real WebGPU browser with keyboard and emulated touch; tested bomb rules; readable whole-arena presentation. Foundation is not the completed multiplayer game. Final acceptance requires two browser clients entering through the README public link and completing an online match and rematch.

## Capabilities

### New Capabilities
- `arena-foundation`: deterministic arena movement, bomb rules, elimination, and restart.
- `pixel-perfect-presentation`: crisp responsive 2D presentation, controls, lifecycle, and recovery.
- `demo-entry`: truthful README launch documentation and OpenSpec navigation.

### Modified Capabilities
None; the project has no accepted specs.

## Impact

Changes affect application source, tests, assets and documentation under `project-name/`, root npm/Vite configuration, README, workflows, and OpenSpec context. Babylon Lite/WebGPU is a selected new dependency, not an installed component. Colyseus integration and shared server changes belong to milestone two. Hosting and server access remain unverified; a deployed client alone cannot satisfy final delivery. Preserve unrelated `.tmp/` content and existing server games. No pull requests.
