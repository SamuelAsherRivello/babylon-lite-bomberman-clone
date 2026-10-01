import { enableErrorDecoding, createEngine, loadTexture2D, createGridSpriteAtlas, createSprite2DLayer, addSprite2D, updateSprite2D, createSpriteRenderer, registerSpriteRenderer, startEngine, disposeEngine, disposeSpriteRenderer, disposeSpriteAtlas, releaseTexture } from '@babylonjs/lite';
export const LOGICAL = { width: 320, height: 272 };
export function presentation(width, height, dpr = 1) {
  const fit = Math.min(width / LOGICAL.width, height / LOGICAL.height);
  const scale = fit >= 1 ? Math.floor(fit) : fit;
  return { scale, unit: scale * dpr, x: (width - LOGICAL.width * scale) / 2 * dpr, y: (height - LOGICAL.height * scale) / 2 * dpr };
}
// Original code-authored pixel textures. Canvas authors the atlas only;
// Babylon Lite/WebGPU renders the game.
function atlasUrl() {
  const c=document.createElement('canvas');c.width=160;c.height=16;const ctx=c.getContext('2d');
  const rect=(f,x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(f*16+x,y,w,h);};
  rect(0,0,0,16,16,'#243f3b');rect(0,1,1,14,14,'#2c4b42');rect(0,3,4,2,1,'#365b49');
  rect(1,0,0,16,16,'#18232d');rect(1,1,1,14,13,'#627184');rect(1,2,2,12,2,'#a2b1b8');rect(1,2,7,12,1,'#374351');rect(1,7,3,1,4,'#374351');
  rect(2,0,0,16,16,'#3c2933');rect(2,1,1,14,14,'#ab6652');for(let y=1;y<15;y+=5){rect(2,1,y,14,1,'#e09b65');rect(2,5,y,1,5,'#553843');}
  rect(3,3,5,10,9,'#101827');rect(3,2,7,12,5,'#101827');rect(3,4,5,4,2,'#526174');rect(3,7,2,2,4,'#cda263');rect(3,9,1,3,2,'#fff0a0');
  rect(4,4,0,8,16,'#ff623a');rect(4,0,4,16,8,'#ff623a');rect(4,6,0,4,16,'#ffce69');rect(4,0,6,16,4,'#ffce69');rect(4,6,6,4,4,'#fff5c2');
  ['#79ded0','#fbad69','#b69bff','#ff7fa4'].forEach((color,n)=>{const f=n+5;rect(f,4,1,8,8,color);rect(f,3,3,10,6,color);rect(f,4,4,8,4,'#182736');rect(f,5,5,2,2,'#fff1cc');rect(f,9,5,2,2,'#fff1cc');rect(f,4,10,8,4,color);rect(f,2,10,2,3,'#f7e8c1');rect(f,12,10,2,3,'#f7e8c1');rect(f,3,14,4,2,'#172231');rect(f,9,14,4,2,'#172231');});
  for(let n=3;n<13;n+=3){rect(9,n,2,2,1,'#f7dc9a');rect(9,n,13,2,1,'#f7dc9a');rect(9,2,n,1,2,'#f7dc9a');rect(9,13,n,1,2,'#f7dc9a');}
  return c.toDataURL();
}
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
  let disposed=false; const dispose=()=>{if(disposed)return;disposed=true;if(renderer)disposeSpriteRenderer(renderer);if(atlas)disposeSpriteAtlas(atlas);if(texture)releaseTexture(texture);if(engine)disposeEngine(engine);};
  try {
    if(!navigator.gpu)throw new Error('WebGPU is required. Use a compatible device and WebGPU-enabled browser.');
    engine=await createEngine(canvas,{msaaSamples:1});
    texture=await loadTexture2D(engine,atlasUrl(),{minFilter:'nearest',magFilter:'nearest',mipMaps:false,addressModeU:'clamp-to-edge',addressModeV:'clamp-to-edge'});
    atlas=createGridSpriteAtlas(texture,{cellWidthPx:16,cellHeightPx:16,columns:10,rows:1,pivot:[.5,.5]});
    const layer=createSprite2DLayer(atlas,{pivot:[.5,.5]});
    const sprites=Array.from({length:500},()=>addSprite2D(layer,{positionPx:[-100,-100],sizePx:[16,16],frame:0}));
    renderer=createSpriteRenderer(engine,{layers:[layer],clear:true,clearValue:{r:.055,g:.075,b:.1,a:1}});
    registerSpriteRenderer(renderer);await startEngine(engine);
    return{dispose,draw(g){
      const map=presentation(canvas.clientWidth,canvas.clientHeight,window.devicePixelRatio||1);let used=0;
      const put=(x,y,frame,size=16)=>{if(used>=sprites.length)return;updateSprite2D(sprites[used++],{visible:true,positionPx:[map.x+(40+x*16)*map.unit,map.y+(32+y*16)*map.unit],sizePx:[size*map.unit,size*map.unit],frame});};
      for(let y=0;y<13;y++)for(let x=0;x<15;x++)put(x+.5,y+.5,g.board[y*15+x]);
      for(const b of g.bombs)put(b.x+.5,b.y+.5,3,Math.sin(g.time*10)>0?16:15);
      for(const b of g.pendingBombs||[])put(b.x+.5,b.y+.5,9);
      for(const i of new Set(g.blasts.flatMap(b=>b.cells)))put(i%15+.5,Math.floor(i/15)+.5,4);
      g.players.forEach((p,n)=>{if(p.alive)put(p.x,p.y,(p.color??n)+5);});
      for(let n=used;n<sprites.length;n++)updateSprite2D(sprites[n],{visible:false});
      return map;
    }};
  }catch(error){dispose();throw error;}
}


