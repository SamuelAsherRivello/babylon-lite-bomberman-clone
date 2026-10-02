export function createControls() {
  const keys = new Set(), touches = new Map(); let bomb = false, epoch = 0;
  const actions = { ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',' ':'bomb' };
  const clear = () => { keys.clear(); touches.clear(); bomb=false; epoch++; };
  const actionFor=e=>actions[e.key.length===1?e.key.toLowerCase():e.key];
  const down = e => { if(e.target.closest?.('input,textarea,select'))return;const action=actionFor(e);if(action){e.preventDefault();keys.add(action);if(action==='bomb'&&!e.repeat)bomb=true;} };
  const up = e => { const action=actionFor(e);if(action){e.preventDefault();keys.delete(action);} };
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);
  return { clear, get epoch(){return epoch;}, touch(id,action){touches.set(id,action);if(action==='bomb')bomb=true;}, release(id){touches.delete(id);}, read(){const all=new Set([...keys,...touches.values()]);const pending=bomb;bomb=false;return{x:Number(all.has('right'))-Number(all.has('left')),y:Number(all.has('down'))-Number(all.has('up')),bomb:pending};}, dispose(){clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);} };
}
