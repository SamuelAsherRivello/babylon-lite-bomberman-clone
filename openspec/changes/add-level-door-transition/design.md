# Design

## Context

See `proposal.md` and the `level-transitions` spec for the user-facing goal.
The client currently composes `ArenaPlayers` as the arena stage containing the
Babylon Lite canvas and player labels, while the menu/HUD is a sibling
`game-panel`. The renderer receives a complete practice or reconciled online
state every frame and currently draws that state directly.

The transition must therefore separate the state used for gameplay from the
state currently shown by the arena presentation for the short closed-door cut.
The game also needs an explicit midpoint/completion handshake so local
simulation, AI, and input cannot begin under the doors. It remains client-side:
no server protocol or authoritative rule change is needed.

## Goals / Non-Goals

**Goals:**

- Provide one shared `screen-transition` lifecycle for practice and online game-
  world starts.
- Define `screen-door` as the first transition type without making the parent
  controller depend on door-specific rendering.
- Use the shared content animation system for eased progress and property
  interpolation.
- Preserve the previous rendered arena until the doors meet, then replace it
  only after the game acknowledges the midpoint redraw.
- Pause local simulation, AI, and input from transition start through completion.
- Notify the game at the midpoint and completion, with an explicit continue
  acknowledgement between them.
- Keep the doors above the canvas and player labels but bounded to the arena
  stage.
- Preserve nearest-sampled arena presentation, responsive aspect compositions,
  input handling, and existing authoritative timing.

**Non-Goals:**

- Changing authoritative multiplayer state or server simulation.
- Covering the menu/HUD, changing overlay behavior, or adding an orientation
  control.
- Adding a renderer dependency, server message, sound effect, or persistent
  preference.

## Decisions

### Generic screen-transition controller

Rename the client-side controller to `screen-transition` and make its parent
contract describe a game-world presentation handoff rather than an arena door.
It tracks the current level identity, phase start time, old/new presentation
snapshots, and a transition `type`. The initial type is `screen-door`; future
types may use different visual properties while sharing the lifecycle and
midpoint handshake.

This is preferred over independent CSS-only animation because CSS alone cannot
hold the old renderer state until the exact midpoint or coordinate the game
handshake. It is also preferred over changing the game rules because the
authoritative multiplayer protocol remains unchanged.

### Round identity as the trigger

Use the existing practice restart/new-game lifecycle and online round identity
as transition keys. A new key starts one transition; repeated renders of the
same key do not restart it. The initial arena presentation is treated as the
first level event so the first playable level also receives the reveal.

### Screen-door presentation

Render the `screen-door` type as two absolutely positioned elements inside the
existing arena stage,
with each element half the stage width and full stage height. Each door uses
the supplied `public/assets/door-half.png` artwork; the right door mirrors that
artwork horizontally. Their transforms move the left element from
`translateX(-100%)` to the left half and back out, and the right element
symmetrically from the right. The stage establishes the clipping boundary; the
doors use a z-index above the canvas and player labels, and `pointer-events:
none` so input behavior remains unchanged.

This preserves crisp Babylon rendering and makes the coverage boundary follow
the existing responsive arena size in both aspect compositions. A viewport-
wide overlay is rejected because it would cover the adjacent menu panel.

### Animation-system easing

Use the shared `content/systems/animation-system.js` with a monotonic animation
timestamp/`requestAnimationFrame` progression. Closing uses `easeOutQuad`, so
the door starts at normal speed and decelerates into the center. Opening uses
the reverse direction with the same curve, so it starts slowly, accelerates
quickly, and settles into a long near-constant end movement. The controller
remains the source of truth for phase boundaries at 0.5 and 0.7 seconds,
midpoint callback, graphics cut, resume gate, and completion callback; CSS no
longer owns the movement timing.

### Game handshake and local pause

The controller exposes `onMiddle`, `continue`, `onDone`, and a blocking state.
When the close duration elapses it enters `closed`, calls `onMiddle`, and holds
the old presentation until the game performs its level reset/redraw and calls
`continue`. The controller changes the displayed snapshot at that acknowledgement,
waits until the 0.2-second hold has elapsed, and opens the doors. The mode loop
does not advance simulation, CPU decisions, or input/network intent while the
controller is blocking; `onDone` releases that gate.

## Risks / Trade-offs

- [Online snapshot arrives while a transition is already running] -> Keep the
  newest pending level snapshot and apply it when the game acknowledges the
  midpoint; never restart the same round's animation.
- [A component remount or renderer restart leaves doors stuck] -> Reset and
  dispose the controller with the owning arena lifecycle, and test remount and
  renderer recovery paths.
- [Fractional responsive arena sizes expose a seam at the center] -> Make the
  doors overlap by a small CSS pixel-safe amount at the closed state and verify
  both portrait and landscape screenshots.
- [The doors visually cover labels that players use for orientation] -> This is
  intentional during the 1.2-second transition; keep labels unchanged and
  restore them automatically when the doors open.

## Migration Plan

No data or server migration is required. Implement the shared presentation
controller, integrate it into practice and online starts, add visual/timing
checks, then run the existing unit, build, and browser verification commands.
Rollback consists of removing the controller and arena door layer; gameplay
state and network protocol remain compatible.
