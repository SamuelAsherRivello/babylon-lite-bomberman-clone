import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.GAME_URL||'http://127.0.0.1:5180/babylon-lite-bomberman-clone/';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-webgpu','--autoplay-policy=no-user-gesture-required']});
const errors=[];
async function page(mute=false){
  const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{
    window.audioContexts=[];
    const Native=window.AudioContext;
    window.AudioContext=class extends Native {
      constructor(...args){super(...args);window.audioContexts.push(this);this.started=[];}
      createGain(){const gain=super.createGain();this.firstGain ||= gain;gain.targets=[];const target=gain.gain.setTargetAtTime.bind(gain.gain);gain.gain.setTargetAtTime=(...args)=>{gain.targets.push(args[0]);return target(...args);};return gain;}
      createOscillator(){const oscillator=super.createOscillator(),set=oscillator.frequency.setValueAtTime.bind(oscillator.frequency);oscillator.frequency.setValueAtTime=(...args)=>{this.started.push(args[0]);return set(...args);};return oscillator;}
    };
  });
  const target=new URL(base);if(mute)target.searchParams.set('mute','1');
  await p.goto(target.href);await p.getByText('Starting Babylon Lite…').waitFor({state:'hidden'});return p;
}
try{
  const silent=await page(true);await silent.keyboard.press('ArrowRight');await silent.getByRole('button',{name:'Settings'}).click();
  assert.equal(await silent.getByLabel('Mute all audio').isChecked(),true);
  assert.equal(await silent.getByLabel('Mute all audio').isDisabled(),true);
  assert.equal(await silent.evaluate(()=>window.audioContexts.length),0,'silent URL never allocates an audio context');
  const normal=await page();await normal.keyboard.press('ArrowRight');
  await normal.waitForFunction(()=>window.audioContexts[0]?.state==='running'&&window.audioContexts[0].started.length>2);
  await normal.keyboard.press('Space');await normal.waitForTimeout(400);
  await normal.keyboard.down('ArrowRight');await normal.waitForTimeout(400);await normal.keyboard.up('ArrowRight');
  await normal.waitForTimeout(3000);
  assert.ok(await normal.evaluate(()=>window.audioContexts[0].started.some(f=>f<100)),'bomb explosion produces its low-frequency effect');
  await normal.getByRole('button',{name:'Settings'}).click();
  await normal.getByLabel('Mute all audio').check();await normal.waitForTimeout(200);
  assert.ok(await normal.evaluate(()=>window.audioContexts[0].firstGain.targets.at(-1)===0),'mute silences the shared output');
  await normal.getByLabel('Mute all audio').uncheck();
  const volume=normal.getByLabel('Audio volume');await volume.focus();await volume.press('Home');await normal.waitForTimeout(200);
  assert.ok(await normal.evaluate(()=>window.audioContexts[0].firstGain.targets.at(-1)===0),'zero volume silences output');
  await volume.press('End');await normal.waitForTimeout(200);
  assert.ok(await normal.evaluate(()=>window.audioContexts[0].firstGain.targets.at(-1)===1),'volume changes the shared output');
  const signals=await normal.evaluate(async()=>{
    const {ArcadeAudio}=await import('./src/content/audio.js');
    const engine=new ArcadeAudio();engine.activate();await engine.context.resume();
    const state={round:1,match:1,phase:'playing',remaining:120,board:[2],bombs:[],blasts:[],warnings:[],players:[{id:'a',alive:true,capacity:1,range:2,speed:3}]};
    engine.observe(state);state.bombs=[{id:1}];engine.observe(state);
    state.bombs=[];state.blasts=[{id:1}];state.board=[0];engine.observe(state);
    state.players[0].capacity=2;engine.observe(state);state.players[0].alive=false;engine.observe(state);
    state.phase='countdown';state.remaining=3;engine.observe(state);
    state.warnings=[{closeTick:100,cells:[0]}];engine.observe(state);
    state.phase='results';engine.observe(state);
    const output=[...engine.context.started];engine.dispose();return output;
  });
  for(const frequency of [190,75,310,420,660,880])assert.ok(signals.includes(frequency),`gameplay state emits effect ${frequency}`);
  assert.ok(signals.filter(f=>f===520).length>=2,'pickup and victory both emit distinct event effects');
  await normal.getByRole('button',{name:'Play online',exact:true}).click();
  await normal.waitForFunction(()=>window.audioContexts[0].state==='closed');
  assert.deepEqual(errors,[]);
  console.log('PASS: original synthesized music and bomb effects produce audio, mute and volume control the output, mute=1 allocates no context, and switching modes closes the previous context.');
}finally{await browser.close();}
