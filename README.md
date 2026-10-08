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

- [**Play Bomberman Clone**](https://samuelasherrivello.github.io/babylon-lite-bomberman-clone/) — local practice
- [**Play Online Multiplayer**](https://samuelasherrivello.github.io/babylon-lite-bomberman-clone/?mode=online) — create or join a room

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

Open the URL Vite prints. The application requires a WebGPU-enabled browser and compatible device. A useful error appears if the adapter is unavailable. Build with `npm run build`; serve the production build with `npm run preview`.

### Project structure and coding standards

The repository root owns npm commands, Vite configuration, CI, and OpenSpec. `bomberman-clone/` is the Vite application root; its `src/game`, `src/input`, `src/content`, and `src/ui` folders separate game behavior, controls, media/rendering, and React UI. See the [project structure guide](bomberman-clone/documentation/project-structure.md) for module ownership and placement rules, and the [coding standards](bomberman-clone/documentation/coding-standards.md) for source and verification conventions. Run `npm run format` to format source and tests, then `npm run format:check` to verify them. The shared authoritative server is maintained outside this repository.

### Controls

WASD or arrow keys move; Space places a bomb. On touch devices, swipe in the information panel to move and tap the arena to place a bomb; separate fingers can do both at once. Bombs explode after 2.5 seconds and remain dangerous for 0.5 seconds. You can leave your newly placed bomb but cannot return through it. Destroy brick blocks and escape your own explosions. Settings pauses local practice; Resume continues and Restart resets the arena.

### Online play

Choose **Play online**, create a room and share its six-character code or use **Copy room link**. Friends join, then everyone chooses a color and readies up. One to four connected humans can start, with CPUs filling the four battle seats. Joining humans take over CPU seats, retaining their position, upgrades, life and score; eliminated seats spectate until the next round. Each round winner gains one point; rounds advance automatically, upgrades reset, and the first to three wins the match. All connected humans ready again for a rematch.

Destroyed blocks can reveal bomb-slot, range and speed upgrades after flames clear. Start with one bomb slot and range two; caps are five bombs, range eight and three speed upgrades of 15% each. Later blasts destroy exposed items. In a round's final 30 seconds, tiles warn for one second before inward walls close. Rounds last at most two minutes; simultaneous final eliminations draw without points.

Online settings and focus loss stop your input while the shared battle continues. A disconnected character remains vulnerable, with its seat reserved for 15 seconds. Recovery can preserve identity and score while the same room survives. The accepted five-minute host limit and process resets can end a room; use **Create room** to play again. Local practice works independently of the backend. Settings control original music/effects with mute and volume; add `mute=1` to the URL for forced silent testing. [Audio provenance](bomberman-clone/documentation/audio.md).

The client pins the shared release package and defaults to `https://rmc-colyseus-multiplayer-server.vercel.app`. Set `VITE_MULTIPLAYER_URL` to your server URL before starting Vite to target another deployment; `VITE_MULTIPLAYER_SERVER` remains a compatible alias. This is a public endpoint setting, not a secret. See [multiplayer verification and hosting limits](bomberman-clone/documentation/multiplayer-verification.md).

### Rendering and assets

The viewport uses one 16:9 landscape composition on desktop and mobile, with the arena left of the information panel and four outside gutters where space allows. A phone held in portrait asks the player to rotate it. MAP LOW, MED and HIGH use 15×13, 19×15 and 23×17 tiles, or 240×208, 304×240 and 368×272 authored logical pixels. The complete arena remains visible, with menus and pickup meanings in the information panel. Touch movement uses panel swipes and bomb placement uses arena taps. There is no orientation selector. Native DPR-aware rendering, integer CSS pixels per tile, nearest texture sampling and no mipmaps/MSAA preserve sharp artwork; small slots may display the board at fewer pixels per tile. [Rendering details and asset provenance](bomberman-clone/documentation/rendering.md) and [deterministic rules](bomberman-clone/documentation/game-rules.md) describe the implementation. All current game textures are original code-authored pixel art.

## Battle options and pickups

Choose **CPU: LOW / MED / HARD** and **MAP: LOW / MED / HIGH**. The online host selects gameplay options before a match. Humans replace CPU seats without creating extra fighters or reviving an eliminated seat. A disconnected human retains a vulnerable reserved seat for 15 seconds, then a CPU fills it.

**Plant: ON/OFF** creates one random plant when enabled. It spreads to adjacent available tiles every five seconds; contact kills unless lightning immunity is active. Blast each segment individually to clear it. **Bomb Flash: ON/OFF** is a saved personal checkbox: ON flashes each timed bomb twice during its final half-second.

| Pickup | Meaning |
| --- | --- |
| Bomb | One more active bomb, maximum five |
| Range | Longer cross blast, maximum eight tiles |
| Speed | 15% faster, maximum three upgrades |
| Boxing glove | Push bombs until they hit an obstacle and explode; lasts that life |
| Lightning | Complete invulnerability for ten seconds; flashes faster during the final second |

WASD works with Caps Lock and Shift. Blocked corridors prevent sideways wiggle while preserving forgiving turns. After elimination the scene stays frozen for three seconds so you can see the cause before the prompt; other humans continue playing online.

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

With the application running and Google Chrome installed, `npm run test:browser` exercises independent browser contexts, private rooms, readiness, authoritative elimination, CPU-seat takeover, 180–240ms outbound latency/jitter, pixel-level local movement, remote convergence, full match/rematch, legal pickup/chain, offline recovery and mobile joining. The default application URL is `http://127.0.0.1:5173/babylon-lite-bomberman-clone/`; set `GAME_URL` to use another local or public URL and `BACKEND_URL` only when the application was built for a different backend.

Additional browser checks: `node bomberman-clone/test/graphics-browser.mjs`, `node bomberman-clone/test/audio-browser.mjs`, `node bomberman-clone/test/ui-browser.mjs`, and `node bomberman-clone/test/draw-browser.mjs`. They verify actual WebGPU artwork, synthesized audio and gain controls, viewport/fullscreen/unsupported-browser behavior, and a real-time two-browser sudden-death draw with automatic round progression. Draw verification takes approximately 100 seconds. Use `GAME_URL` for the running application and optionally `EXPECTED_VERSION` for the public full-match release check. Audio automation is verified; physical speaker output is unverified.

Additional feedback checks: `node bomberman-clone/test/cpu-browser.mjs` checks public solo readiness and all human/CPU mixes with authoritative HIGH/HARD/Plant options. `node bomberman-clone/test/feedback-browser.mjs` checks menus, icon meanings, input, corridor movement, preference persistence and death-view delay against Vite (default port 5180). Graphics/feedback fixtures import source modules; use the development server for those commands.

## Credits

- [Super Bomberman](https://en.wikipedia.org/wiki/Super_Bomberman): gameplay inspiration.
- [SNES graphics reference search](https://www.google.com/search?udm=2&q=bomberman+snes+graphics): visual inspiration only.
- [Optional browser-game references](https://itch.io/games/html5/tag-bomberman).
- [Repository template](https://github.com/SamuelAsherRivello/github-repository-template) and [shared skills library](https://github.com/SamuelAsherRivello/ai-skills-library).
- Samuel Asher Rivello — Rivello Multimedia Consulting, LLC.
- [Portfolio](https://www.samuelasherrivello.com/) · [GitHub](https://github.com/SamuelAsherRivello/)

Provided as-is under the [MIT License](LICENSE).
