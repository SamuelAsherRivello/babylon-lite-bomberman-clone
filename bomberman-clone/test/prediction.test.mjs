import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '@rmc/multiplayer-client/bomberman';
import { predictMovement, ReconciledView } from '../src/game/prediction.js';
test('prediction responds immediately and does not mutate authoritative outcomes', () => {
  const state = { ...createGame(['a', 'b']), phase: 'playing', round: 1 };
  const original = structuredClone(state);
  const player = predictMovement(state, 'a', { x: 1, y: 0 });
  assert.ok(player.x > state.players[0].x);
  assert.deepEqual(state, original);
});

test('authoritative speed upgrades predict immediately while closed walls and pickup authority stay intact', () => {
  const state = { ...createGame(['a', 'b']), phase: 'playing', round: 1 };
  const base = predictMovement(state, 'a', { x: 1, y: 0 });
  state.players[0].speed = 4.35;
  state.players[0].speedLevel = 3;
  state.powerups = [{ cell: 16, type: 'bomb' }];
  const original = structuredClone(state);
  const fast = predictMovement(state, 'a', { x: 1, y: 0 });
  assert.ok(Math.abs((fast.x - state.players[0].x) / (base.x - state.players[0].x) - 1.45) < 1e-9);
  assert.deepEqual(state, original, 'prediction cannot grant an unconfirmed pickup');
  state.board[17] = 1;
  state.players[0].x = 1.72;
  assert.equal(
    predictMovement(state, 'a', { x: 1, y: 0 }).x,
    1.72,
    'closed sudden-death walls constrain prediction',
  );
});
test('cosmetic bomb feedback clears on rejection acknowledgement and round reset', () => {
  const state = { ...createGame(['a', 'b']), phase: 'playing', round: 1 };
  state.players[0].ack = -1;
  const view = new ReconciledView();
  view.accept(state, 'a');
  view.advance('a', { x: 0, y: 0, bomb: true }, 1);
  assert.equal(view.draw('a', 1 / 60).pendingBombs.length, 1);
  assert.equal(state.bombs.length, 0);
  const rejected = structuredClone(state);
  rejected.players[0].ack = 1;
  view.accept(rejected, 'a');
  assert.equal(view.draw('a', 1 / 60).pendingBombs.length, 0);
  view.advance('a', { x: 0, y: 0, bomb: true }, 2);
  view.accept({ ...rejected, round: 2 }, 'a');
  assert.equal(view.pending.length, 0);
  assert.equal(view.ghosts.length, 0);
});
test('view reconciles acknowledged input and smooths remote movement', () => {
  const state = { ...createGame(['a', 'b']), phase: 'playing', round: 1 };
  state.players[0].ack = -1;
  let now = 0;
  const view = new ReconciledView(() => now);
  view.accept(state, 'a');
  view.advance('a', { x: 1, y: 0 }, 1);
  assert.equal(view.pending.length, 1);
  const target = structuredClone(state);
  target.players[0].ack = 1;
  target.players[0].x += 0.05;
  view.accept(target, 'a');
  assert.equal(view.pending.length, 0);
  view.draw('a', 1 / 60);
  now = 0.05;
  target.players[1].x -= 1;
  view.accept(target, 'a');
  const displayed = view.draw('a', 1 / 60);
  assert.ok(displayed.players[1].x > target.players[1].x);
});

test('buffered remote motion stays uniform under uneven snapshot arrival', () => {
  let now = 0;
  const view = new ReconciledView(() => now);
  const base = { ...createGame(['a', 'b']), phase: 'playing', round: 1 };
  const packets = Array.from({ length: 31 }, (_, i) => ({
    tick: i * 3,
    arrival: i * 0.05 + [0.02, 0.055, 0.03, 0.045][i % 4],
  }));
  let previous;
  const strides = [];
  for (let frame = 0; frame < 90; frame++) {
    now = frame / 60;
    while (packets.length && packets[0].arrival <= now) {
      const packet = packets.shift(),
        state = structuredClone(base);
      state.serverTick = packet.tick;
      state.players[1].x = 10 - (packet.tick / 60) * 3;
      view.accept(state, 'a');
    }
    const displayed = view.draw('a', 1 / 60);
    if (!displayed) continue;
    const x = displayed.players[1].x;
    if (frame > 20) strides.push(previous - x);
    previous = x;
  }
  assert.ok(
    strides.every((distance) => Math.abs(distance - 0.05) < 1e-9),
    'remote advances evenly despite packet jitter',
  );
});

test('local reconciliation preserves visible position and settles without a snap', () => {
  let now = 0;
  const view = new ReconciledView(() => now);
  const state = { ...createGame(['a', 'b']), phase: 'playing', round: 1 };
  state.players[0].ack = -1;
  view.accept(state, 'a');
  view.advance('a', { x: 1, y: 0 }, 1);
  const before = view.draw('a', 0).players[0].x;
  const corrected = structuredClone(state);
  corrected.players[0].ack = 1;
  view.accept(corrected, 'a');
  assert.equal(view.draw('a', 0).players[0].x, before);
  let last = before;
  for (let i = 0; i < 60; i++) {
    now += 1 / 60;
    const x = view.draw('a', 1 / 60).players[0].x;
    assert.ok(x <= last + 1e-10);
    assert.ok(last - x < 0.01);
    last = x;
  }
  assert.ok(Math.abs(last - state.players[0].x) < 1e-8);
  view.advance('a', { x: 1, y: 0 }, 2);
  assert.ok(view.draw('a', 0).players[0].x > last);
});
