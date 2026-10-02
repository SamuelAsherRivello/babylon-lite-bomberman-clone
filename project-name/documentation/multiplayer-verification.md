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

Public milestone accepted on 2026-10-01: Pages run 36863311080 published f463b1e. The same independent two-browser check passed on https://samuelasherrivello.github.io/babylon-lite-bomberman-clone/ with public assets and backend connectivity, readiness, pixel-visible immediate movement, remote convergence, settings neutralization, common round winner, identity/score recovery, mobile admission, full/invalid-code errors and isolated rooms. The canonical backend now reports v0.9.3; its unrelated Ring Rivals addition leaves Bomberman sources unchanged and release run 36862368231 passed all live checks. The game retains the compatible pinned v0.9.2 package.

Latency harness correction: delayed SDK bytes are copied and delivery remains ordered, matching WebSocket semantics. An earlier harness could reorder consecutive packets at its jitter-cycle boundary; the server correctly rejected stale input. The corrected public run passed. This is outbound latency/jitter emulation, not proof of every real-world network condition. Full-match/rematch, upgrades, sudden death, audio and hosting continuity remain mandatory Gameplay Polish acceptance.

## Gameplay Polish checkpoint — 2026-10-01

The shared arena now implements mirrored hidden upgrades, safe reveal, exposed-item destruction, exact bomb/range/speed caps and deterministic inward wall warnings/closure. Server scoring advances rounds automatically, stops at three wins and requires all connected players to ready a fresh rematch. Twenty-two game tests and sixty-one shared-server tests passed; server typecheck and tarball packaging passed. A monotonic elapsed-time accumulator corrected slow callback-driven simulation timing. Two real local Colyseus clients completed a first-to-three match and rematch in approximately 27 seconds, with a measured 2.5-second fuse.

The expanded local Chrome test passed a complete first-to-three match and rematch, immediate pixel-visible movement under ordered 180–240ms outbound latency/jitter, remote convergence, input neutralization, same-identity offline recovery, score/upgrades reset, mobile spectating, full-room and invalid-code errors, and room isolation. Screenshots multiplayer-round.png, multiplayer-match.png and multiplayer-mobile.png at this checkpoint are **local candidate evidence**, not final public screenshots. Four original couriers now have directional walking frames; arena graphics show pickups, imminent walls, closed walls and bounded elimination particles. The multi-row atlas requires invertY:false; actual browser pixels caught and verified that correction.

Real Chrome WebAudio checks passed original synthesized music and bomb effects, mute and volume gain automation, no AudioContext allocation under ?mute=1, and context closure on mode changes. AudioParam.value alone can report the intrinsic value rather than scheduled automation; the verifier observes the actual output gain automation. Physical audio output and physical touch hardware remain unverified.

Server candidate v0.9.4 was published by run 36866181231 and its canonical version gate passed. Its local 61-test suite passed; the public suite passed 60/61, including the complete first-to-three/rematch check, but failed an admission assertion (a join returned no room identity). An isolated canonical retest reproduced failure of same-identity recovery. The workflow's rollback also failed with HTTP 402. These failures remain unresolved; do not present the candidate as accepted public delivery.

Read-only hosting probe 36866176461 confirmed **Vercel Hobby with Fluid enabled**. No billing or account settings were changed.

## Accepted host limit and published playtest — 2026-10-01

The user explicitly directed us to respect the five-minute limit, replacing the earlier long-session continuity gate and persistent-host request. The server retains maxDuration 300; the two-minute round timer and first-to-three target remain unchanged. The online lobby and README disclose expiry and creating a fresh room. Host resets do not preserve identity or scores. Final public match/rematch and expired-room recreation checks remain required within this accepted constraint.

WIP v0.0.3 is publicly playable from the prominent README link. Pages run 36871504869 successfully deployed commit e656280. The user authorized immediate WIP publication without an additional prepublication test gate. This is distinct from final release acceptance.

The client pins immutable v0.9.4. Subsequent shared-server release v0.9.5 (run 36867189103) passed the complete public suite with unchanged Bomberman sources. Current v0.9.6 deployment run 36870380432 failed the unrelated Neon Breaker input-sync check; do not represent that entire shared deployment as accepted. Bomberman full-loop public-browser verification continues separately. Current game unit checks total 23. Local real-browser audio checks cover all eight effects, music, output gain automation, mute/volume, forced silent launch and teardown.

## Public WIP full-loop verification — 2026-10-01

The updated browser command passed against the published v0.0.3 Pages client and canonical backend: two independent browsers completed a first-to-three match and readied a fresh rematch with zero scores and reset upgrades. It verified ordered 180–240ms outbound latency/jitter, immediate rendered local motion, remote convergence, acknowledged neutral input after opening settings, focus loss, a legal keyboard pickup and same-tick chain explosion, common outcomes and same-identity offline recovery. Mobile checks passed late spectating, simultaneous movement/bomb touch and cancellation, full-room rejection, invalid codes and room isolation. An empty disposed room returned the explicit expired-code guidance, after which the browser created a fresh room. No page errors were reported. This does not simulate a function surviving beyond its limit or prove durable state after a host reset.

An earlier failed chain check was a controller error: delayed snapshot feedback overshot the second bomb to tile 1 while the first was at tile 4 (range 2). Timed ordered keyboard actions now place bombs at tiles 2 and 4, assert those positions, and move beyond the blast boundary. Game rules and fuse duration were unchanged. Current screenshots multiplayer-round.png, multiplayer-match.png and multiplayer-mobile.png come from the successful public run.

`npm test` passed all 23 checks and `npm run build` passed after the input-neutralization improvement. `node project-name/test/ui-browser.mjs` passed fixed landscape layout, corners/gutters, fullscreen, resize, emulated zoom/DPR, silent settings and unsupported-WebGPU recovery. Final release/version and draw-screen audit remain pending.

## Released game verification — 2026-10-01

Release workflow 36876433920 created v0.0.4 and generated commit 965c6b7; the local checkout fast-forwarded to it. Pages workflow 36876680930 succeeded. The full public browser command with EXPECTED_VERSION=0.0.4 passed all match/rematch, pickup/chain, input, recovery, mobile and recreation assertions against the README link. Canonical health reported v0.9.6 with Bomberman registered; the client retains compatible immutable v0.9.4. Current shared-server typecheck and all 67 local regressions passed, including every registered game. Scoped server documentation commit 7591707 records published match rules and the accepted host limit.

`draw-browser.mjs` passed a real-time local two-browser scenario using unchanged production rules. Both players waited at mirrored corners; the first sudden-death wall wave eliminated both in one tick, both screens showed Draw!, scores stayed zero, and round two began automatically with fresh upgrades. No test-only clocks, position setters or gameplay messages were used. Screenshot: multiplayer-draw.png. The local full-match browser command also passed after the input-neutralization change.

Public recovery is not universally reliable on this in-memory host. One release-verification run lost recovery after a 1.2-second offline interval and showed the actionable expired-room message while another client remained connected; a subsequent diagnostic run recovered the same identity and passed the entire suite. This limitation can occur before five minutes and remains disclosed in README. Do not infer durable room state or guaranteed recovery from the successful run. New-room recreation is verified; the accepted host configuration is unchanged.

Final audit detected global CLI 1.13.1 despite project skills generated by 1.14.0. The npm registry confirmed latest stable 1.14.0; reinstalling it restored the required version and a healthy OpenSpec doctor result. Generated project skills were not hand-edited.

## Game feedback 1 — 2026-10-02

The client pins released shared package v0.9.7. Server source commit 7015392 passed typecheck and 70 regressions locally and in release CI. The release package and canonical health version are verified; deployment run 36888433521 failed its first live admission timing check, while a direct rerun passed. This is reported as a transient failed verification, not an entirely green deploy workflow.

The updated two-browser acceptance passed against canonical v0.9.7: four human seats, full first-to-three/rematch, 180–240ms ordered outbound latency/jitter, immediate local motion, remote convergence, legal pickup/chain, neutral settings/focus inputs, identity recovery, CPU-seat takeover, mobile simultaneous movement/bomb/cancellation, capacity rejection and room recreation. Client 33 tests and production build pass. Browser feedback checks pass all five icon meanings, all map choices, difficulty selection, persisted Bomb Flash and real three-second death/retry delay. Fixed 16:9 fullscreen/resize/DPR/unsupported-device recovery also pass. Final public client version and real-time draw are pending at this checkpoint.
