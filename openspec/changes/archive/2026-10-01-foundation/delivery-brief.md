# Complete game delivery contract

This records the user's complete product scope across three milestones; only Foundation is currently proposed. Do not treat local practice as completion.

## Sequential OpenSpec workflow

1. **Foundation:** renderer, original arena assets, resolution selection, controls, reusable deterministic rules, local practice and restart.
2. **Multiplayer Setup:** explore the actual shared server and its deployment, propose after Foundation completion, implement and release the server before completing client integration, deliver a public two-client multiplayer build.
3. **Gameplay Polish:** propose after Multiplayer Setup completion, finish progression, match flow, effects/audio, accessibility/readability, latency testing, and final public release.

For each milestone explore relevant repository facts, propose design/specs/tasks, apply after authorization, verify acceptance, sync accepted specs, archive, commit scoped work, push normally, and update affected repositories/documentation. Resolve material failures before proceeding. Preserve unrelated work; no PRs. Planning-only requests stop after artifacts. Once implementation and continuation are authorized, continue sequentially within scope.

## Game and rendering

- Title Bomberman Clone; original SNES-inspired competitive 2D game for 2–4 humans, individual teams.
- 15×13 tile arena, outer walls, fixed pillars, destructible blocks, symmetric power-ups and blocks, equal clear corner escape routes, fixed whole-arena orthographic view, landscape desktop/mobile layout.
- Babylon Lite/WebGPU, not full Babylon.js. Adapt current template 2DPixelPerfect instructions from https://github.com/SamuelAsherRivello/github-repository-template/blob/HEAD/project-name/documentation/layout-and-game-integration.md.
- Evaluate 16×16 authored tiles (240×208 arena). Select/document final logical stage dimensions and internal/backing/CSS mappings using browser evidence; do not copy 320×180 showcase defaults automatically.
- Nearest min/mag filters, no mipmaps, clamp-to-edge, MSAA 1, CSS pixelated. Center integer logical-to-CSS scaling with internal letterboxing; positive fractional fallback on undersized screens with pixel alignment guarantees suspended. Engine owns backing size; apply DPR once. Keep precise simulation/prediction and smooth presentation; independent React CSS UI.
- Preserve title upper left, links upper right, version lower right, settings lower left. Essential HUD/touch controls inside viewport, visible in fullscreen without scrolling or covering play.
- WASD/arrows movement, Space bomb; simultaneous directional pad and bomb touch input, release on blur/cancellation. UI must not intercept reserved gameplay keys.
- Unsupported WebGPU, initialization failure, connection/loading and recovery states must be actionable. Online settings/blur stop local input, not the authoritative match.

## Complete gameplay

- Last survivor wins; simultaneous final eliminations draw; first to three wins takes match. Ready lobby, countdown, score breaks, spectating after elimination, rematch.
- Start each round with one active bomb and two-tile range; 2.5-second fuse; cross blast dangerous for 0.5 seconds; owner can be eliminated.
- Walls stop blasts; destructible blocks stop that ray and are destroyed; bombs chain immediately. Occupants can leave a newly placed bomb but cannot re-enter while it exists.
- Bomb capacity upgrades cap five, range cap eight; three speed upgrades each add 15% of base speed. Hidden power-ups reveal after destroying blast clears; later blasts destroy exposed items. Reset upgrades and arena per round.
- Two-minute timer; final 30 seconds deterministic inward sudden-death walls, each tile telegraphed one second before closing. Timeout without a single survivor draws.
- Original pixel scenery/characters/animations/effects, readable color and silhouette distinctions, original music and sound with mute/volume; no copied assets, logos, exact maps, or character designs.
- References: https://en.wikipedia.org/wiki/Super_Bomberman (gameplay); https://www.google.com/search?udm=2&q=bomberman+snes+graphics (visual proportions/palette/readability). No supplied screenshot attachments.

## Colyseus delivery

- Shared server: https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server. Preserve its existing games and release through its verified workflow. Inspect endpoint/hosting and write access in milestone-two exploration; never invent a working endpoint.
- Create/join shareable room codes, choose unique colors, ready with 2–4 humans. Server validates movement/collision, bomb capacity/placement, fuse/chain/blast rules, blocks, power-ups, elimination, sudden death, timer, scores and match progression.
- Continuous grid-constrained movement with gentle corridor alignment; immediate local prediction, input reconciliation, smooth small corrections, remote interpolation; check actual Colyseus features before using APIs.
- Immediate cosmetic pending bomb feedback confirmed/rejected by server; server-time deadlines and deterministic blast tile events; client-only particles. Prioritize fair timing and smoothness over effect density.
- Reconnect window 15 seconds: disconnected player stops moving but stays vulnerable; restore identity/scores within window, remove after expiry. Resolve current round and return to lobby when fewer than two connected players remain.
- Test two clients and latency/jitter: movement, collision, pending bombs, fuse timing, chain reactions, power-ups, same-tick elimination, scoring and reconnects.

## Final public acceptance

- README Live Demo contains a prominent **Play Multiplayer Demo** link to https://samuelasherrivello.github.io/babylon-lite-bomberman-clone/ once verified live. A new player needs no clone, install, API key, or local server to play.
- Clicking the README link opens the public game, where two browsers create/join the same room, ready, complete a first-to-three match, and rematch using the live shared server over a secure connection.
- Public release verifies asset subpaths, endpoint connection, gameplay controls/timing/scoring, version alignment, fullscreen/resize, desktop/narrow mobile, zoom/fractional DPR, and emulated touch. Distinguish physical-device testing and unverified behavior.
- Run focused game/server checks and builds; capture actual browser screenshots; document setup, controls, renderer mapping, asset provenance, browser requirements and limitations. Preserve the actual full user prompt and consequential follow-ups in a collapsible Original AI Prompt section; do not substitute this interpreted contract for the original.
- README also links accepted OpenSpec specs, current changes, and describes explore → propose → apply → verify → sync → archive and scoped commit/push workflow.
- Release/deploy using actual workflows, verify the public demo, fast-forward local checkouts for release commits, and report playable URL, both repositories/releases, checkout paths, checks, limitations and all three milestone statuses. A green build or deployment alone is insufficient.

Optional reference supplied later by the user: https://itch.io/games/html5/tag-bomberman . Use for browser-game readability and lobby-flow inspiration only; no copied assets or altered core mechanics.
