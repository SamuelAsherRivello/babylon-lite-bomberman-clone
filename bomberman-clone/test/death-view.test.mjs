import test from 'node:test';
import assert from 'node:assert/strict';
import {DeathView} from '../src/game/death-view.js';
test('death view holds lethal geometry for exactly three seconds without changing live state',()=>{
 const view=new DeathView(),g={round:1,phase:'playing',players:[{id:'a',alive:true}],blasts:[]};
 view.draw(g,'a',0);g.players[0].alive=false;g.blasts=[{cells:[16]}];const lethal=view.draw(g,'a',100);
 g.blasts=[];assert.equal(view.draw(g,'a',3099),lethal);assert.equal(view.frozen(3099),true);
 assert.equal(view.draw(g,'a',3100),g);assert.equal(view.frozen(3100),false);assert.deepEqual(g.blasts,[]);
});
test('round results get a fresh hold and restart clears frozen state',()=>{
 const view=new DeathView(),g={round:1,phase:'playing',players:[{id:'a',alive:true}]};view.draw(g,'a',0);
 g.phase='results';view.draw(g,'a',1000);assert.ok(view.frozen(3999));assert.equal(view.frozen(4000),false);
 g.round=2;g.phase='countdown';view.draw(g,'a',2000);assert.equal(view.frozen(2000),false);
});
