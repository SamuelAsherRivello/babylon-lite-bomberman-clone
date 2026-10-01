# Multiplayer milestone evidence

2026-10-01: shared client release v0.9.0 published. Canonical backend health reported v0.9.0 with bomberman registered. Client dependency pins that immutable release tarball.

Local development UI against the public backend: two independent headless Chrome pages with WebGPU created/joined a six-character code, readied, entered the same countdown, and observed the same bomb elimination and Player 2 winner. No page errors. Screenshot: multiplayer-round.png. This does not verify the public Pages client, latency/jitter, long matches or reconnect UI yet.

Game rules/prediction tests: 13 passed; production build passed. Online UI implementation remains under verification and is not yet published.

Backend release workflow 36857600710: release passed, local 36-test regression suite passed, canonical version gate passed, live suite 35/36 passed. Existing Neon Breaker live test failed at input sync. A subsequent isolated live run failed at initial snapshot. This requires investigation; do not claim deployment acceptance. Rollback also failed with Vercel HTTP 402 (plan restriction). The backend remained accessible to the successful two-browser Bomberman check.

Hosting: checked-in maxDuration is 300 seconds. Vercel documents that WebSockets close at maxDuration (https://vercel.com/kb/guide/real-time-chat-websockets). In-memory rooms cannot promise preserved full-match state across process destruction. Full first-to-three matches/rematches remain mandatory; do not shorten game rules to fit hosting. Resolve persistent hosting or durable server-side continuity before final acceptance.

Optional design reference supplied by user: https://itch.io/games/html5/tag-bomberman. Use for arena readability, readable blast effects and browser multiplayer flow; create original assets and layouts.

Follow-up checks: v0.9.1 release/deploy run 36859061200 passed the complete local and public regression suites. Earlier successful run 36858536492 was a restoration of v0.8.0, not a Bomberman retry; inspecting its checkout tag corrected that interpretation. Canonical health checks must bypass stale caches and match the expected release.

v0.9.2 adds recovery immediately after joining (SDK minUptime 0), retries covering the 15-second seat window, and a lifecycle guard preventing already-queued SDK retries after consumer teardown. The 36-test server suite, typecheck and six-file tarball packaging pass. Release/deploy workflow 36860119994 completed successfully, including canonical alias version and every registered game's live checks. The game pins the immutable v0.9.2 artifact.

The expanded local browser check passed against the updated local server: color uniqueness, two-player readiness, late-join spectating, visible movement before a delayed message can reach the server, remote convergence, held-input neutralization in settings, bomb placement and common winner, preserved identity after offline recovery, mobile joining, fifth-seat rejection, invalid-code error and separate room creation. Outbound latency/jitter is 180–240ms; queued binary packets are copied before delay to preserve the SDK's reused encoder buffers. Renderer sprite reuse now explicitly restores visibility; the test verifies actual character pixels. Physical mobile hardware remains unverified.

The latest local run also passed after template reconciliation: fixed landscape ratio, four gutters, all four corners inside ui_layer, positive visible canvas and touch controls outside the arena. Sixteen unit checks and the build pass. Local reconciliation now uses a critically damped spring; remote players interpolate a 100ms snapshot buffer. Deterministic tests verify uniform remote strides with uneven arrival and gradual local settling without delaying new movement. Public Pages verification remains pending at this checkpoint.
