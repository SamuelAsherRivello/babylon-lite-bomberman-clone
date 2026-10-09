import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, stepGame, placeBomb, index, MAP_SIZES } from '../src/game/rules.js';
import { cpuInput, CPU_LEVELS, cpuHazards } from '../src/game/cpu.js';
const advance = (g, n, inputs = {}) => {
  for (let i = 0; i < n; i++) stepGame(g, inputs);
};
test('enabled plant always has exactly one valid seed across map sizes and seeds', () => {
  for (const size of Object.keys(MAP_SIZES))
    for (let seed = 0; seed < 200; seed++) {
      const g = createGame(['a', 'b', 'c', 'd'], seed, size, true);
      assert.equal(g.plants.length, 1);
      assert.equal(g.board[g.plants[0]], 0);
    }
});
test('pickups on larger maps use the selected map stride', () => {
  for (const size of ['MED', 'HIGH']) {
    const g = createGame(['a'], 1, size),
      p = g.players[0];
    p.x = 1.5;
    p.y = 3.5;
    g.board[index(1, 3, g.width)] = 0;
    g.powerups = [{ cell: index(1, 3, g.width), type: 'glove' }];
    stepGame(g);
    assert.equal(p.glove, true);
    assert.equal(g.powerups.length, 0);
  }
});
test('all map sizes keep four mirrored starts and complete sudden death by two minutes', () => {
  for (const [size, [w, h]] of Object.entries(MAP_SIZES)) {
    const g = createGame(['a', 'b', 'c', 'd'], 1001, size);
    assert.equal(g.board.length, w * h);
    assert.deepEqual(
      g.players.map((p) => [p.x, p.y]),
      [
        [1.5, 1.5],
        [w - 1.5, h - 1.5],
        [w - 1.5, 1.5],
        [1.5, h - 1.5],
      ],
    );
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        assert.equal(g.board[index(x, y, w)], g.board[index(w - 1 - x, h - 1 - y, w)]);
        assert.equal(g.hidden[index(x, y, w)], g.hidden[index(w - 1 - x, h - 1 - y, w)]);
      }
    assert.ok(g.waves.every((w) => w.closeTick - w.warnTick === 60 && w.closeTick <= 7200));
  }
});
test('small collider cannot wiggle sideways or vertically between opposing blocks', () => {
  const g = createGame();
  const p = g.players[0];
  p.x = 1.5;
  p.y = 2.5;
  advance(g, 10, { practice: { x: 1, y: 0 } });
  assert.equal(p.x, 1.5);
  advance(g, 10, { practice: { x: -1, y: 0 } });
  assert.equal(p.x, 1.5);
  p.x = 2.5;
  p.y = 1.5;
  advance(g, 10, { practice: { x: 0, y: 1 } });
  assert.equal(p.y, 1.5);
  advance(g, 10, { practice: { x: 0, y: -1 } });
  assert.equal(p.y, 1.5);
  advance(g, 3, { practice: { x: -1, y: 0 } });
  assert.ok(p.x < 2.5, 'movement along the corridor still works');
});
test('glove pushes a bomb until impact, suspends its old fuse and clears on death', () => {
  const g = createGame(['a', 'b'], 1, 'HIGH');
  g.board = g.board.map((v) => (v === 2 ? 0 : v));
  const p = g.players[0];
  p.x = 2.75;
  p.glove = true;
  g.bombs = [{ id: 1, owner: 'b', x: 3, y: 1, range: 1, deadline: 150, pass: [] }];
  stepGame(g, { a: { x: 1, y: 0 } });
  assert.ok(g.bombs[0].sliding);
  advance(g, 155);
  assert.equal(g.bombs.length, 1, 'moving bomb does not detonate at its old fuse');
  for (let n = 0; n < 100 && g.bombs.length; n++) stepGame(g);
  assert.equal(g.bombs.length, 0);
  assert.ok(g.blasts.some((b) => b.cells.includes(index(21, 1, g.width))));
  g.blasts = [
    { id: 99, cells: [index(Math.floor(p.x), Math.floor(p.y), g.width)], until: g.tick + 30 },
  ];
  stepGame(g);
  assert.equal(p.alive, false);
  assert.equal(p.glove, false);
});
test('lightning shields blasts and closing walls for exactly ten seconds', () => {
  const g = createGame();
  const p = g.players[0],
    cell = index(1, 1);
  g.powerups = [{ cell, type: 'shield' }];
  stepGame(g);
  assert.equal(p.shieldUntil, 601);
  g.blasts = [{ id: 1, cells: [cell], until: 900 }];
  g.waves = [{ cells: [cell], warnTick: 0, closeTick: 2 }];
  advance(g, 599);
  assert.equal(g.tick, 600);
  assert.equal(p.alive, true);
  stepGame(g);
  assert.equal(p.alive, false);
});
test('plant blocks movement like a wall without eliminating the player', () => {
  const g = createGame();
  g.board = g.board.map((value) => (value === 2 ? 0 : value));
  const p = g.players[0];
  g.plants = [index(2, 1)];
  advance(g, 30, { practice: { x: 1, y: 0 } });
  assert.ok(p.x <= 1.72, 'the player collider stops at the plant');
  assert.equal(p.alive, true);
  advance(g, 30, { practice: { x: 0, y: 1 } });
  assert.ok(p.y > 1.5, 'the player can move along the plant');
  assert.equal(p.alive, true);
  p.x = 2.5;
  p.y = 1.5;
  assert.equal(placeBomb(g, p), false, 'a plant tile cannot hold a new bomb');
  stepGame(g);
  assert.equal(p.alive, true, 'contact alone does not eliminate the player');
});
test('plant starts away from corners, grows every five seconds and blasts cut individual segments', () => {
  const g = createGame(['a', 'b', 'c', 'd'], 2, 'MED', true),
    origin = g.plants[0];
  assert.equal(g.plants.length, 1);
  assert.ok(
    g.players.every(
      (p) =>
        Math.abs(p.x - 0.5 - (origin % g.width)) +
          Math.abs(p.y - 0.5 - Math.floor(origin / g.width)) >=
        4,
    ),
  );
  advance(g, 299);
  assert.deepEqual(g.plants, [origin]);
  stepGame(g);
  assert.ok(g.plants.length > 1);
  assert.ok(
    g.plants.every(
      (cell) =>
        Math.abs((cell % g.width) - (origin % g.width)) +
          Math.abs(Math.floor(cell / g.width) - Math.floor(origin / g.width)) <=
        1,
    ),
  );
  const cut = createGame();
  cut.plants = [index(3, 1), index(4, 1), index(5, 1)];
  cut.board[index(4, 1)] = 0;
  cut.board[index(5, 1)] = 0;
  cut.bombs = [{ id: 1, owner: 'practice', x: 2, y: 1, range: 8, deadline: 1, pass: [] }];
  stepGame(cut);
  assert.deepEqual(cut.plants, [index(4, 1), index(5, 1)]);
});
test('CPU intelligence forecasts chains, has distinct reactions and fights through real legal inputs', () => {
  const g = createGame(['cpu:0', 'cpu:1', 'cpu:2', 'cpu:3']),
    brains = new Map();
  let explosions = 0;
  for (let tick = 0; tick < 1200; tick++) {
    const inputs = Object.fromEntries(
      g.players.map((p) => [p.id, cpuInput(g, p.id, brains, 'HARD')]),
    );
    stepGame(g, inputs);
    explosions += g.events.filter((e) => e.type === 'explosion').length;
    for (const p of g.players)
      assert.ok(g.bombs.filter((b) => b.owner === p.id).length <= p.capacity);
  }
  assert.ok(explosions > 0, 'CPUs excavate and bomb instead of merely occupying seats');
  assert.ok(g.players.some((p) => Math.hypot(p.x - 1.5, p.y - 1.5) > 1));
  assert.ok(
    CPU_LEVELS.LOW.reaction > CPU_LEVELS.MED.reaction &&
      CPU_LEVELS.MED.reaction > CPU_LEVELS.HARD.reaction,
  );
  assert.ok(CPU_LEVELS.HARD.horizon > CPU_LEVELS.LOW.horizon);
  const chained = createGame();
  chained.bombs = [
    { id: 1, x: 1, y: 1, range: 2, deadline: 20 },
    { id: 2, x: 3, y: 1, range: 2, deadline: 150 },
  ];
  const hazards = cpuHazards(chained);
  assert.ok(hazards.get(index(3, 1)).every(([at]) => at === 20));
});
