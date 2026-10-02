import { useEffect, useRef, useState } from 'react';
import { createGame, stepGame, STEP } from './game/rules.js';
import { createGameRenderer } from './content/renderer.js';
import { createControls } from './input/controls.js';
import versionText from '../../version.txt?raw';
import { Online } from './Online.jsx';
import { Viewport } from './ui/Viewport.jsx';
import { AudioSettings, useArcadeAudio } from './ui/AudioSettings.jsx';
import {cpuInput} from './game/cpu.js';
import {BattleOptions,PowerupLegend} from './ui/BattleOptions.jsx';
import {DeathView} from './game/death-view.js';
export function App() {
  const [online,setOnline]=useState(()=>new URLSearchParams(window.location.search).get('mode')==='online');
  return online?<Online onExit={()=>setOnline(false)}/>:<Practice onOnline={()=>setOnline(true)}/>;
}
function Practice({onOnline}) {
  const sound=useArcadeAudio();
  const [options,setOptions]=useState({cpu:'MED',map:'LOW',plant:false}),optionRef=useRef(options),brains=useRef(new Map()),death=useRef(new DeathView());
  const [frozen,setFrozen]=useState(false),[bombFlash,setBombFlash]=useState(()=>localStorage.getItem('bomberman-bomb-flash')!=='off'),flash=useRef(bombFlash);
  const changeFlash=value=>{flash.current=value;setBombFlash(value);localStorage.setItem('bomberman-bomb-flash',value?'on':'off');};
  const canvas=useRef(null),game=useRef(createGame(['practice','cpu:1','cpu:2','cpu:3'])),controls=useRef(null);
  const [message,setMessage]=useState('Starting Babylon Lite…'),[paused,setPaused]=useState(false),[alive,setAlive]=useState(true),[scale,setScale]=useState(''),[settings,setSettings]=useState(false),[stats,setStats]=useState('1 BOMB · RANGE 2 · SPEED 0');
  useEffect(()=>{let cancelled=false,renderer,frame,last=0,accumulator=0;const input=createControls();controls.current=input;
    const loop=now=>{if(cancelled)return;accumulator+=Math.min((now-last)/1000,.1);last=now;while(accumulator>=STEP){if(!death.current.frozen(now)){const commands={practice:input.read()};for(const p of game.current.players.slice(1))commands[p.id]=cpuInput(game.current,p.id,brains.current,optionRef.current.cpu);stepGame(game.current,commands);}accumulator-=STEP;}const shown=death.current.draw(game.current,'practice',now);shown.bombFlash=flash.current;setFrozen(death.current.frozen(now));const mapping=renderer.draw(shown);sound.audio.current?.observe(game.current);setAlive(game.current.players[0].alive);setStats(`${game.current.players[0].capacity} BOMB · RANGE ${game.current.players[0].range} · SPEED ${game.current.players[0].speedLevel}`);setScale(`${mapping.scale.toFixed(2)}× ${mapping.scale>=1?'Integer':'Fractional'}`);frame=requestAnimationFrame(loop);};
    createGameRenderer(canvas.current).then(r=>{renderer=r;if(cancelled){r.dispose();return;}setMessage('');last=performance.now();frame=requestAnimationFrame(loop);}).catch(error=>{if(!cancelled)setMessage(error.message);});
    return()=>{cancelled=true;cancelAnimationFrame(frame);input.dispose();renderer?.dispose();controls.current=null;};
  },[]);
  const pause=value=>{game.current.paused=value;controls.current?.clear();setPaused(value);};
  const restart=()=>{controls.current?.clear();game.current=createGame(['practice','cpu:1','cpu:2','cpu:3'],1,optionRef.current.map,optionRef.current.plant);brains.current.clear();death.current.reset();setFrozen(false);setPaused(false);setAlive(true);setSettings(false);};
  const touch=(action,label)=><button aria-label={label} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controls.current?.touch(e.pointerId,action);}} onPointerUp={e=>controls.current?.release(e.pointerId)} onPointerCancel={e=>controls.current?.release(e.pointerId)} onLostPointerCapture={e=>controls.current?.release(e.pointerId)}>{label}</button>;
  return <Viewport>
    <canvas ref={canvas} aria-label="Bomberman practice arena"/>
    <div id="ui_layer">
    <header className="corner corner_top_left"><span className="eyebrow">ARCADE / LOCAL PRACTICE</span><h1>Bomberman Clone</h1></header>
    <nav className="corner corner_top_right"><button onClick={onOnline}>Play online</button><a href="https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    <div className="hud"><span className={alive?'live':'out'}>{alive?'● READY TO BLAST':'● ELIMINATED'}</span><span>{stats}</span></div>
    <aside className="legend-rail"><BattleOptions options={options} onChange={patch=>{const next={...optionRef.current,...patch};optionRef.current=next;setOptions(next);restart();}} bombFlash={bombFlash} onBombFlash={changeFlash}/><PowerupLegend/></aside>{message&&<div className="overlay" role="status"><h2>Getting ready</h2><p>{message}</p>{message!=='Starting Babylon Lite…'&&<button onClick={()=>location.reload()}>Try graphics again</button>}</div>}
    {!message&&!alive&&!frozen&&<div className="overlay"><span className="eyebrow">CAUGHT IN THE CROSSFIRE</span><h2>One more round?</h2><p>Escape before your bomb explodes.</p><button onClick={restart}>Try again ↗</button></div>}
    {!message&&paused&&alive&&<div className="overlay"><h2>Take a breather</h2><button onClick={()=>{setSettings(false);pause(false);}}>Resume</button></div>}
    <div className="instructions">MOVE <kbd>WASD</kbd> / <kbd>↑↓←→</kbd> · BOMB <kbd>SPACE</kbd><span>Place. Escape. Repeat.</span></div>
    <div className="touch-controls"><div className="pad">{touch('up','↑')}{touch('left','←')}{touch('down','↓')}{touch('right','→')}</div><div className="bomb-control">{touch('bomb','BOMB')}</div></div>
    <section className="corner corner_bottom_left"><button onClick={()=>{setSettings(!settings);pause(!settings);}}>⚙ Settings</button>{settings&&<div className="settings"><AudioSettings sound={sound}/><button onClick={()=>{const operation=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();operation?.catch(()=>setMessage('Fullscreen is unavailable in this browser.'));}}>Fullscreen</button><button onClick={restart}>Restart practice</button><p>2DPixelPerfect · {scale}</p></div>}</section>
    <footer className="corner corner_bottom_right">v{versionText.trim().replace(/^version=/,'')}<span>LOCAL PRACTICE</span></footer>
    </div>
  </Viewport>;
}
