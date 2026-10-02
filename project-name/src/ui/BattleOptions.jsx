import { atlasUrl, ATLAS_COLUMNS, ATLAS_ROWS } from '../content/art.js';
import { useMemo } from 'react';
export function BattleOptions({options,onChange,disabled=false,bombFlash,onBombFlash}) {
 return <div className="battle-options">
  <label>CPU: <select aria-label="CPU difficulty" value={options.cpu} disabled={disabled} onChange={e=>onChange({cpu:e.target.value})}>{['LOW','MED','HARD'].map(v=><option key={v}>{v}</option>)}</select></label>
  <label>MAP: <select aria-label="Map size" value={options.map} disabled={disabled} onChange={e=>onChange({map:e.target.value})}>{['LOW','MED','HIGH'].map(v=><option key={v}>{v}</option>)}</select></label>
  <label><input type="checkbox" checked={options.plant} disabled={disabled} onChange={e=>onChange({plant:e.target.checked})}/> Plant: {options.plant?'ON':'OFF'}</label>
  <label><input type="checkbox" checked={bombFlash} onChange={e=>onBombFlash(e.target.checked)}/> Bomb Flash: {bombFlash?'ON':'OFF'}</label>
 </div>;
}
export function PowerupLegend(){
 const url=useMemo(()=>atlasUrl(),[]);
 return <div className="powerup-legend" aria-label="Power-up meanings">{[[10,'Bomb','One extra bomb; maximum five'],[11,'Range','Longer blast; maximum eight'],[12,'Speed','15% faster; maximum three'],[5,'Glove','Push bombs until they hit an obstacle; lasts this life'],[6,'Lightning','Invulnerable for ten seconds']].map(([frame,name,meaning])=><div key={name}><span className="pickup-icon" style={{backgroundImage:`url(${url})`,backgroundSize:`${ATLAS_COLUMNS*24}px ${ATLAS_ROWS*24}px`,backgroundPosition:`-${frame%ATLAS_COLUMNS*24}px -${Math.floor(frame/ATLAS_COLUMNS)*24}px`}}/><span><strong>{name}</strong> {meaning}</span></div>)}</div>;
}
