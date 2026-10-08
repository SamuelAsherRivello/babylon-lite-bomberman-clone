export class DeathView {
  constructor() {
    this.reset();
  }
  reset() {
    this.key = null;
    this.wasAlive = false;
    this.result = false;
    this.snapshot = null;
    this.until = 0;
  }
  draw(state, id, now) {
    const key = `${state.match || 0}:${state.round || 0}`;
    if (key !== this.key) {
      this.reset();
      this.key = key;
    }
    const alive = state.players.find((p) => p.id === id)?.alive;
    const result = ['results', 'matchResults'].includes(state.phase);
    if ((this.wasAlive && alive === false) || (!this.result && result)) {
      this.snapshot = structuredClone(state);
      this.snapshot.presentationTime = now / 1000;
      this.until = now + 3000;
    }
    this.wasAlive = alive;
    this.result = result;
    return now < this.until ? this.snapshot : state;
  }
  frozen(now) {
    return now < this.until;
  }
}
