// ─────────────────────────────────────────────
// Audio Engine — Web Audio API synthesizer
// ─────────────────────────────────────────────

/**
 * Generates game sound effects using the Web Audio API.
 * Synthesizes sounds in real-time with Safari/WebKit compatibility.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private _muted = false;

  get muted(): boolean {
    return this._muted;
  }

  /** Master volume multiplier (0.0 to 1.0) */
  private volume = 1.0;

  /** Set master volume */
  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /** Toggle mute state */
  toggleMute(): boolean {
    this._muted = !this._muted;
    return this._muted;
  }

  /** Lazy-init AudioContext */
  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    return this.ctx;
  }

  /** Resume audio context (called on user interaction) */
  unlock(): void {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
    } catch {
      // AudioContext not supported
    }
  }

  /** Play a single tone */
  private playTone(freq: number, type: OscillatorType, duration: number, volume = 0.25): void {
    if (this._muted) return;
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      const targetVol = Math.max(0.001, volume * this.volume);
      gain.gain.setValueAtTime(targetVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio playback failed — silently ignore
    }
  }

  /** Gem swap sound */
  playSwap(): void {
    this.playTone(520, 'sine', 0.12, 0.22);
    this.playTone(660, 'sine', 0.12, 0.18);
  }

  /** Match found sound (pitch increases with combo) */
  playMatch(combo: number): void {
    const base = 440 + Math.min(combo, 8) * 80;
    this.playTone(base, 'sine', 0.22, 0.28);
    setTimeout(() => this.playTone(base * 1.25, 'sine', 0.2, 0.22), 60);
    setTimeout(() => this.playTone(base * 1.5, 'triangle', 0.25, 0.18), 120);
  }

  /** Gem drop sound */
  playDrop(): void {
    this.playTone(320, 'sine', 0.08, 0.16);
  }

  /** Invalid swap sound */
  playNoMatch(): void {
    this.playTone(220, 'sawtooth', 0.14, 0.18);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.16, 0.16), 60);
  }

  /** Combo celebration sound */
  playCombo(level: number): void {
    const base = 600 + Math.min(level, 6) * 100;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playTone(base + i * 120, 'sine', 0.14, 0.22), i * 50);
    }
  }

  /** Game over sound (descending notes) */
  playGameOver(): void {
    const notes = [440, 392, 349, 330];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.35, 0.25), i * 180);
    });
  }
}
