import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,stepGame,placeBomb,index} from '../src/game/rules.js';
import {createControls} from '../src/input/controls.js';
test('installed immutable client has exactly the same deterministic rules as practice',()=>{
 const local=readFileSync(new URL('../src/game/rules.js',import.meta.url),'utf8').replace(/\r\n/g,'\n').trim();
 const released=readFileSync(new URL(import.meta.resolve('@rmc/multiplayer-client/bomberman')),'utf8').replace(/\r\n/g,'\n').trim();
 assert.equal(released,local);
});
test('uppercase press and lowercase release, Shift keys and blur clear controls',()=>{
 const old=globalThis.window;globalThis.window=new EventTarget();const controls=createControls();
 const key=(type,value)=>{const event=new Event(type,{cancelable:true});Object.defineProperties(event,{key:{value},repeat:{value:false}});window.dispatchEvent(event);};
 try{key('keydown','D');assert.equal(controls.read().x,1);key('keyup','d');assert.equal(controls.read().x,0);key('keydown','W');assert.equal(controls.read().y,-1);window.dispatchEvent(new Event('blur'));assert.equal(controls.read().y,0);}finally{controls.dispose();globalThis.window=old;}
});
test('glove chain detonates a moving bomb exactly once and releases owner capacity',()=>{
 const g=createGame(['a','b']);g.board.fill(0);g.players.forEach(p=>{p.x=10.5;p.y=10.5;});
 g.bombs=[{id:1,owner:'a',x:2,y:1,range:3,deadline:1,pass:[]},{id:2,owner:'b',x:4,y:1,range:2,deadline:150,pass:[],sliding:{dx:1,dy:0},slideX:4.5,slideY:1.5}];
 stepGame(g);assert.equal(g.bombs.length,0);assert.equal(g.events.filter(e=>e.type==='explosion').length,2);assert.ok(placeBomb(g,g.players[1]));
});
test('lightning refreshes, escapes overlapped closed walls and resets in a fresh life',()=>{
 const g=createGame(),p=g.players[0],cell=index(1,1);g.powerups=[{cell,type:'shield'}];stepGame(g);
 for(let n=0;n<100;n++)stepGame(g);g.powerups=[{cell,type:'shield'}];stepGame(g);assert.equal(p.shieldUntil,g.tick+600);
 g.waves=[{cells:[cell],warnTick:g.tick,closeTick:g.tick+1}];stepGame(g);assert.ok(p.alive);
 for(let n=0;n<30;n++)stepGame(g,{practice:{x:1,y:0}});assert.ok(p.x>2.28);assert.ok(p.alive);
 assert.equal(createGame().players[0].shieldUntil,0);
});
test('plant growth excludes bombs, solid terrain and active flames and contact eliminates',()=>{
 const g=createGame();g.board.fill(0);g.plantEnabled=true;g.plants=[index(5,5)];g.nextPlantTick=1;
 g.board[index(4,5)]=2;g.bombs=[{id:1,owner:'practice',x:6,y:5,range:1,deadline:150,pass:[]}];g.blasts=[{id:2,cells:[index(5,4)],until:30}];stepGame(g);
 assert.deepEqual(g.plants,[index(5,5),index(5,6)]);g.players[0].x=5.5;g.players[0].y=6.5;stepGame(g);assert.equal(g.players[0].alive,false);
});
