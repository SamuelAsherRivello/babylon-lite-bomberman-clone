![Samuel Asher Rivello](bomberman-clone/documentation/samuel-asher-rivello-banner.png)

# Bomberman Clone

An original SNES-inspired 2D bomb arena built with Babylon Lite and authoritative competitive Colyseus multiplayer.

## Original AI Prompt

<details>
<summary>Read the full original prompt (edited for grammar, punctuation, spelling, and formatting)</summary>

```text
$ai-skills-create-game

- Title: [Bomberman Clone]
- Type: [2D online competitive multiplayer, inspired by SNES-era Super Bomberman. Use Colyseus. Each player competes individually; the last survivor wins the round. Support online matches and local practice against CPUs.]

- World and camera:
  - [Show the complete, single-screen arena with a fixed top-down camera.]
  - [Use a tile-based grid with solid outer walls, indestructible pillars, destructible blocks, and distinct player starting areas.]
  - [Use a landscape 16:9 play area and keep the arena visible on desktop, mobile, and fullscreen.]
  - [Offer LOW, MED, and HIGH arena sizes: 15×13, 19×15, and 23×17 tiles.]
  - [Use crisp pixel-art rendering and preserve the grid’s readability as the viewport resizes.]

- Core loop:
  - [Move through the arena, place timed bombs, escape their blast paths, destroy blocks, collect power-ups, and try to trap opponents.]
  - [Bombs explode in horizontal and vertical lines. Blasts can trigger other bombs, creating chain reactions.]
  - [A bomb’s flame can eliminate any player it touches, including its owner.]
  - [The last surviving player wins the round. Award no round win if all remaining players are eliminated simultaneously.]
  - [Play first to three round wins to decide the match. Start a fresh rematch with scores and temporary upgrades reset.]
  - [Each round lasts two minutes. At 90 seconds, begin sudden death by dropping indestructible walls around the arena, progressively reducing the safe space.]

- Controls:
  - [Move with WASD or the arrow keys. Support Caps Lock and Shift with WASD.]
  - [Press Space to place a bomb.]
  - [Provide touch controls with a directional pad and bomb button. Allow movement and bomb placement at the same time.]
  - [Clear held inputs on focus loss, settings changes, or cancelled touch input.]
  - [Keep controls responsive and prevent menus from intercepting gameplay keys.]

- Multiplayer mechanics:
  - [Create or join a room using a shareable room code or link.]
  - [Support up to four fighter seats. Humans compete individually; CPU fighters fill unoccupied seats.]
  - [Allow the room host to select CPU difficulty and arena size before starting.]
  - [Provide ready states and a short countdown before each round.]
  - [Eliminated players spectate until the next round.]
  - [After the match, show round scores and let players ready up for a rematch.]
  - [In online mode, neutralize a player’s input while they use settings or when their browser loses focus.]
  - [Handle disconnects and reconnects gracefully. Reserve a disconnected player’s seat for 15 seconds; let a CPU take over if they do not return.]
  - [Clearly explain when a room has expired or cannot be recovered, and let players create a new room.]

- Look and feel:
  - [Create original, colorful pixel art inspired by the playful readability of SNES-era Super Bomberman.]
  - [Draw original characters, bombs, blocks, pickups, arena tiles, and blast effects. Use distinct player colors and walking animations.]
  - [Make solid walls, destructible blocks, bomb fuses, blast paths, pickups, and sudden-death walls easy to tell apart.]
  - [Show player status, round wins, remaining round time, pickup meanings, and rematch or retry options without obscuring the arena.]
  - [Include original arcade-style music and sound effects, plus in-game mute and volume controls.]
  - [Support a documented URL argument that silences all sound for automated testing.]

- Gameplay requirements:
  - [Include Bomb, Range, Speed, Boxing Glove, and Lightning pickups.]
  - [Bomb increases active bomb capacity, up to five.]
  - [Range extends bomb blast reach, up to eight tiles.]
  - [Speed increases movement speed, up to three upgrades.]
  - [Boxing Glove lets the player push bombs until they hit an obstacle and explode; the effect lasts for that life.]
  - [Lightning grants ten seconds of invulnerability and visibly warns as it nears expiration.]
  - [Support optional spreading plants as an arena hazard. Plants spread to adjacent available tiles and can be cleared one segment at a time by bomb blasts.]
  - [Support optional bomb-fuse flashing as a personal setting.]
  - [After elimination, keep the scene visible briefly so the player can see what happened before showing retry or room options.]
  - [Provide CPU difficulty settings and predictable restart and rematch flows.]

- Multiplayer server and smoothness:
  - [Use https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server.]
  - [Implement the required Bomberman room logic and synchronized game state in the shared Colyseus server and client.]
  - [Make the server authoritative for arena state, movement validation, bomb placement and fuses, explosions, chain reactions, pickups, eliminations, scoring, sudden death, and round progression.]
  - [Make local movement respond immediately; reconcile it smoothly with server state.]
  - [Interpolate remote players and animate local actions promptly while server results are pending.]
  - [Use deterministic or bandwidth-efficient synchronization where practical.]
  - [Handle latency, jitter, disconnects, reconnects, room capacity, invalid codes, and expired rooms with clear behavior.]
  - [Verify complete matches and rematches with at least two browser clients. Add simulated latency and jitter and check movement, remote convergence, shared outcomes, pickups, chain reactions, reconnection, and touch controls.]

- Inspiration links:
  - [Gameplay inspiration: https://en.wikipedia.org/wiki/Super_Bomberman]
  - [Supplementary Bomberman reference: https://bomberman.fandom.com/wiki/Super_Bomberman]

- Inspiration screenshots: [None supplied.]

- Originality requirement:
  - [Make an original Bomberman-inspired game. Use the references for gameplay context and broad visual direction; create original artwork, characters, arena layouts, music, sound effects, and UI. Do not copy game assets.]

```


</details>

## Live Demo

- [**Play Online Multiplayer**](https://samuelasherrivello.github.io/babylon-lite-bomberman-clone/) — default entry; create or join a room
- [**Play Local Practice**](https://samuelasherrivello.github.io/babylon-lite-bomberman-clone/?mode=offline) — play against CPUs without a backend

## Images

<img src="https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone/blob/main/bomberman-clone/documentation/multiplayer-draw.png"/>

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project structure and coding standards](#project-structure-and-coding-standards)
3. [Verification](#verification)
4. [Credits](#credits)


## Getting Started

Use Node 24 or newer and npm, from the repository root:

```sh
npm ci
npm run format:check
npm test
npm run dev
```

`npm run dev` prepares an ignored local checkout of multiplayer-server tag `v0.9.7` on first use, installs its dependencies, then starts the local play server on port 2567, the separate AI test server on port 2568, and Vite on port 5173. It reuses the prepared checkout on later runs and stops all three processes together. The adjacent multiplayer-server checkout is not modified. Both backend ports must be free. Use `npm run dev:vite` when the backend is already running or you only need the frontend.

Open the URL Vite prints. The application requires a WebGPU-enabled browser and compatible device. A useful error appears if the adapter is unavailable. Build with `npm run build`; serve the production build with `npm run preview`.

### Project structure and coding standards

The repository root owns npm commands, Vite configuration, CI, and OpenSpec. `bomberman-clone/` is the Vite application root; its `src/game`, `src/input`, `src/content`, and `src/ui` folders separate game behavior, controls, media/rendering, and React UI. See the [project structure guide](bomberman-clone/documentation/project-structure.md) for module ownership and placement rules, and the [coding standards](bomberman-clone/documentation/coding-standards.md) for source and verification conventions. Run `npm run format` to format source and tests, then `npm run format:check` to verify them. The shared authoritative server is maintained outside this repository.

### Controls

WASD or arrow keys move; Space places a bomb. On touch devices, swipe in the information panel to move and tap the arena to place a bomb; separate fingers can do both at once. Bombs explode after 2.5 seconds and remain dangerous for 0.5 seconds. You can leave your newly placed bomb but cannot return through it. Destroy brick blocks and escape your own explosions. Settings pauses local practice; Resume continues and Restart resets the arena.

The upper-right controls show the current **Mode: Online/Offline** and **Aspect: Landscape/Portrait**. Press either button to switch. **GitHub ↗** opens this repository and uses the same button styling. Landscape is a 16:9 viewport with the arena beside the information panel; portrait is a 9:16 viewport with the arena above it. A fine primary pointer starts in landscape and a coarse primary pointer starts in portrait. An aspect choice lasts across mode changes until the page is reloaded.

### Online play

The game opens in online mode when the URL has no `mode` argument. `mode=online` and room invitation links also open online mode; `mode=offline` opens local practice directly. From either mode, press the Mode button to switch. In online mode, create a room and share its six-character code or use **Copy room link**. Friends join, then everyone chooses a color and readies up. One to four connected humans can start, with CPUs filling the four battle seats. Joining humans take over CPU seats, retaining their position, upgrades, life and score; if that seat has already been eliminated, the panel tells them they are waiting to join the next round. Eliminated seats spectate until the next round. Each round winner gains one point; rounds advance automatically, upgrades reset, and the first to three wins the match. All connected humans ready again for a rematch.

Destroyed blocks can reveal bomb-slot, range and speed upgrades after flames clear. Start with one bomb slot and range two; caps are five bombs, range eight and three speed upgrades of 15% each. Later blasts destroy exposed items. In a round's final 30 seconds, tiles warn for one second before inward walls close. Rounds last at most two minutes; simultaneous final eliminations draw without points.

Online settings and focus loss stop your input while the shared battle continues. A disconnected character remains vulnerable, with its seat reserved for 15 seconds. Recovery can preserve identity and score while the same room survives. The accepted five-minute host limit and process resets can end a room; use **Create room** to play again. Local practice works independently of the backend. Settings control original music/effects with mute and volume; add `mute=1` to the URL for forced silent testing. [Audio provenance](bomberman-clone/documentation/audio.md).

The pinned client defaults to `VITE_LOCAL` (`http://127.0.0.1:2567`) in local Vite and `VERCEL_ONLINE` (`https://rmc-colyseus-multiplayer-server.vercel.app`) in a production build. `serverTest=true` selects the independent local server on port 2568 with `VITE_LOCAL`. `VERCEL_ONLINE&serverTest=true` requires a separate test deployment set through `VITE_MULTIPLAYER_TEST_URL` at build time; without it, the client refuses to connect. The adjacent server's current development branch uses four-character room codes and is not compatible with this client's six-character rooms. `npm run dev` uses the compatible `v0.9.7` release. `VITE_MULTIPLAYER_URL` can set another build default; `VITE_MULTIPLAYER_SERVER` remains a compatible alias.

Any player can select `?server=VITE_LOCAL`, `?server=VERCEL_ONLINE`, or a full HTTP(S) URL for one visit. Add `&serverTest=true` to a named preset for its separate test backend. Invalid combinations show an error and prevent connecting. **Copy room link** carries the server selection and test flag, but keeps the current frontend address. For a Vite player joining a GitHub Pages player, or two different Vite addresses, share the room code separately and have each player open their own frontend. The server URL is public connection information, not a secret. All players in a room must use the same backend; matching room codes on different backends are different rooms. A friend cannot reach your `127.0.0.1` server, and a GitHub Pages client needs a network-reachable HTTPS backend. Examples:

| Play setup | Server selection |
| --- | --- |
| Local Vite against local Vite on one computer | Both default to `VITE_LOCAL` on port 2567. |
| AI browser test against local Vite | Use `?server=VITE_LOCAL&serverTest=true` or set `BACKEND_URL=http://127.0.0.1:2568` for the named browser scripts. |
| Local Vite against GitHub Pages | Open local Vite with `?server=VERCEL_ONLINE`; Pages already defaults to that server. |
| Two Vite clients on different computers | Give both clients `?server=` with the same reachable test server URL, then share the room link. |

See [multiplayer verification and hosting limits](bomberman-clone/documentation/multiplayer-verification.md).

### Rendering and assets

Four labels straddle the rendered board's top and bottom wall edges at the spawn corners. They show each corner's player sprite, name, and Human or CPU status. Online labels follow the room's current seats.

The viewport starts in a 16:9 landscape composition for fine-pointer PC browsers and a 9:16 stacked composition for coarse-pointer mobile browsers, including when a phone is held sideways. In either composition, the arena takes the largest square that fits while reserving usable space for the information panel. Four outside gutters remain where space allows. MAP LOW, MED and HIGH use 15×13, 19×15 and 23×17 tiles, or 240×208, 304×240 and 368×272 authored logical pixels. The rendered board fills that square as far as its tile grid and integer pixel scale permit. Touch movement uses panel swipes and bomb placement uses arena taps. Native DPR-aware rendering, integer CSS pixels per tile, nearest texture sampling and no mipmaps/MSAA preserve sharp artwork; small slots may display the board at fewer pixels per tile. [Rendering details and asset provenance](bomberman-clone/documentation/rendering.md) and [deterministic rules](bomberman-clone/documentation/game-rules.md) describe the implementation. All current game textures are original code-authored pixel art.

## Battle options and pickups

Choose **CPU: LOW / MED / HARD** and **MAP: LOW / MED / HIGH**. The online host selects gameplay options before a match. Humans replace CPU seats without creating extra fighters or reviving an eliminated seat. A disconnected human retains a vulnerable reserved seat for 15 seconds, then a CPU fills it.

**Creeping Death: ON/OFF** creates one random plant when enabled. It spreads to adjacent available tiles every five seconds, blocks movement like a wall, and does not hurt players. Growth skips tiles occupied by players. Blast each segment individually to clear it. **Chain Reaction: ON/OFF** is off by default. When two or more bombs explode together, each blast extends along its full row and column until blocked by a wall, block, or plant; the longer blasts can trigger more bombs in the same tick. CPU, map, Creeping Death, Chain Reaction, and **Bomb Flash: ON/OFF** choices are saved in local storage; Bomb Flash ON flashes each timed bomb twice during its final half-second. The settings menu in either mode has **Clear Local Storage**, which removes saved choices and restores their defaults. Online room options remain shared and controlled by the host until changed in that room. The online Chain Reaction control appears when the connected server supports it.

| Pickup | Meaning |
| --- | --- |
| Bomb | One more active bomb, maximum five |
| Range | Longer cross blast, maximum eight tiles |
| Speed | 15% faster, maximum three upgrades |
| Boxing glove | Push bombs until they hit an obstacle and explode; lasts that life |
| Lightning | Complete invulnerability for ten seconds; flashes faster during the final second |

WASD works with Caps Lock and Shift. Blocked corridors prevent sideways wiggle while preserving forgiving turns. In local practice, the scene holds for three seconds after elimination. Online elimination switches immediately to the live room view so you can spectate the remaining players.

## OpenSpec milestones

1. Foundation: local arena, controls, rules and 2DPixelPerfect presentation.
2. Multiplayer Setup: authoritative Colyseus rooms, ready states, synchronization, reconnection and deployed two-client verification.
3. Gameplay Polish: power-ups, scoring, sudden death, spectator/rematch flows, original audio/effects and final public release.

Explore → propose → apply → verify → sync specifications → archive → scoped commit and push. Each milestone must pass before the next proposal. The follow-up [Game Feedback 1 change](openspec/changes/archive/2026-10-02-add-game-feedback-1/) is complete and synced into [accepted specifications](openspec/specs/). See [change history](openspec/changes/archive/) and the [complete delivery contract](openspec/changes/archive/2026-10-01-foundation/delivery-brief.md). Generated repository-local skills are in `.agents/skills/`; their version matches OpenSpec 1.14.0. Reopen Codex if skill autocomplete has not refreshed.

## Final delivery target

The play links above open the live game without installation or credentials. The online link goes straight to room creation and joining. Two independent public browsers previously verified a first-to-three match and fresh rematch, public assets, endpoint connectivity, controls, and scoring.

Client release uses the existing Release GitHub Actions workflow and `version.txt`. After the release completes, manually run **Deploy live demo** on `main`: the workflow's version push does not trigger another GitHub Actions workflow. Pages deploys `bomberman-clone/dist/` under `/babylon-lite-bomberman-clone/`. See the [latest game release](https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone/releases/latest) and [pinned shared client v0.9.7](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/releases/tag/v0.9.7).

## Verification

Automated tests cover arena symmetry and map sizes, upgrades and caps, glove pushing, lightning immunity, plant growth/cutting, CPU decisions, corridor collision, bomb capacity/fuse, owner passage, chains, sudden death, deterministic outcomes, pause/restart, death-view timing, case-insensitive input, scaling, prediction, reconciliation, remote interpolation and rejected cosmetic bombs. Chrome WebGPU checks exercise presentation, keyboard movement/bomb escape, elimination, restart, pause/resume, fullscreen, zoom, unsupported-WebGPU recovery, and emulated mobile multitouch/cancellation. Physical touch hardware is unverified.

With the application running and Google Chrome installed, set `BACKEND_URL` to a separate test server before `npm run test:browser`. The script uses that backend for every browser and helper client, overriding the application's build default with `?server=`. It exercises independent browser contexts, private rooms, readiness, authoritative elimination, CPU-seat takeover, 180–240ms outbound latency/jitter, pixel-level local movement, remote convergence, full match/rematch, legal pickup/chain, offline recovery and mobile joining. The default application URL is `http://127.0.0.1:5173/babylon-lite-bomberman-clone/`; set `GAME_URL` to use another local or public URL. With `npm run dev` running, use this PowerShell command in another terminal: `$env:BACKEND_URL = 'http://127.0.0.1:2568'; npm run test:browser`. Browser scripts refuse the public backend and local play port 2567 unless `ALLOW_LIVE_TEST=1` is also set intentionally.

Additional browser checks: `npm run test:spectator-browser`, `node bomberman-clone/test/graphics-browser.mjs`, `node bomberman-clone/test/audio-browser.mjs`, `node bomberman-clone/test/ui-browser.mjs`, and `node bomberman-clone/test/draw-browser.mjs`. They verify immediate live spectating after online elimination, actual WebGPU artwork, synthesized audio and gain controls, viewport/fullscreen/unsupported-browser behavior, and a real-time two-browser sudden-death draw with automatic round progression. Draw verification takes approximately 100 seconds. Spectator and draw checks also require `BACKEND_URL`; CPU admission checks require it too. Use `GAME_URL` for the running application and optionally `EXPECTED_VERSION` for the public full-match release check. Audio automation is verified; physical speaker output is unverified.

Additional feedback checks: `node bomberman-clone/test/cpu-browser.mjs` checks solo readiness and all human/CPU mixes with authoritative HIGH/HARD/Creeping Death options. `node bomberman-clone/test/feedback-browser.mjs` checks menus, icon meanings, input, corridor movement, preference persistence and death-view delay against Vite (default port 5180). Graphics/feedback fixtures import source modules; use the development server for those commands.

## Credits

- [Super Bomberman](https://en.wikipedia.org/wiki/Super_Bomberman): gameplay inspiration.
- [SNES graphics reference search](https://www.google.com/search?udm=2&q=bomberman+snes+graphics): visual inspiration only.
- [Optional browser-game references](https://itch.io/games/html5/tag-bomberman).
- [Repository template](https://github.com/SamuelAsherRivello/github-repository-template) and [shared skills library](https://github.com/SamuelAsherRivello/ai-skills-library).
- Samuel Asher Rivello — Rivello Multimedia Consulting, LLC.
- [Portfolio](https://www.samuelasherrivello.com/) · [GitHub](https://github.com/SamuelAsherRivello/)

Provided as-is under the [MIT License](LICENSE).
