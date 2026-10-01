import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { MultiplayerClient } from '@rmc/multiplayer-client';

// A separate integration command: requires the running application and public backend.
const url=process.env.GAME_URL||'http://127.0.0.1:5173/babylon-lite-bomberman-clone/';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-webgpu']});
const pages=[],errors=[];
let observer;
async function until(fn,label,timeout=10000){const end=Date.now()+timeout;while(!fn()){if(Date.now()>end)throw Error(label);await new Promise(resolve=>setTimeout(resolve,30));}}
async function page(options={}){
 const context=await browser.newContext({viewport:{width:1280,height:900},...options});const p=await context.newPage();pages.push(p);
 p.on('console',message=>{const text=message.text();if(/min uptime|No more retries|Network offline|will retry|reconnection successful/.test(text))console.log(text);});
 p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.getByRole('button',{name:'Play online',exact:true}).click();await checkLayout(p);return p;
}
async function checkLayout(p){
 const fit=await p.evaluate(()=>{
  const box=document.querySelector('#viewport').getBoundingClientRect(),canvas=document.querySelector('canvas').getBoundingClientRect();
  const corners=[...document.querySelectorAll('#ui_layer .corner')].map(n=>n.getBoundingClientRect());
  const touch=document.querySelector('.touch-controls'),touchBox=touch.getBoundingClientRect();
  return {ratio:box.width/box.height,gutters:document.querySelectorAll('.gutter').length,
   canvasFits:canvas.height>0&&canvas.top>=box.top&&canvas.bottom<=box.bottom,
   cornersFit:corners.length===4&&corners.every(n=>n.left>=box.left&&n.right<=box.right&&n.top>=box.top&&n.bottom<=box.bottom),
   touchFits:getComputedStyle(touch).display==='none'||(touchBox.top>=canvas.bottom&&touchBox.bottom<=box.bottom)};
 });
 assert.ok(Math.abs(fit.ratio-320/272)<.001,'one fixed landscape ratio at every browser size');
 assert.equal(fit.gutters,4);assert.ok(fit.canvasFits&&fit.cornersFit&&fit.touchFits,'arena and primary controls fit within viewport');
}
async function mintPosition(p){
 const screenshot=await p.screenshot();return p.evaluate(async bytes=>{
  const image=await createImageBitmap(new Blob([new Uint8Array(bytes)],{type:'image/png'}));
  const c=new OffscreenCanvas(image.width,image.height),ctx=c.getContext('2d');ctx.drawImage(image,0,0);
  const pixels=ctx.getImageData(0,0,c.width,c.height).data;let x=0,y=0,n=0;
  for(let i=0;i<pixels.length;i+=4)if(pixels[i]===121&&pixels[i+1]===222&&pixels[i+2]===208){x+=(i/4)%c.width;y+=Math.floor(i/4/c.width);n++;}
  assertPixel(n);function assertPixel(n){if(!n)throw Error('Mint player was not rendered');}return{x:x/n,y:y/n};
 },[...screenshot]);
}
try {
 const a=await page(),b=await page();
 await a.getByRole('button',{name:'Create room',exact:true}).click();const heading=a.getByRole('heading',{name:/^Room [A-Z0-9]{6}$/});await heading.waitFor({timeout:30000});const code=(await heading.innerText()).split(' ')[1];
 await b.getByLabel('Room code').fill(code);await b.getByRole('button',{name:'Join room',exact:true}).click();await b.getByRole('heading',{name:`Room ${code}`}).waitFor({timeout:30000});
 await a.getByRole('button',{name:'Violet',exact:true}).click();await a.getByText('Player 1 · Violet').waitFor();await a.getByRole('button',{name:'Mint',exact:true}).click();await a.getByText('Player 1 · Mint').waitFor();assert.equal(await b.getByRole('button',{name:'Mint',exact:true}).isDisabled(),true,'occupied colors cannot be selected');
 await a.getByRole('button',{name:'Ready up',exact:true}).click();await b.getByRole('button',{name:'Ready up',exact:true}).click();for(const p of[a,b])await p.getByText(/s · ALIVE/).waitFor({timeout:10000});
 observer=new MultiplayerClient(process.env.BACKEND_URL||'https://rmc-colyseus-multiplayer-server.vercel.app','bomberman',{code});void observer.connect();await until(()=>observer.state.status==='connected','spectator admission');const first=observer.state.gameState.people.find(p=>p.number===0);assert.ok(!observer.state.gameState.players.some(p=>p.id===observer.state.sessionId),'late observer spectates');
 // Delay outbound WebSocket traffic and add bounded deterministic jitter. The
 // transport instance already exists; patch its prototype without touching admission.
 await a.evaluate(()=>{const original=WebSocket.prototype.send;window.restoreTransport=()=>{WebSocket.prototype.send=original;};let packet=0,delivery=0;WebSocket.prototype.send=function(data){const copy=ArrayBuffer.isView(data)?new Uint8Array(data.buffer,data.byteOffset,data.byteLength).slice():data instanceof ArrayBuffer?data.slice(0):data;const ws=this;delivery=Math.max(delivery+1,performance.now()+180+(packet++%4)*20);setTimeout(()=>{if(ws.readyState===WebSocket.OPEN)original.call(ws,copy);},Math.max(0,delivery-performance.now()));};});
 const before=await mintPosition(a);await a.keyboard.down('ArrowRight');await a.waitForTimeout(80);const immediate=await mintPosition(a);assert.ok(immediate.x>before.x+2,'movement renders before delayed outbound input can reach server');
 await a.waitForTimeout(220);await a.keyboard.up('ArrowRight');await a.waitForTimeout(1000);const local=await mintPosition(a),remote=await mintPosition(b);assert.ok(Math.abs(local.x-remote.x)<8,'reconciled local and interpolated remote positions converge');
 await a.keyboard.down('ArrowDown');await a.waitForTimeout(100);await a.getByRole('button',{name:'Settings'}).click();await a.waitForTimeout(400);
 const stopped=structuredClone(observer.state.gameState.players.find(p=>p.id===first.id));await a.waitForTimeout(350);const still=observer.state.gameState.players.find(p=>p.id===first.id);assert.ok(Math.hypot(still.x-stopped.x,still.y-stopped.y)<.01,'settings neutralizes held movement while shared server continues');
 await a.getByRole('button',{name:'Resume',exact:true}).click();await a.keyboard.up('ArrowDown');
 await a.keyboard.press('Space');await until(()=>observer.state.gameState.bombs.some(b=>b.owner===first.id),'server confirms bomb placement');for(const p of[a,b])await p.getByRole('heading',{name:'Player 2 wins!'}).waitFor({timeout:8000});
 await a.screenshot({path:'project-name/documentation/multiplayer-round.png'});
 await a.evaluate(()=>window.restoreTransport());await a.waitForTimeout(300);
 // Real network loss, then recovery before the reserved-seat deadline.
 await a.context().setOffline(true);await a.waitForTimeout(1200);await a.context().setOffline(false);await a.getByRole('heading',{name:`Room ${code}`}).waitFor({timeout:15000});
 assert.ok(observer.state.gameState.people.some(p=>p.id===first.id),'recovery preserved the original identity');
 await a.getByText(/Player 1 · Mint/).waitFor();await a.getByText(/Player 2 · Amber.*1 wins/).waitFor();
 const mobile=await page({viewport:{width:390,height:844},deviceScaleFactor:1.5,isMobile:true,hasTouch:true});await mobile.getByLabel('Room code').fill(code);await mobile.getByRole('button',{name:'Join room',exact:true}).click();await mobile.getByRole('heading',{name:`Room ${code}`}).waitFor({timeout:30000});await mobile.screenshot({path:'project-name/documentation/multiplayer-mobile.png'});
 const extra=await page();await extra.getByLabel('Room code').fill(code);await extra.getByRole('button',{name:'Join room',exact:true}).click();await extra.getByText('This room is full. Try again when someone leaves.').waitFor({timeout:20000});
 await extra.getByLabel('Room code').fill('BAD000');await extra.getByRole('button',{name:'Join room',exact:true}).click();await extra.getByText('Room expired or code not found. Create a new room.').waitFor({timeout:20000});
 await extra.getByRole('button',{name:'Create room',exact:true}).click();const isolated=extra.getByRole('heading',{name:/^Room [A-Z0-9]{6}$/});await isolated.waitFor({timeout:20000});assert.notEqual(await isolated.innerText(),`Room ${code}`,'new room is isolated');
 assert.deepEqual(errors,[]);console.log('PASS: two-browser lobby/battle, immediate movement with 180–240ms latency/jitter, converged remote motion, common winner, brief offline recovery, mobile join and no page errors.');
} catch(error){
 for(let n=0;n<pages.length;n++){console.error(`Browser ${n+1}:`,(await pages[n].locator('body').innerText()).slice(0,900));await pages[n].screenshot({path:`.tmp/online-failure-${n+1}.png`});}
 throw error;
} finally {observer?.disconnect();await browser.close();}
