import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-webgpu']});
const context=await browser.newContext({viewport:{width:1280,height:900}}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const url=new URL(process.env.GAME_URL||'http://127.0.0.1:5180/babylon-lite-bomberman-clone/');url.searchParams.set('mute','1');url.searchParams.delete('mode');
async function layout(){await page.waitForFunction(()=>{const canvas=document.querySelector('canvas');return canvas?.dataset.engine&&Math.abs(canvas.width-canvas.clientWidth*devicePixelRatio)<=1;});const fit=await page.evaluate(()=>{
  const viewport=document.querySelector('#viewport').getBoundingClientRect(),canvas=document.querySelector('canvas'),box=canvas.getBoundingClientRect();
  return {ratio:viewport.width/viewport.height,dpr:devicePixelRatio,backing:canvas.width,css:canvas.clientWidth,
    corners:[...document.querySelectorAll('#ui_layer .corner')].every(n=>{const b=n.getBoundingClientRect();return b.left>=viewport.left&&b.right<=viewport.right&&b.top>=viewport.top&&b.bottom<=viewport.bottom;}),
    canvas:box.height>0&&box.top>=viewport.top&&box.bottom<=viewport.bottom};
});assert.ok(Math.abs(fit.ratio-16/9)<.001);assert.ok(fit.corners&&fit.canvas);assert.ok(Math.abs(fit.backing-fit.css*fit.dpr)<=1,'native DPR is applied exactly once');}
try{
  await page.goto(url.href);await page.getByText('Starting Babylon Lite…').waitFor({state:'hidden'});await layout();
  await page.getByRole('button',{name:'Settings'}).click();await page.getByLabel('Mute all audio').waitFor();
  assert.equal(await page.getByLabel('Mute all audio').isChecked(),true);
  await page.getByRole('button',{name:'Fullscreen',exact:true}).click();await page.waitForFunction(()=>Boolean(document.fullscreenElement));await layout();
  await page.evaluate(()=>document.exitFullscreen());await page.waitForTimeout(150);
  await page.getByRole('button',{name:'Resume',exact:true}).click();
  await page.setViewportSize({width:800,height:700});await page.waitForTimeout(150);await layout();
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:1024,height:720,deviceScaleFactor:1.25,mobile:false});await page.waitForTimeout(150);await layout();
  await cdp.send('Emulation.clearDeviceMetricsOverride');
  await page.addInitScript(()=>{if(sessionStorage.getItem('blockGPU')==='1')Object.defineProperty(navigator,'gpu',{value:undefined,configurable:true});});
  await page.evaluate(()=>sessionStorage.setItem('blockGPU','1'));await page.reload();
  await page.getByText(/This game requires WebGPU/).waitFor();
  await page.evaluate(()=>sessionStorage.setItem('blockGPU','0'));await page.getByRole('button',{name:'Try graphics again',exact:true}).click();
  await page.getByText('Starting Babylon Lite…').waitFor({state:'hidden'});await layout();
  assert.deepEqual(errors,[]);console.log('PASS: fixed landscape HUD, fullscreen, resize, emulated 125% zoom/DPR, silent settings and recovery after simulated unsupported WebGPU.');
}finally{await browser.close();}
