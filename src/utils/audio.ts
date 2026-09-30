// Web Audio API based Synthesizer for F1 sound effects & F1 Theme Soundtrack

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private f1ThemeInterval: number | null = null;
  public isThemePlaying: boolean = false;
  private themeGainNode: GainNode | null = null;
  public themeVolume: number = 0.25;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // F1 start light single red beep
  playRedLightBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Lights out GO signal (high pitch)
  playGreenGoBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 high
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.65);
  }

  // Correct answer - Turbo acceleration chime
  playCorrectSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25); // C6

    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.25); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // Wrong answer - Engine misfire / rumble penalty
  playWrongSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.35);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // DRS Boost sound
  playDrsBoost() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Authentic F1 Grand Prix Theme Synthesizer Engine (Brian Tyler style brass & high energy rhythm)
  startF1Theme(vol?: number) {
    if (this.isThemePlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    if (vol !== undefined) this.themeVolume = vol;
    this.isThemePlaying = true;

    // Brian Tyler F1 Theme Note Frequencies (Hz)
    // Famous motif: E3, G3, A3, B3, C4, B3, A3, G3, E3, D3, E3...
    const melodyNotes = [
      { freq: 164.81, dur: 0.28 }, // E3
      { freq: 196.00, dur: 0.28 }, // G3
      { freq: 220.00, dur: 0.35 }, // A3
      { freq: 246.94, dur: 0.28 }, // B3
      { freq: 261.63, dur: 0.45 }, // C4
      { freq: 246.94, dur: 0.28 }, // B3
      { freq: 220.00, dur: 0.35 }, // A3
      { freq: 196.00, dur: 0.45 }, // G3
      { freq: 164.81, dur: 0.60 }, // E3 (long hold)
      { freq: 146.83, dur: 0.28 }, // D3
      { freq: 164.81, dur: 0.55 }, // E3
      { freq: 220.00, dur: 0.28 }, // A3
      { freq: 329.63, dur: 0.70 }, // E4 (epic brass climax)
      { freq: 293.66, dur: 0.35 }, // D4
      { freq: 261.63, dur: 0.35 }, // C4
      { freq: 246.94, dur: 0.50 }, // B3
    ];

    let noteIdx = 0;
    const playNextBar = () => {
      if (!this.isThemePlaying || !this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const note = melodyNotes[noteIdx % melodyNotes.length];
      noteIdx++;

      // 1. Lead Brass Horn synth
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'sawtooth';
      leadOsc.frequency.setValueAtTime(note.freq, now);

      // Lowpass filter for warm cinematic brass
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(700, now + note.dur);

      leadGain.gain.setValueAtTime(0.001, now);
      leadGain.gain.linearRampToValueAtTime(this.themeVolume * 0.4, now + 0.04);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + note.dur);

      leadOsc.connect(filter);
      filter.connect(leadGain);
      leadGain.connect(this.ctx.destination);

      leadOsc.start(now);
      leadOsc.stop(now + note.dur + 0.05);

      // 2. Driving Formula 1 Bassline (16th-note pulse)
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(note.freq / 2, now);

      bassGain.gain.setValueAtTime(this.themeVolume * 0.35, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + note.dur * 0.7);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + note.dur * 0.75);

      // 3. Hi-Hat / Engine Piston Rhythm Click
      const snareOsc = this.ctx.createOscillator();
      const snareGain = this.ctx.createGain();
      snareOsc.type = 'sine';
      snareOsc.frequency.setValueAtTime(800, now);
      snareOsc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

      snareGain.gain.setValueAtTime(this.themeVolume * 0.15, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      snareOsc.connect(snareGain);
      snareGain.connect(this.ctx.destination);

      snareOsc.start(now);
      snareOsc.stop(now + 0.08);
    };

    // Trigger initial note
    playNextBar();
    // Schedule repeating intervals
    this.f1ThemeInterval = window.setInterval(playNextBar, 360);
  }

  stopF1Theme() {
    this.isThemePlaying = false;
    if (this.f1ThemeInterval !== null) {
      clearInterval(this.f1ThemeInterval);
      this.f1ThemeInterval = null;
    }
  }

  setThemeVolume(vol: number) {
    this.themeVolume = Math.max(0, Math.min(1, vol));
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isThemePlaying) {
      this.stopF1Theme();
    }
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
