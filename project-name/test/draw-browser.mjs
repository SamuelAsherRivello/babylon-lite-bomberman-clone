import { chromium } from '@playwright/test';
import { MultiplayerClient } from '@rmc/multiplayer-client';
import assert from 'node:assert/strict';

// Real-time production rules: both players remain at mirrored corners until
// the first sudden-death wave crushes them together. No fixture inputs or
// altered clock, position, bomb fuse, or round duration are used.
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-webgpu']});
const errors=[],helpers=[];
try {
 const url=new URL(process.env.GAME_URL||'http://127.0.0.1:5180/babylon-lite-bomberman-clone/');url.searchParams.set('mode','online');url.searchParams.set('mute','1');
 const a=await (await browser.newContext()).newPage(),b=await (await browser.newContext()).newPage();
 for(const page of [a,b]){page.on('pageerror',error=>errors.push(error.message));await page.goto(url.href);await page.getByRole('heading',{name:'Battle with friends'}).waitFor();}
 await a.getByRole('button',{name:'Create room',exact:true}).click();const title=await a.getByRole('heading',{name:/^Room [A-Z0-9]{4}$/}).innerText();
 await b.getByLabel('Room code').fill(title.slice(5));await b.getByRole('button',{name:'Join room',exact:true}).click();await b.getByRole('heading',{name:title,exact:true}).waitFor();
 for(let n=0;n<2;n++){const c=new MultiplayerClient(process.env.BACKEND_URL||'https://rmc-colyseus-multiplayer-server.vercel.app','bomberman',{code:title.slice(5)});helpers.push(c);void c.connect();const end=Date.now()+15000;while(c.state.status!=='connected'){if(Date.now()>end)throw Error('draw helper admission');await new Promise(resolve=>setTimeout(resolve,40));}c.send('ready');}
 for(const page of [a,b])await page.getByRole('button',{name:'Ready up',exact:true}).click();
 for(const page of [a,b])await page.getByText(/120s · ALIVE/).waitFor({timeout:12000});
 console.log('Both real browsers playing; waiting for unchanged 90-second sudden death.');
 await Promise.all([a,b].map(page=>page.getByRole('heading',{name:'Draw!',exact:true}).waitFor({timeout:105000})));
 for(const page of [a,b]){assert.equal(await page.locator('.scoreboard').innerText().then(text=>(text.match(/0\/3/g)||[]).length),4,'same-tick draw awards neither player a point');}
 await a.screenshot({path:'project-name/documentation/multiplayer-draw.png'});
 await Promise.all([a,b].map(page=>page.getByText(/120s · ALIVE/).waitFor({timeout:12000})));
 for(const page of [a,b]){await page.getByText(/ROUND 2/).waitFor();await page.getByText('BOMBS 1/5 · RANGE 2/8 · SPEED 0/3',{exact:true}).waitFor();}
 assert.deepEqual(errors,[]);
 console.log('PASS: real-time two-browser sudden-death simultaneous draw, no points, automatic round two with fresh upgrades and no page errors.');
} finally {helpers.forEach(c=>c.disconnect());await browser.close();}
