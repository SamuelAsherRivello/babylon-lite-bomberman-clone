import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-webgpu']});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
  const url=new URL(process.env.GAME_URL||'http://127.0.0.1:5180/babylon-lite-bomberman-clone/');url.searchParams.set('mute','1');
  await page.goto(url.href);await page.getByText('Starting Babylon Lite…').waitFor({state:'hidden'});
  await page.evaluate(async()=>{
    const [{createGameRenderer},{createGame}]=await Promise.all([import('./src/content/renderer.js'),import('./src/game/rules.js')]);
    const canvas=document.createElement('canvas');canvas.id='visual-fixture';canvas.style.cssText='position:fixed;top:0;left:0;width:480px;height:416px;z-index:99';document.body.append(canvas);
    const renderer=await createGameRenderer(canvas),state=createGame(['a','b','c','d']);
    state.board=Array(195).fill(0);state.powerups=[{cell:16,type:'bomb'},{cell:31,type:'range'},{cell:46,type:'speed'}];state.closed=[18];state.warnings=[{cells:[17]}];state.bombs=[{id:1,x:3,y:3,deadline:150}];state.blasts=[{id:2,cells:[64],until:30}];
    state.players.forEach((p,n)=>{p.x=6.5+n*2;p.y=1.5;p.color=n;});
    window.visualFixture={renderer,state};window.visualFrame=requestAnimationFrame(function draw(){if(window.animateCourier)state.players[0].x+=.0002;renderer.draw(state);window.visualFrame=requestAnimationFrame(draw);});
  });
  await page.waitForTimeout(150);
  async function pixels(){const bytes=await page.locator('#visual-fixture').screenshot();return page.evaluate(async data=>{
    const image=await createImageBitmap(new Blob([new Uint8Array(data)],{type:'image/png'}));const canvas=new OffscreenCanvas(image.width,image.height),ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,image.width,image.height).data;
    const sample=(x,y)=>{const i=(y*image.width+x)*4;return [...pixels.slice(i,i+3)];};
    const hasColor=(tx,ty,color)=>{for(let y=ty*32;y<(ty+1)*32;y++)for(let x=tx*32;x<(tx+1)*32;x++)if(sample(x,y).join(',')===color)return true;return false;};
    const feet=[];for(let y=58;y<64;y++)for(let x=194;x<224;x++)feet.push(sample(x,y).join(','));
    return {bomb:hasColor(1,1,'121,222,208'),range:hasColor(1,2,'255,206,105'),speed:hasColor(1,3,'182,155,255'),closed:sample(108,44),warning:sample(66,34),fuse:hasColor(3,3,'255,240,160'),blast:hasColor(4,4,'255,98,58'),elimination:hasColor(6,1,'255,191,120'),colors:['121,222,208','251,173,105','182,155,255','255,127,164'].map((color,n)=>hasColor(6+n*2,1,color)),feet:feet.join(';')};
  },[...bytes]);}
  const first=await pixels();assert.ok(first.bomb&&first.range&&first.speed,'all three pickup palettes are visible in their own cells');assert.deepEqual(first.closed,[53,43,57]);
  assert.ok(first.fuse&&first.blast,'fuse and dangerous cross blast remain visually distinct');
  let warning=first.warning;
  for(let n=0;n<4&&warning.join(',')!=='255,207,105';n++){await page.waitForTimeout(100);warning=(await pixels()).warning;}
  assert.deepEqual(warning,[255,207,105],'imminent wall has a visible pulsing border');
  assert.ok(first.colors.every(Boolean),'four original couriers remain distinct');
  await page.evaluate(()=>{window.animateCourier=true;});
  const poses=new Set();for(let n=0;n<4;n++){await page.waitForTimeout(90);poses.add((await pixels()).feet);}
  assert.ok(poses.size>=2,'walking changes the actual foot pixels while keeping movement coordinates precise');
  await page.evaluate(()=>{window.animateCourier=false;window.visualFixture.state.players[0].alive=false;});await page.waitForTimeout(40);
  assert.ok((await pixels()).elimination,'elimination produces a visible bounded burst');
  await page.waitForTimeout(600);assert.equal((await pixels()).elimination,false,'elimination particles expire');
  await page.evaluate(()=>{cancelAnimationFrame(window.visualFrame);window.visualFixture.renderer.dispose();document.querySelector('#visual-fixture').remove();});
  assert.deepEqual(errors,[]);console.log('PASS: actual WebGPU pixels show three readable pickup types, a closed wall, a pulsing wall warning and four distinct couriers.');
}finally{await browser.close();}
