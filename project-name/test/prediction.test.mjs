import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '@rmc/multiplayer-client/bomberman';
import { predictMovement, ReconciledView } from '../src/game/prediction.js';
test('prediction responds immediately and does not mutate authoritative outcomes',()=>{
 const state={...createGame(['a','b']),phase:'playing',round:1};const original=structuredClone(state);
 const player=predictMovement(state,'a',{x:1,y:0});assert.ok(player.x>state.players[0].x);assert.deepEqual(state,original);
});
test('cosmetic bomb feedback clears on rejection acknowledgement and round reset',()=>{
 const state={...createGame(['a','b']),phase:'playing',round:1};state.players[0].ack=-1;
 const view=new ReconciledView();view.accept(state,'a');view.advance('a',{x:0,y:0,bomb:true},1);
 assert.equal(view.draw('a',1/60).pendingBombs.length,1);assert.equal(state.bombs.length,0);
 const rejected=structuredClone(state);rejected.players[0].ack=1;view.accept(rejected,'a');assert.equal(view.draw('a',1/60).pendingBombs.length,0);
 view.advance('a',{x:0,y:0,bomb:true},2);view.accept({...rejected,round:2},'a');assert.equal(view.pending.length,0);assert.equal(view.ghosts.length,0);
});
test('view reconciles acknowledged input and smooths remote movement',()=>{
 const state={...createGame(['a','b']),phase:'playing',round:1};state.players[0].ack=-1;
 const view=new ReconciledView();view.accept(state,'a');view.advance('a',{x:1,y:0},1);assert.equal(view.pending.length,1);
 const target=structuredClone(state);target.players[0].ack=1;target.players[0].x+=.05;view.accept(target,'a');assert.equal(view.pending.length,0);
 view.draw('a',1/60);target.players[1].x-=1;view.accept(target,'a');const displayed=view.draw('a',1/60);assert.ok(displayed.players[1].x>target.players[1].x);
});
