import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, stepGame, placeBomb, index } from '../src/game/rules.js';
const advance = (g, ticks, input) => { for (let n = 0; n < ticks; n++) stepGame(g, input); };

test('arena is symmetric with clear equal escape routes', () => {
  const g = createGame();
  assert.equal(g.board.length, 195);
  assert.deepEqual(g.board, [...g.board].reverse());
  for (const [x, y] of [[1,1],[13,11],[13,1],[1,11]]) assert.equal(g.board[index(x,y)], 0);
});
test('collision prevents walking through outer walls', () => {
  const g = createGame(); advance(g, 180, { practice: { x: -1 } });
  assert.ok(g.players[0].x >= 1.28);
});
test('bomb capacity, fuse, owner damage and blast duration', () => {
  const g = createGame(), p = g.players[0];
  assert.equal(placeBomb(g,p),true); assert.equal(placeBomb(g,p),false);
  advance(g,149); assert.equal(g.bombs.length,1); assert.equal(p.alive,true);
  advance(g,1); assert.equal(g.bombs.length,0); assert.equal(p.alive,false); assert.equal(g.blasts.length,1);
  advance(g,30); assert.equal(g.blasts.length,0);
});
test('owner leaves bomb but cannot reenter', () => {
  const g = createGame(), p = g.players[0]; placeBomb(g,p);
  advance(g,25,{practice:{x:1}}); assert.ok(p.x > 2.28);
  advance(g,25,{practice:{x:-1}}); assert.ok(p.x >= 2.28);
});
test('chain detonates once and destruction blocks that tick rays', () => {
  const g = createGame(); g.board.fill(0); const p = g.players[0]; p.capacity=2;
  p.x=3.5;p.y=3.5; placeBomb(g,p);p.x=5.5;placeBomb(g,p);
  g.bombs[0].deadline=1;g.board[index(6,3)]=2;p.x=10.5;p.y=10.5;
  stepGame(g); assert.equal(g.bombs.length,0);assert.equal(g.blasts.length,2);
  assert.equal(g.board[index(6,3)],0);assert.ok(!g.blasts.some(b=>b.cells.includes(index(7,3))));
});
test('pause and restart have no stale clock or bomb state', () => {
  const g=createGame();placeBomb(g,g.players[0]);g.paused=true;advance(g,200);assert.equal(g.tick,0);
  g.paused=false;advance(g,1);assert.equal(g.tick,1);
  const fresh=createGame();advance(fresh,200);assert.equal(fresh.bombs.length,0);assert.equal(fresh.players[0].alive,true);
});
test('same seeded input stream produces identical outcomes', () => {
  const a=createGame(['a','b'],42),b=createGame(['a','b'],42);
  for(let n=0;n<240;n++){const input={a:{x:n<60?1:0,bomb:n===80}};stepGame(a,input);stepGame(b,input);}
  assert.deepEqual(a,b);
});
