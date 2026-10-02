# Delivery audit

2026-10-01. This is an existing project, not a new repository copy. The updated
template was reconciled at 6a6b7d1 after checkpoint 88b39a5. Confirmed overrides
retain bomberman-clone/ and its history, original music, and OpenSpec 1.14.0.

| Template-use question | Result | Evidence |
| --- | --- | --- |
| Renamed app folder | False | User explicitly requires retaining bomberman-clone/ and history. |
| Vite points to app folder | True | vite.config.js root is bomberman-clone. |
| Applicable identity placeholders resolved | True | Repository/package/base path identify Bomberman Clone; retained folder and historical prompt are deliberate. |
| README describes actual project | True | Online play, rules, controls, hosting limits and real demo link. |
| Setup/run/test/build commands exist | True | package.json; successful Release workflow includes npm ci, npm test and npm run build. |
| Template examples adapted | True | Original atlas/audio, game-specific links, Pages and Release workflows. |
| Four corner roles retained | True | Title, links, version, settings inside ui_layer; browser layout checks. |
| One orientation and no toggle | True | Landscape 320:272, four gutters; renderer/UI/browser checks. |
| Sound mute UI and URL | True | Checkbox, volume and forced mute=1; real WebAudio checks. |
| UI shortcuts avoid game keys | True | WASD/arrows/Space used for gameplay; settings use a button. |
| Generated/local files ignored | True | node_modules, dist, .env, browser output and .tmp excluded. |
| Applicable checks and behavior verified | True | Public v0.0.4 full loop, local real-time draw, 23 game/67 server checks; hosting and physical-hardware limitations disclosed. |

Score: **11/12**. The false answer is a required project override,
not unfinished work.

| Delivery area | Outcome |
| --- | --- |
| Destination mode and app/game choice | Verified: existing Babylon Lite game retained; no template repository mutation. |
| Project structure and renderer | Verified: root npm/Git, bomberman-clone Vite app, native WebGPU only, useful unsupported/retry messages, 240×208 logical arena. |
| Landscape/gutters/corners | Verified by real browser fullscreen, resize, zoom/DPR and narrow-mobile checks. |
| OpenSpec setup | Verified latest stable CLI/generated skills 1.14.0 and healthy repository-local doctor; accidental global downgrade restored during audit. |
| Codex autocomplete after reopening | Unverified: skill files and CLI are verified, but autocomplete UI was not inspected. |
| Original assets/audio | Verified authored atlas and synthesized melody/eight effects; actual WebGPU pixels and WebAudio signal/gain checks. |
| Physical touch and speakers | Unverified: emulated multitouch and generated signals are tested; physical hardware was not used. |
| Local commands | npm test: 23 pass; npm run build: pass; Vite dev and browser commands exercised; release workflow verifies clean npm ci. |
| Public WIP gameplay | Verified: full first-to-three/rematch, pickup/chain, latency/jitter, recovery, mobile input, expired-code recreation, no page errors. |
| Hosting | Verified Hobby/Fluid, maxDuration 300 unchanged, accepted limit disclosed; no durable state after process reset. |
| GitHub About | Verified live online demo homepage and bomberman/colyseus/multiplayer/webgpu topics. |
| Formal release | Verified v0.0.4 workflow 36876433920, Pages 36876680930, displayed version and full public match/rematch; generated commit fast-forwarded locally. |
| Final OpenSpec sync/archive | Verified all 13 Gameplay Polish tasks complete, four capability specs synced and compared, change archived as 2026-10-01-gameplay-polish. All three milestones archived. |

Historical original prompt is retained verbatim in its own file and the README
collapsible section. approved-game-brief.txt preserves the later consolidated
game brief. Later decisions are recorded in OpenSpec artifacts, AGENTS.md and
multiplayer-verification.md rather than rewriting the historical first prompt.

## Requirement evidence

| Product requirement | Authoritative evidence |
| --- | --- |
| Three sequential milestones | Foundation and Multiplayer Setup archives; Gameplay Polish tasks and four synchronized capability specs. |
| Original 15×13 single-screen arena, fair starts | rules.test.mjs symmetry, corner routes and mirrored hidden-item tests; actual WebGPU arena screenshots. |
| Movement, collisions, bomb owner exit/no reentry | rules.test.mjs; online-browser.mjs legal keyboard excavation, pickup and escape. |
| 2.5-second fuse, .5-second blast, block stops rays, chains | Deterministic rules tests, shared bomberman-match.mjs real-time fuse test, public chain IDs with equal blast expiry tick. |
| Upgrade reveal/destruction/caps/reset | rules.test.mjs fixtures for overlapping flames, later blasts, living collection, exact five/eight/three caps; public pickup and rematch reset. |
| Two-minute round, final-30-second warnings/walls | Tick-boundary/escape/collision/crushing tests; real-time draw-browser.mjs at normal server speed. |
| Simultaneous draw and first-to-three/rematch | Shared server simulation fixtures; real two-browser draw/no-points/round-two and public full match/rematch. |
| Rooms/readiness/colors/spectators/capacity/isolation | Public online-browser.mjs independent contexts, distinct colors, late join, full and invalid rooms and separate codes. |
| Authority and input validation | Shared bomberman-rules.mjs stale/forged axes/sequence tests, ack-on-step, input expiry; pure client prediction returns position only. |
| Immediate local feedback and smooth remote motion | prediction.test.mjs and actual canvas pixel motion under ordered 180–240ms outbound delay/jitter. |
| Focus/settings/touch cleanup | Public server-acknowledged neutral input, focus stop, simultaneous touch movement/bomb and touch cancellation. |
| Recovery and graceful failure | Same-identity local/public recovery passes; real public failure shows expired-room message; recreation verified. Limit disclosed rather than guaranteed continuity. |
| Artwork/animation/fuse/blast/walls/effects | graphics-browser.mjs actual WebGPU pixel assertions, all four animated couriers, bounded elimination effect lifetime. |
| Original music/eight effects/mute/volume/teardown | audio-browser.mjs real WebAudio node/gain automation; mute=1 allocates no context; mode changes close context. |
| Pixel Perfect/DPR/landscape/HUD/WebGPU error | renderer.js, rendering.md; ui-browser.mjs fullscreen/resize/zoom/DPR/error/retry and public narrow-mobile layout. |
| Both repositories and existing games | Scoped server commit 7591707; current typecheck and 67/67 server regressions; 23/23 game checks, clean build and v0.0.4 workflows. |
| README playable link, version and assets | Public test reads online lobby and v0.0.4 footer in independent browsers, completes full loop with no page errors; Pages run 36876680930. |
| Provenance/original prompt/setup/releases/screenshots | README and documentation; preserved earliest prompt, approved later brief, original code-authored art/audio, versioned release links and current screenshot files. |

Tests cover the required behavior at their stated scope. Physical-device checks
and Codex autocomplete UI remain explicitly unverified, as allowed by the brief
and checklist. Network testing models ordered outbound delay/jitter, not every
possible network fault. The accepted in-memory host limit and observed early
recovery failure are limitations, not evidence of durable room continuity.
