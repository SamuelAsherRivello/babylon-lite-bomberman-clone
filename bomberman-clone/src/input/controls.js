export function createControls() {
  const keys = new Set(), touches = new Map(); let bomb = false, epoch = 0;
  const actions = { ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',' ':'bomb' };
  const clear = () => { keys.clear(); touches.clear(); bomb=false; epoch++; };
  const actionFor=e=>actions[e.key.length===1?e.key.toLowerCase():e.key];
  const down = e => { if(e.target.closest?.('input,textarea,select'))return;const action=actionFor(e);if(action){e.preventDefault();keys.add(action);if(action==='bomb'&&!e.repeat)bomb=true;} };
  const up = e => { const action=actionFor(e);if(action){e.preventDefault();keys.delete(action);} };
  const pageHide=()=>clear(),visibilityChange=()=>{if(document.hidden)clear();};
  window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);window.addEventListener('pagehide',pageHide);document.addEventListener('visibilitychange',visibilityChange);
  return { clear, get epoch(){return epoch;}, touch(id,action){touches.set(id,action);if(action==='bomb')bomb=true;}, release(id){touches.delete(id);}, read(){const all=new Set([...keys,...touches.values()]);const pending=bomb;bomb=false;return{x:Number(all.has('right'))-Number(all.has('left')),y:Number(all.has('down'))-Number(all.has('up')),bomb:pending};}, dispose(){clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);window.removeEventListener('pagehide',pageHide);document.removeEventListener('visibilitychange',visibilityChange);} };
}

export function createGestureHandlers(controlsRef) {
  const active = new Map();
  const release = (event) => { active.delete(event.pointerId); controlsRef.current?.release(event.pointerId); };
  return {
    arena: {
      onPointerDown(event) {
        if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
        event.currentTarget.setPointerCapture(event.pointerId);
        controlsRef.current?.touch(event.pointerId, 'bomb');
      },
      onPointerUp: release,
      onPointerCancel: release,
      onLostPointerCapture: release,
    },
    panel: {
      onPointerDown(event) {
        if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
        event.currentTarget.setPointerCapture(event.pointerId);
        active.set(event.pointerId, { x: event.clientX, y: event.clientY, action: null, epoch: controlsRef.current?.epoch });
      },
      onPointerMove(event) {
        const point = active.get(event.pointerId);
        if (!point) return;
        if (point.epoch !== controlsRef.current?.epoch) { active.delete(event.pointerId); return; }
        const dx = event.clientX - point.x, dy = event.clientY - point.y;
        if (!point.action && Math.hypot(dx, dy) >= 14) {
          point.action = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
        }
        if (point.action) { event.preventDefault(); controlsRef.current?.touch(event.pointerId, point.action); }
      },
      onPointerUp: release,
      onPointerCancel: release,
      onLostPointerCapture: release,
    },
    dispose(){active.clear();}
  };
}
