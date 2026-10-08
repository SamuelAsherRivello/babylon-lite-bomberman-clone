const tune = [72, 76, 79, 76, 74, 77, 81, 77, 71, 74, 79, 74, 69, 72, 76, 79];
const effects = {
  placement: [190, 130, 0.07],
  explosion: [75, 30, 0.22],
  block: [310, 90, 0.08],
  pickup: [520, 1040, 0.16],
  elimination: [420, 90, 0.25],
  countdown: [660, 660, 0.09],
  warning: [880, 440, 0.13],
  victory: [520, 1040, 0.3],
};
const frequency = (note) => 440 * 2 ** ((note - 69) / 12);

export class ArcadeAudio {
  constructor() {
    this.forcedMute = new URLSearchParams(location.search).get('mute') === '1';
    this.muted = this.forcedMute;
    this.volume = 0.25;
    this.nodes = new Set();
    this.activate = () => {
      if (this.forcedMute || this.muted) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context ||= new AudioContext();
      if (!this.master) {
        this.master = this.context.createGain();
        this.master.connect(this.context.destination);
        this.set(this.muted, this.volume);
      }
      void this.context.resume().catch(() => {});
    };
    window.addEventListener('pointerdown', this.activate);
    window.addEventListener('keydown', this.activate);
    this.music = setInterval(() => {
      if (!this.playing || document.hidden || this.context?.state !== 'running' || this.muted)
        return;
      const step = this.note++ % tune.length;
      this.tone(frequency(tune[step]), frequency(tune[step]), 0.12, 0.035, 'triangle');
      if (step % 2 === 0)
        this.tone(
          frequency([48, 50, 47, 45][Math.floor(step / 4)]),
          frequency([48, 50, 47, 45][Math.floor(step / 4)]),
          0.16,
          0.035,
          'sine',
        );
    }, 160);
    this.note = 0;
  }
  set(muted, volume) {
    this.muted = this.forcedMute || muted;
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.master) {
      const t = this.context.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, t, 0.015);
    }
  }
  tone(start, end, duration, strength = 0.12, type = 'square') {
    if (this.muted || this.context?.state !== 'running' || this.nodes.size >= 32) return;
    const ctx = this.context,
      t = ctx.currentTime,
      o = ctx.createOscillator(),
      gain = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(start, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, end), t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(strength, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(gain);
    gain.connect(this.master);
    this.nodes.add(o);
    o.onended = () => {
      o.disconnect();
      gain.disconnect();
      this.nodes.delete(o);
    };
    o.start(t);
    o.stop(t + duration + 0.01);
  }
  effect(name) {
    const [start, end, duration] = effects[name];
    this.tone(start, end, duration);
  }
  observe(g) {
    if (!g) return;
    const previous = this.previous;
    this.playing = !g.paused && (g.phase ? g.phase === 'playing' : g.players.some((p) => p.alive));
    if (previous && previous.round === g.round && previous.match === g.match) {
      if (g.bombs.some((b) => !previous.bombs.some((old) => old.id === b.id)))
        this.effect('placement');
      if (g.blasts.some((b) => !previous.blasts.some((old) => old.id === b.id)))
        this.effect('explosion');
      if (g.board.some((tile, i) => previous.board[i] === 2 && tile === 0)) this.effect('block');
      for (const p of g.players) {
        const old = previous.players.find((q) => q.id === p.id);
        if (!old) continue;
        if (old.alive && !p.alive) this.effect('elimination');
        if (p.capacity > old.capacity || p.range > old.range || p.speed > old.speed)
          this.effect('pickup');
      }
      if (
        (g.warnings || []).some(
          (w) => !(previous.warnings || []).some((old) => old.closeTick === w.closeTick),
        )
      )
        this.effect('warning');
      if (
        g.phase === 'countdown' &&
        (previous.phase !== 'countdown' || Math.ceil(g.remaining) !== Math.ceil(previous.remaining))
      )
        this.effect('countdown');
      if (['results', 'matchResults'].includes(g.phase) && g.phase !== previous.phase)
        this.effect('victory');
    }
    this.previous = structuredClone(g);
  }
  dispose() {
    clearInterval(this.music);
    window.removeEventListener('pointerdown', this.activate);
    window.removeEventListener('keydown', this.activate);
    for (const node of this.nodes) {
      try {
        node.stop();
      } catch {
        /* already stopped */
      }
    }
    this.nodes.clear();
    this.master?.disconnect();
    void this.context?.close().catch(() => {});
    this.previous = null;
  }
}
