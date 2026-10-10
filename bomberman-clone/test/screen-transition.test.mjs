import test from 'node:test';
import assert from 'node:assert/strict';
import { SCREEN_TRANSITION, createScreenTransition } from '../src/ui/screen-transition.js';
import { createWorldChangeQueue } from '../src/game/world-change-queue.js';

test('holds the previous game world until the screen doors are fully closed', () => {
  const transition = createScreenTransition();
  const first = { round: 1, board: ['old'] };
  const next = { round: 2, board: ['new'] };

  transition.ensure(1, first, 0);
  assert.deepEqual(transition.present(first), first);
  transition.tick(SCREEN_TRANSITION.close);
  transition.continue();
  transition.tick(SCREEN_TRANSITION.close + SCREEN_TRANSITION.hold);
  transition.tick(SCREEN_TRANSITION.total);
  transition.ensure(2, next, 2);
  transition.tick(2 + SCREEN_TRANSITION.close);
  assert.deepEqual(transition.present(next), first);
  transition.continue();
  transition.tick(2 + SCREEN_TRANSITION.close + SCREEN_TRANSITION.hold);
  assert.deepEqual(transition.present(next), next);
});

test('does not restart for repeated renders of one level key', () => {
  const transition = createScreenTransition();
  const first = { round: 1 };
  const updated = { round: 1, tick: 20 };

  transition.ensure(1, first, 10);
  transition.ensure(1, updated, 10.49);
  assert.deepEqual(transition.present(updated), first);
  transition.tick(10.5);
  transition.continue();
  transition.tick(10.7);
  transition.tick(11.2);
  assert.deepEqual(transition.present(updated), updated);
});

test('publishes eased close and reverse open progress', () => {
  const transition = createScreenTransition({ parent: 'game-world', type: 'screen-door' });
  transition.ensure(1, { round: 1 }, 0);
  transition.tick(0.25);
  assert.equal(transition.state.type, 'screen-door');
  assert.equal(transition.state.parent, 'game-world');
  assert.equal(transition.state.progress, 0.5);
  assert.equal(transition.state.easedProgress, 0.75);
  transition.tick(0.5);
  transition.continue();
  transition.tick(0.7);
  transition.tick(0.95);
  assert.equal(transition.state.phase, 'opening');
  assert.equal(transition.state.progress, 0.5);
  assert.equal(transition.state.easedProgress, 0.25);
});

test('waits for the game to continue after the middle callback', () => {
  const transition = createScreenTransition();
  const first = { round: 1 };
  const next = { round: 2, board: ['new'] };
  const latest = { round: 2, board: ['new', 'updated'] };
  let middle = 0;

  transition.ensure(1, first, 0);
  transition.tick(0.5);
  transition.continue();
  transition.tick(0.7);
  transition.tick(1.2);
  transition.ensure(2, next, 2, { onMiddle: () => middle++ });
  transition.tick(2.5);
  transition.ensure(2, latest, 2.6);
  assert.equal(middle, 1);
  assert.equal(transition.isBlocking(), true);
  assert.deepEqual(transition.present(latest), first);
  transition.continue();
  transition.tick(2.7);
  transition.tick(3.2);
  assert.equal(transition.isBlocking(), false);
  assert.deepEqual(transition.present(latest), latest);
});

test('swaps the world at the midpoint and reports completion after opening', () => {
  const transition = createScreenTransition();
  const first = { round: 1 };
  const next = { round: 2 };
  let swapped = 0;
  let completed = 0;

  transition.ensure(1, first, 0);
  transition.tick(SCREEN_TRANSITION.total);
  transition.ensure(2, first, 2, {
    onSwap: () => {
      swapped += 1;
      return next;
    },
    onMiddle: () => transition.continue(),
    onDone: () => {
      completed += 1;
    },
  });
  transition.tick(2 + SCREEN_TRANSITION.close);

  assert.equal(swapped, 1);
  assert.equal(completed, 0);
  assert.deepEqual(transition.present(next), next);

  transition.tick(2 + SCREEN_TRANSITION.close + SCREEN_TRANSITION.hold);
  transition.tick(2 + SCREEN_TRANSITION.total);
  assert.equal(completed, 1);
  assert.equal(transition.isBlocking(), false);
});

test('queues a world change before the transition consumes it', () => {
  const changes = createWorldChangeQueue();
  const id = changes.request({ type: 'reset-world', options: { map: 'HIGH' } });

  assert.equal(changes.peek().id, id);
  assert.equal(changes.peek().type, 'reset-world');
  assert.equal(changes.consume(id).options.map, 'HIGH');
  assert.equal(changes.peek(), null);
});
