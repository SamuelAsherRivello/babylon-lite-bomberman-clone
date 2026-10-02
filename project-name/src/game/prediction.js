import { stepGame } from '@rmc/multiplayer-client/bomberman';

export function predictMovement(state, id, input) {
  const snapshot = structuredClone(state);
  const player = snapshot.players.find(p => p.id === id);
  if (!player?.alive) return player;
  // Only position comes back from prediction. Damage, explosions and outcomes
  // always remain those in the authoritative snapshot.
  stepGame(snapshot, { [id]: { x: input.x, y: input.y, bomb: false } });
  return snapshot.players.find(p => p.id === id);
}

export class ReconciledView {
  constructor(now = () => performance.now() / 1000) {
    this.now = now; this.pending = []; this.ghosts = []; this.positions = new Map();
    this.offset = { x: 0, y: 0 }; this.velocity = { x: 0, y: 0 }; this.round = null;
    this.clockOffset = Infinity; this.renderTime = -Infinity;
  }
  accept(state, localId) {
    const previous = this.state?.players.find(p => p.id === localId);
    const reset = state.round !== this.round || state.phase !== 'playing';
    this.round = state.round;
    this.state = structuredClone(state);
    const local = this.state.players.find(p => p.id === localId);
    if (reset) {
      this.pending = []; this.ghosts = []; this.positions.clear();
      this.offset = { x: 0, y: 0 }; this.velocity = { x: 0, y: 0 };
      this.clockOffset = Infinity; this.renderTime = -Infinity;
    }
    const received = this.now();
    const time = Number.isFinite(state.serverTick) ? state.serverTick / 60 : received;
    this.clockOffset = Math.min(this.clockOffset, received - time);
    for (const p of state.players) {
      if (p.id === localId) continue;
      const samples = this.positions.get(p.id) || [];
      if (samples.length && time < samples.at(-1).time) continue;
      if (samples.length && time === samples.at(-1).time) samples.pop();
      samples.push({ time, x: p.x, y: p.y });
      if (samples.length > 24) samples.shift();
      this.positions.set(p.id, samples);
    }
    const liveBombs=new Set();
    for(const bomb of state.bombs){
      const key=`bomb:${bomb.id}`;liveBombs.add(key);
      const samples=this.positions.get(key)||[];
      samples.push({time,x:bomb.slideX??bomb.x+.5,y:bomb.slideY??bomb.y+.5});
      if(samples.length>24)samples.shift();this.positions.set(key,samples);
    }
    for(const key of this.positions.keys())if(key.startsWith('bomb:')&&!liveBombs.has(key))this.positions.delete(key);
    if (local) {
      this.pending = this.pending.filter(frame => frame.seq > local.ack);
      this.ghosts = this.ghosts.filter(b => b.seq > local.ack && !state.bombs.some(q=>q.x===b.x&&q.y===b.y));
      for (const frame of this.pending) {
        const predicted = predictMovement(this.state, localId, frame);
        if (predicted) { local.x = predicted.x; local.y = predicted.y; }
      }
      if (previous && !reset && local.alive) {
        const dx = previous.x + this.offset.x - local.x, dy = previous.y + this.offset.y - local.y;
        this.offset = Math.hypot(dx, dy) < .8 ? { x: dx, y: dy } : { x: 0, y: 0 };
        if (Math.hypot(dx, dy) >= .8) this.velocity = { x: 0, y: 0 };
      }
      if (!local.alive) { this.offset = { x: 0, y: 0 }; this.velocity = { x: 0, y: 0 }; }
    }
  }
  advance(localId, input, seq) {
    if (!this.state || this.state.phase !== 'playing') return;
    const local = this.state.players.find(p => p.id === localId);
    if (!local?.alive) return;
    if(input.bomb){const x=Math.floor(local.x),y=Math.floor(local.y);if(!this.state.board[y*(this.state.width||15)+x]&&!this.state.bombs.some(b=>b.x===x&&b.y===y)&&!this.ghosts.some(b=>b.x===x&&b.y===y))this.ghosts.push({x,y,seq,until:performance.now()+600});}
    const predicted = predictMovement(this.state, localId, input);
    local.x = predicted.x; local.y = predicted.y;
    this.pending.push({ x: input.x, y: input.y, seq });
    if (this.pending.length > 120) this.pending.shift();
  }
  draw(localId, dt) {
    if (!this.state) return null;
    const state = structuredClone(this.state);
    this.ghosts=this.ghosts.filter(b=>b.until>performance.now());state.pendingBombs=this.ghosts;
    // Critically damped corrections preserve position and correction velocity
    // across acknowledgements. Prediction itself still responds immediately.
    const elapsed = Math.max(0, Math.min(dt, .1));
    const omega = 24, decay = Math.exp(-omega * elapsed);
    for (const axis of ['x', 'y']) {
      const temp = (this.velocity[axis] + omega * this.offset[axis]) * elapsed;
      this.velocity[axis] = (this.velocity[axis] - omega * temp) * decay;
      this.offset[axis] = (this.offset[axis] + temp) * decay;
    }
    // Render 100ms behind the estimated server clock, so uneven packet arrival
    // usually leaves two snapshots to interpolate rather than chase.
    this.renderTime = Math.max(this.renderTime, this.now() - this.clockOffset - .1);
    for (const p of state.players) {
      if (p.id === localId) { p.x += this.offset.x; p.y += this.offset.y; }
      else {
        const samples = this.positions.get(p.id);
        if (!samples?.length || !p.alive) continue;
        while (samples.length > 2 && samples[1].time <= this.renderTime) samples.shift();
        const a = samples[0], b = samples[1] || a;
        const span = b.time - a.time;
        // Hold after the newest snapshot: no invented movement through walls.
        const t = span > 0 ? Math.max(0, Math.min(1, (this.renderTime - a.time) / span)) : 0;
        p.x = a.x + (b.x - a.x) * t; p.y = a.y + (b.y - a.y) * t;
      }
    }
    for(const bomb of state.bombs)if(bomb.sliding){
      const samples=this.positions.get(`bomb:${bomb.id}`);if(!samples?.length)continue;
      while(samples.length>2&&samples[1].time<=this.renderTime)samples.shift();
      const a=samples[0],b=samples[1]||a,t=b.time>a.time?Math.max(0,Math.min(1,(this.renderTime-a.time)/(b.time-a.time))):0;
      bomb.slideX=a.x+(b.x-a.x)*t;bomb.slideY=a.y+(b.y-a.y)*t;
    }
    return state;
  }
}
