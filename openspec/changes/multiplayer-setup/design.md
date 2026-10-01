# Design

## Context

Foundation is archived and committed. The shared server uses Colyseus core 0.17.44, SDK 0.17.43, Express, private gungeon admission codes, 20Hz full gameState events and a released generic MultiplayerClient 0.7.0. Its default reconnect creates new identities. Server Vercel configuration allows 300 seconds and has no durable storage. Source is an isolated checkout under `.tmp/bomberman-server`.

## Goals / Non-Goals

Goals: private 2–4-human rooms, authority, bounded recovery, smooth presentation and backward-compatible server extension. Non-goals: final audio/effect polish and complete progression acceptance; these remain milestone three. No existing game's protocol is changed.

## Decisions

- Reconcile updated template revision 6a6b7d1 after checkpoint 88b39a5. Use a fixed landscape viewport ratio 320:272 with four residual gutters and all primary UI inside ui_layer. The renderer now frames the 240×208 arena directly in a separate canvas region, reserving CSS space above/below for HUD and controls. This replaces Foundation's 320×272 internal border so touch controls cannot overlap the arena in narrow browser windows. Use native DPR-aware render resolution, precise sprite positions and integer logical-to-CSS scaling where it fits, otherwise centered positive fractional fit. The user authorized choosing one orientation; no orientation selector or persisted override is included.
- Register `bomberman` with generic private admission generalized from gungeon. Capacity includes disconnected reserved seats. Late arrivals during play spectate until the next round. Ready starts only with at least two connected players; unique color is chosen in lobby.
- Export the exact pure arena rules from the shared client package as an additive bomberman subpath; server and browser use identical collision and bomb semantics. Publish an immutable release tarball before client integration. Existing imports remain unchanged.
- Run fixed 60Hz simulation and 20Hz snapshots with server tick and per-player last processed sequence. Validate finite bounded axes, booleans, nonnegative increasing sequences, input rate and ownership. Inputs expire after 300ms. Queue action edges separately so held movement cannot duplicate bomb requests.
- Client predicts its local movement immediately using shared collision. Buffer unacknowledged inputs, replay after snapshots, smoothly resolve small position error, interpolate other players. Pending bomb ghosts are cosmetic until server confirmation. No client-authored damage or outcome.
  Local correction uses a critically damped spring that preserves displayed position and correction velocity across acknowledgements. Remote presentation buffers up to 24 snapshots and interpolates 100ms behind the estimated server clock; it holds the latest known position when the buffer runs dry instead of extrapolating through walls. Round transitions clear the buffers and elimination stays immediate. Deterministic uneven-arrival tests and two-browser checks with 180–240ms input latency/jitter pass.
- Add Bomberman-only Colyseus reconnection support; on unconsented drop allowReconnection for 15 seconds, retain identity/score/seat and vulnerability with zero input. Consent departure removes immediately. Shared-client existing games retain fresh-identity retries; Bomberman attempts SDK token reconnect before retrying admission.
- Keep production endpoint `https://rmc-colyseus-multiplayer-server.vercel.app`, subject to live health/version checks. Deployment tests must include Bomberman admission and game actions, not only drawing. Hosting reset remains a clearly reported interruption and cannot be represented as supported bounded reconnect. Investigate duration settings without reducing the requested two-minute rounds or first-to-three target; final long-match acceptance must account for host resets.

## Risks / Trade-offs

- Five-minute server lifetime can interrupt full matches → preserve original game rules; verify longer session capability and report actual host interruption behavior. Do not falsely claim worst-case uninterrupted match support.
- Full snapshots increase bandwidth → bounded arena and four humans are small; deduplicate blast cells and keep particles local.
- Anonymous reconnection tokens grant session identity → treat as secrets, never log or include in screenshots; do not accept arbitrary client identity claims.
- Shared backend evolves concurrently → fetch before push, preserve unrelated games, run regressions, never force push.

## Migration Plan

Implement additive room/client APIs, test and release backend through existing version/deploy workflow; verify canonical health version, game admission and two-client actions. Pin release artifact in consumer and deploy client. Roll back backend with existing Deploy backend release workflow if live checks fail. Complete two public browser verification before milestone acceptance.
