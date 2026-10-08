import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, stepGame, index } from '../src/game/rules.js';
import { ReconciledView } from '../src/game/prediction.js';
test('delayed and jittered authoritative snapshots preserve pushed impact and smooth bomb motion', () => {
  const g = createGame(['a', 'b', 'c', 'd']);
  g.board = g.board.map((v) => (v === 2 ? 0 : v));
  const p = g.players[0];
  p.x = 2.75;
  g.powerups = [{ cell: index(2, 1), type: 'glove' }];
  stepGame(g);
  assert.ok(p.glove);
  g.bombs = [{ id: 1, owner: 'b', x: 3, y: 1, range: 1, deadline: 150, pass: [] }];
  let now = 0,
    explosions = 0;
  const view = new ReconciledView(() => now),
    packets = [],
    positions = [];
  for (let tick = 0; tick < 160; tick++) {
    now = tick / 60;
    stepGame(g, tick === 0 ? { a: { x: 1, y: 0 } } : {});
    explosions += g.events.filter((e) => e.type === 'explosion').length;
    if (tick % 3 === 0)
      packets.push({
        at: tick + 12 + (tick % 4),
        state: {
          ...structuredClone(g),
          phase: 'playing',
          round: 1,
          serverTick: tick,
          players: g.players.map((p) => ({ ...p, ack: 0 })),
        },
      });
    while (packets[0]?.at <= tick) view.accept(packets.shift().state, 'd');
    const shown = view.draw('d', 1 / 60),
      bomb = shown?.bombs.find((b) => b.id === 1);
    if (bomb?.sliding) positions.push(bomb.slideX);
  }
  assert.equal(explosions, 1);
  assert.equal(g.bombs.length, 0);
  assert.equal(view.state.bombs.length, 0);
  const strides = positions.slice(1).map((x, n) => x - positions[n]);
  assert.ok(
    strides.some((dx) => dx > 0 && dx < 0.15),
    'buffer creates intermediate positions instead of 20Hz jumps',
  );
  assert.ok(strides.every((dx) => dx >= 0 && dx <= 0.31));
});
test('plant cutting and immunity outcomes stay authoritative through delayed snapshots', () => {
  const g = createGame(['a', 'b']);
  g.board.fill(0);
  g.plants = [index(5, 5), index(6, 5)];
  g.players[0].x = 5.5;
  g.players[0].y = 5.5;
  g.players[0].shieldUntil = 600;
  g.bombs = [{ id: 1, owner: 'b', x: 4, y: 5, range: 4, deadline: 1, pass: [] }];
  stepGame(g);
  assert.deepEqual(g.plants, [index(6, 5)]);
  assert.ok(g.players[0].alive);
  const view = new ReconciledView(() => 0.2);
  view.accept({ ...structuredClone(g), phase: 'playing', round: 1, serverTick: 1 }, 'b');
  const shown = view.draw('b', 1 / 60);
  assert.deepEqual(shown.plants, g.plants);
  assert.equal(shown.players[0].shieldUntil, 600);
  assert.ok(shown.players[0].alive);
});
