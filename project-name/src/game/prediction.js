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
  constructor() { this.pending = []; this.ghosts = []; this.positions = new Map(); this.offset = { x: 0, y: 0 }; this.round = null; }
  accept(state, localId) {
    const previous = this.state?.players.find(p => p.id === localId);
    const reset = state.round !== this.round || state.phase !== 'playing';
    this.round = state.round;
    this.state = structuredClone(state);
    const local = this.state.players.find(p => p.id === localId);
    if (reset) { this.pending = []; this.ghosts = []; this.positions.clear(); this.offset = { x: 0, y: 0 }; }
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
      }
    }
  }
  advance(localId, input, seq) {
    if (!this.state || this.state.phase !== 'playing') return;
    const local = this.state.players.find(p => p.id === localId);
    if (!local?.alive) return;
    if(input.bomb){const x=Math.floor(local.x),y=Math.floor(local.y);if(!this.state.board[y*15+x]&&!this.state.bombs.some(b=>b.x===x&&b.y===y)&&!this.ghosts.some(b=>b.x===x&&b.y===y))this.ghosts.push({x,y,seq,until:performance.now()+600});}
    const predicted = predictMovement(this.state, localId, input);
    local.x = predicted.x; local.y = predicted.y;
    this.pending.push({ x: input.x, y: input.y, seq });
    if (this.pending.length > 120) this.pending.shift();
  }
  draw(localId, dt) {
    if (!this.state) return null;
    const state = structuredClone(this.state);
    this.ghosts=this.ghosts.filter(b=>b.until>performance.now());state.pendingBombs=this.ghosts;
    const blend = 1 - Math.exp(-dt * 18);
    this.offset.x *= Math.exp(-dt * 15); this.offset.y *= Math.exp(-dt * 15);
    for (const p of state.players) {
      if (p.id === localId) { p.x += this.offset.x; p.y += this.offset.y; }
      else {
        const old = this.positions.get(p.id) || { x: p.x, y: p.y };
        old.x += (p.x - old.x) * blend; old.y += (p.y - old.y) * blend;
        this.positions.set(p.id, old); p.x = old.x; p.y = old.y;
      }
    }
    return state;
  }
}
