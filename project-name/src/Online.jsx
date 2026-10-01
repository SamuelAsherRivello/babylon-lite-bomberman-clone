import { useEffect, useRef, useState } from 'react';
import { MultiplayerClient } from '@rmc/multiplayer-client';
import { ReconciledView } from './game/prediction.js';
import { createGameRenderer } from './content/renderer.js';
import { createControls } from './input/controls.js';
import { createGame } from './game/rules.js';
import versionText from '../../version.txt?raw';

export const SERVER = import.meta.env.VITE_MULTIPLAYER_SERVER || 'https://rmc-colyseus-multiplayer-server.vercel.app';
const COLORS = ['Mint', 'Amber', 'Violet', 'Rose'];

export function Online({ onExit }) {
  const canvas=useRef(null),client=useRef(null),controls=useRef(null),view=useRef(new ReconciledView()),menu=useRef(false);
  const [session,setSession]=useState({status:'idle'}),[code,setCode]=useState(()=>new URLSearchParams(window.location.search).get('room')?.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6)||''),[rendererError,setRendererError]=useState(''),[settings,setSettings]=useState(false);
  useEffect(()=>{
    let cancelled=false,renderer,frame,last=0,accumulator=0,sendElapsed=0,seq=0,pendingBomb=false;
    const input=createControls();controls.current=input;let inputEpoch=input.epoch;
    const loop=now=>{
      if(cancelled)return;
      const dt=Math.min((now-last)/1000,.1);last=now;accumulator+=dt;sendElapsed+=dt;
      const c=client.current,id=c?.state.sessionId;
      while(accumulator>=1/60){
        if(inputEpoch!==input.epoch){pendingBomb=false;inputEpoch=input.epoch;}
        const active=c?.state.status==='connected'&&!menu.current;
        const read=input.read();const command=active?read:{x:0,y:0,bomb:false};
        if(!active)pendingBomb=false;
        pendingBomb ||= command.bomb;
        if(c?.state.status==='connected')view.current.advance(id,command,seq);
        if(sendElapsed>=.05&&c?.state.status==='connected'){
          c.send('input',{...command,bomb:pendingBomb,seq});seq++;pendingBomb=false;sendElapsed=0;
        }
        accumulator-=1/60;
      }
      renderer.draw(view.current.draw(id,dt)||createGame([]));
      frame=requestAnimationFrame(loop);
    };
    createGameRenderer(canvas.current).then(r=>{renderer=r;if(cancelled){r.dispose();return;}last=performance.now();frame=requestAnimationFrame(loop);}).catch(e=>{if(!cancelled)setRendererError(e.message);});
    return()=>{cancelled=true;cancelAnimationFrame(frame);input.dispose();renderer?.dispose();client.current?.disconnect();controls.current=null;};
  },[]);
  const connect=options=>{
    client.current?.disconnect();view.current=new ReconciledView();controls.current?.clear();
    const c=new MultiplayerClient(SERVER,'bomberman',options);client.current=c;
    c.subscribe((s,event)=>{
      if(client.current!==c)return;
      if(s.gameState&&['snapshot','gameState'].includes(event))view.current.accept(s.gameState,s.sessionId);
      setSession({...s});
    });void c.connect();
  };
  const toggleSettings=()=>{menu.current=!menu.current;controls.current?.clear();setSettings(menu.current);};
  const touch=(action,label)=><button aria-label={label} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controls.current?.touch(e.pointerId,action);}} onPointerUp={e=>controls.current?.release(e.pointerId)} onPointerCancel={e=>controls.current?.release(e.pointerId)} onLostPointerCapture={e=>controls.current?.release(e.pointerId)}>{label}</button>;
  const g=session.gameState,me=g?.people.find(p=>p.id===session.sessionId),actor=g?.players.find(p=>p.id===session.sessionId);
  return <main className="surface"><div className="viewport">
    <canvas ref={canvas} aria-label="Online Bomberman arena"/>
    <header className="corner corner_top_left"><span className="eyebrow">ARCADE / ONLINE BATTLE</span><h1>Bomberman Clone</h1></header>
    <nav className="corner corner_top_right"><button onClick={onExit}>Local practice</button><a href="https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    {g&&<div className="hud"><span>ROOM {g.code} · ROUND {g.round}</span><span>{g.phase==='playing'?`${Math.ceil(g.remaining)}s · ${actor?.alive?'ALIVE':'SPECTATING'}`:g.phase.toUpperCase()}</span></div>}
    {rendererError&&<div className="overlay" role="alert"><h2>Renderer unavailable</h2><p>{rendererError}</p></div>}
    {!rendererError&&(!g||session.status!=='connected')&&<div className="overlay"><h2>Battle with friends</h2><p role="status">{session.error||'Create a private room or enter your friend’s code.'}</p><label>Room code <input aria-label="Room code" value={code} maxLength={6} onChange={e=>setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))}/></label><button disabled={code.length!==6} onClick={()=>connect({code})}>Join room</button><button onClick={()=>connect({create:true})}>Create room</button>{session.status==='reconnecting'&&session.sessionId&&g&&<p>Your character remains vulnerable during recovery.</p>}</div>}
    {!rendererError&&session.status==='connected'&&g?.phase==='lobby'&&<div className="overlay"><h2>Room {g.code}</h2><p>Share this code. Two to four players; everyone readies up.</p><ul>{g.people.map(p=><li key={p.id}>{p.name} · {COLORS[p.color]} · {p.connected?(p.ready?'Ready':'Waiting'):'Reconnecting'} · {p.score} wins</li>)}</ul><div>{COLORS.map((color,n)=><button key={color} disabled={g.people.some(p=>p.id!==me?.id&&p.color===n)} aria-pressed={me?.color===n} onClick={()=>client.current?.send('color',n)}>{color}</button>)}</div><button onClick={()=>client.current?.send('ready')}>{me?.ready?'Cancel ready':'Ready up'}</button></div>}
    {session.status==='connected'&&g?.phase==='countdown'&&<div className="overlay"><h2>{Math.ceil(g.remaining)}</h2><p>Place your bomb. Find your escape.</p></div>}
    {session.status==='connected'&&g?.phase==='results'&&<div className="overlay"><h2>{g.winner?`${g.people.find(p=>p.id===g.winner)?.name||'Player'} wins!`:'Draw!'}</h2><p>Returning to the lobby…</p></div>}
    {settings&&session.status==='connected'&&<div className="overlay"><h2>Settings</h2><p>The online battle continues while this menu is open.</p><button onClick={toggleSettings}>Resume</button><button onClick={()=>document.documentElement.requestFullscreen()?.catch(()=>{})}>Fullscreen</button></div>}
    <div className="instructions">MOVE <kbd>WASD</kbd> / <kbd>↑↓←→</kbd> · BOMB <kbd>SPACE</kbd><span>Place. Escape. Outlast.</span></div>
    <div className="touch-controls"><div className="pad">{touch('up','↑')}{touch('left','←')}{touch('down','↓')}{touch('right','→')}</div><div className="bomb-control">{touch('bomb','BOMB')}</div></div>
    <section className="corner corner_bottom_left"><button onClick={toggleSettings}>⚙ Settings</button></section>
    <footer className="corner corner_bottom_right">v{versionText.trim().replace(/^version=/,'')}<span>ONLINE MULTIPLAYER</span></footer>
  </div></main>;
}
