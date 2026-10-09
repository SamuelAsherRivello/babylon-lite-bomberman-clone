# Arena and multiplayer rules

`src/game/rules.js` has no browser or renderer dependency. `createGame(ids, seed, mapSize, plantEnabled, chainReaction)`
creates a selected 15×13, 19×15 or 23×17 arena mirrored across both axes, up to four corner players, a clock,
bombs and blasts. Board values are 0 floor, 1 permanent wall, 2 destructible block.
Coordinates use tile units and centered player positions. `stepGame` advances
exactly 1/60 second with per-player x/y/bomb intent. Pause advances nothing.

Each bomb stores its owner, integer tile, range, deadline tick, and player IDs
temporarily allowed to exit its tile. Movement clears that permission after the
player's bounds leave the bomb. The owner always has this initial passage; bomb
contact does not eliminate players before detonation. Bomb placement is rejected
for blocked/occupied tiles, eliminated players, or exhausted capacity. Fuse is 150 ticks; blasts last
30 ticks. Collision uses a .28-tile half-width and separate-axis movement.

Chain processing visits each bomb once. All rays in one tick use the same board
snapshot, so a block destroyed by one ray still stops another ray in that tick.
Chain Reaction is off by default. When two or more bombs detonate in one tick,
all of those bombs trace their row and column to the arena edge, stopping at
permanent walls, blocks, and plants as usual. An extended ray can trigger more
bombs, which join that tick's extended chain. A lone bomb keeps its normal range.
All elimination events are accumulated after explosions. Events are transient
per tick; snapshots contain persistent board/player/bomb/blast state. This is
the same authoritative rules maintained in the shared Colyseus server source. The
pinned 0.9.7 client package predates the harmless-plant and Chain Reaction rules;
online authority changes when the updated server is released and deployed.

Hidden bomb-slot, range and speed items are distributed in mirrored groups.
The first three eligible block groups guarantee all three item types. Destroyed
blocks reveal their item only after all overlapping blasts clear; later blasts
destroy exposed items. Only living players collect. Capacity caps at five,
range at eight, and speed at three upgrades of 15% of base speed (3 tiles/second).
The server omits hidden item locations and future wall schedules from snapshots.

Sudden death starts warnings at tick 5400 (90 seconds). Mirrored groups close
after 60 ticks of warning, with size-dependent group intervals that complete the inward pattern before timeout.
Closure destroys covered bombs/items, clips blasts and eliminates touching
players together; closed tiles are permanently solid. The round ends with a
unique survivor or at two minutes. Simultaneous final eliminations and
multiple survivors at timeout draw without a score.

The server runs fixed 60Hz simulation steps accumulated from monotonic elapsed
time, broadcasting complete state at 20Hz. One to four connected humans ready; CPUs fill the remaining four battle seats
in the lobby, followed by a three-second countdown. A round winner gets one
point; three-second score breaks and countdowns automatically lead to the next
round. Arena and upgrades reset, scores remain. First to three ends the match;
all connected players must ready a rematch to reset scores and input history.
Joining humans take over CPU seats with existing position, life and score; eliminated seats immediately spectate the live room until the next round. Local practice retains its three-second death view. Fifteen-second seat recovery can
retain identity while the same room survives; hosting resets are a separate limit.

Restart creates a fresh game and must separately clear browser inputs. Rule
fixtures run with `node --test bomberman-clone/test/rules.test.mjs` from repo root.
The original multiplayer delivery requirements remain in the Foundation
OpenSpec delivery brief. Both practice and online play now include four combatants and the feedback features below.

## Controls

On PC, hold WASD or the arrow keys to move and press Space to place a bomb.
On mobile, tap anywhere on the rendered arena to place a bomb. Swipe in any
direction within the information panel to move; the player keeps moving in
that direction until the finger is released. A stationary tap on a panel
control still activates that control. Separate fingers can swipe in the panel
and tap the arena at the same time. Releasing, cancelling, hiding the page, or
switching away clears held movement.


Rare glove pickup grants bomb pushing until death. Sliding bombs move six tiles/second until a blocking wall, block, bomb or plant, then explode; sliding suspends their stationary fuse while preserving chain detonation and ownership capacity. Lightning grants 600 simulation ticks of immunity to blasts and closing walls and refreshes on recollection. Immune actors can exit an already-overlapping closing wall; they cannot enter other walls and are vulnerable on expiration. Plant ON guarantees one valid starting segment, advances a cardinal frontier every 300 ticks, excludes walls/blocks/bombs/active blasts/player-occupied cells, and consumes exposed items. Plants block player movement like walls without eliminating players, even when lightning is inactive. Each blast ray cuts its first plant segment and stops. Destroyed plants do not respawn that round.
