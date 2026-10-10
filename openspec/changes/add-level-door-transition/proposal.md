# Proposal

## Why

Level and round changes currently use a concrete arena-door implementation.
Generalizing that implementation into a screen-transition system will let the
game add other world-screen transitions without coupling the lifecycle
controller to one visual effect. The first screen-transition type will retain
the arcade door presentation while gaining eased movement.

## What Changes

- Generalize the controller to a `screen-transition` parent owned by the game
  world, with a `screen-door` visual type as its first implementation.
- Keep the two grey door panels using the supplied `door-half.png` artwork,
  covering the game-world square from the left and right with the right panel
  mirrored.
- Drive close/open motion through the shared animation system: closing starts
  at normal speed and decelerates at the end; opening is the reverse, starting
  slowly, accelerating quickly, then flattening into a long plateau.
- Slide the doors closed over 0.5 seconds, hold them closed for 0.2 seconds,
  and slide them open over 0.5 seconds.
- Keep the previous level visible while the doors close, then reset or set the
  new level graphics exactly when the doors meet in the center.
- Pause level activity during the transition; notify the game at the closed
  midpoint, wait for the game to redraw/reset the level and explicitly resume
  the transition, then notify the game when the doors finish opening.
- Render the screen transition above the arena canvas and player text labels,
  but never over the menu/HUD panel outside the game-world square.
- Trigger the transition at the start of each new practice level/restart and
  each online round/level start.
- Preserve responsive landscape and portrait compositions, pixel presentation,
  input behavior, and authoritative multiplayer state.

## Capabilities

### New Capabilities

- `level-transitions`: Arena-only visual transitions that cover the old level,
  perform the closed-door level-graphics cut, and reveal the new level.

### Modified Capabilities

- None.

## Impact

- Affected client presentation code around `ArenaPlayers`, the shared arena
  renderer, and practice/online round lifecycle integration.
- Affected arena styles and browser checks for z-order, timing, responsive
  sizing, and the boundary between the game-world square and menu panel.
- No new dependency, server API, or persistent data is required; the client
  presentation handshake temporarily gates local simulation, AI, and input.
