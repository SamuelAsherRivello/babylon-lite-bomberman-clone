# Foundation rules

`src/game/rules.js` has no browser or renderer dependency. `createGame(ids, seed)`
creates a 15×13 rotationally symmetric arena, up to four corner players, a clock,
bombs and blasts. Board values are 0 floor, 1 permanent wall, 2 destructible block.
Coordinates use tile units and centered player positions. `stepGame` advances
exactly 1/60 second with per-player x/y/bomb intent. Pause advances nothing.

Each bomb stores its owner, integer tile, range, deadline tick, and player IDs
temporarily allowed to exit its tile. Movement clears that permission after the
player's bounds leave the bomb. Bomb placement is rejected for blocked/occupied
tiles, eliminated players, or exhausted capacity. Fuse is 150 ticks; blasts last
30 ticks. Collision uses a .28-tile half-width and separate-axis movement.

Chain processing visits each bomb once. All rays in one tick use the same board
snapshot, so a block destroyed by one ray still stops another ray in that tick.
All elimination events are accumulated after explosions. Events are transient
per tick; snapshots contain persistent board/player/bomb/blast state. This is
the future authoritative server contract, not a completed networking protocol.

Restart creates a fresh game and must separately clear browser inputs. Rule
fixtures run with `node --test project-name/test/rules.test.mjs` from repo root.
The complete multiplayer delivery requirements remain in the Foundation
OpenSpec delivery brief; local practice is an intermediate milestone.
