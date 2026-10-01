import { enableErrorDecoding, createEngine, loadTexture2D, createGridSpriteAtlas, createSprite2DLayer, addSprite2D, updateSprite2D, createSpriteRenderer, registerSpriteRenderer, startEngine, disposeEngine, disposeSpriteRenderer, releaseTexture } from '@babylonjs/lite';
import { getInitializationMessage } from './initialization.js';
export const LOGICAL = { width: 240, height: 208 };
export function presentation(width, height, dpr = 1) {
  const fit = Math.min(width / LOGICAL.width, height / LOGICAL.height);
  const scale = fit >= 1 ? Math.floor(fit) : fit;
  return { scale, unit: scale * dpr, x: (width - LOGICAL.width * scale) / 2 * dpr, y: (height - LOGICAL.height * scale) / 2 * dpr };
}
import { atlasUrl, ATLAS_COLUMNS, ATLAS_ROWS, ACTOR_FRAME } from './art.js';
const initializations = new WeakMap();
export function createGameRenderer(canvas) {
  const previous = initializations.get(canvas);
  const next = (previous || Promise.resolve()).catch(() => null).then(old => {
    old?.dispose(); return initializeRenderer(canvas);
  });
  initializations.set(canvas, next); return next;
}
async function initializeRenderer(canvas) {
  enableErrorDecoding(); let engine,texture,atlas,renderer;
  let disposed=false; const dispose=()=>{if(disposed)return;disposed=true;if(renderer)disposeSpriteRenderer(renderer);if(texture)releaseTexture(texture);if(engine)disposeEngine(engine);};
  try {
    if(!navigator.gpu)throw new Error('WebGPU is required. Use a compatible device and WebGPU-enabled browser.');
    engine=await createEngine(canvas,{msaaSamples:1});
    texture=await loadTexture2D(engine,atlasUrl(),{invertY:false,minFilter:'nearest',magFilter:'nearest',mipMaps:false,addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
    atlas=createGridSpriteAtlas(texture,{cellWidthPx:16,cellHeightPx:16,columns:ATLAS_COLUMNS,rows:ATLAS_ROWS,pivot:[.5,.5]});
    const layer=createSprite2DLayer(atlas,{pivot:[.5,.5]});
    const sprites=Array.from({length:500},()=>addSprite2D(layer,{positionPx:[-100,-100],sizePx:[16,16],frame:0}));
    renderer=createSpriteRenderer(engine,{layers:[layer],clear:true,clearValue:{r:.055,g:.075,b:.1,a:1}});
    registerSpriteRenderer(renderer);await startEngine(engine);
    const actors=new Map();let round=null;const particles=[];
    return{dispose,draw(g){
      const now=performance.now()/1000;
      if(g.round!==round){actors.clear();particles.length=0;round=g.round;}
      const map=presentation(canvas.clientWidth,canvas.clientHeight,window.devicePixelRatio||1);let used=0;
      const put=(x,y,frame,size=16)=>{if(used>=sprites.length)return;updateSprite2D(sprites[used++],{visible:true,positionPx:[map.x+x*16*map.unit,map.y+y*16*map.unit],sizePx:[size*map.unit,size*map.unit],frame});};
      const closed=new Set(g.closed||[]);
      for(let y=0;y<13;y++)for(let x=0;x<15;x++)put(x+.5,y+.5,closed.has(y*15+x)?14:g.board[y*15+x]);
      for(const item of g.powerups||[])put(item.cell%15+.5,Math.floor(item.cell/15)+.5,10+['bomb','range','speed'].indexOf(item.type),14+Math.sin(now*4));
      if(Math.floor(now*6)%2===0)for(const i of (g.warnings||[]).flatMap(w=>w.cells))put(i%15+.5,Math.floor(i/15)+.5,13);
      for(const b of g.bombs)put(b.x+.5,b.y+.5,3,Math.sin(g.time*10)>0?16:15);
      for(const b of g.pendingBombs||[])put(b.x+.5,b.y+.5,9);
      for(const i of new Set(g.blasts.flatMap(b=>b.cells)))put(i%15+.5,Math.floor(i/15)+.5,4);
      g.players.forEach((p,n)=>{
        const before=actors.get(p.id),dx=p.x-(before?.x??p.x),dy=p.y-(before?.y??p.y);
        const moving=Math.hypot(dx,dy)>.0001;
        const direction=moving?(Math.abs(dx)>Math.abs(dy)?(dx<0?2:3):(dy<0?1:0)):(before?.direction??0);
        if(before?.alive&&!p.alive)for(let k=0;k<8;k++)particles.push({x:p.x,y:p.y,angle:k*Math.PI/4,until:now+.5});
        actors.set(p.id,{x:p.x,y:p.y,alive:p.alive,direction});
        if(p.alive)put(p.x,p.y,ACTOR_FRAME+(p.color??n)*12+direction*3+(moving?1+Math.floor(now*8)%2:0));
      });
      while(particles.length>32)particles.shift();
      for(let n=particles.length-1;n>=0;n--){const p=particles[n];if(p.until<=now){particles.splice(n,1);continue;}const distance=(.5-(p.until-now))*1.8;put(p.x+Math.cos(p.angle)*distance,p.y+Math.sin(p.angle)*distance,15,5);}
      for(let n=used;n<sprites.length;n++)updateSprite2D(sprites[n],{visible:false});
      return map;
    }};
  }catch(error){dispose();console.error('Game graphics initialization failed:',error);throw new Error(getInitializationMessage(Boolean(navigator.gpu),error));}
}


