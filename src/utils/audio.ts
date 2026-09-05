import { SoundProfile } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export class SoundEngine {
  private static volume: number = 0.8;
  private static isMuted: boolean = false;
  private static isVoiceEnabled: boolean = true;

  public static setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public static getVolume(): number {
    return this.volume;
  }

  public static setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public static getMuted(): boolean {
    return this.isMuted;
  }

  public static setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
  }

  public static getVoiceEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  /**
   * Speak Malayalam comedic dialogue out loud using Web Speech Synthesis API
   */
  public static speakMalayalam(malayalamText: string, transliteration: string, onEnd?: () => void) {
    if (this.isMuted || !this.isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterance

      const voices = window.speechSynthesis.getVoices();
      // Look for a Malayalam voice first, or Hindi / Indian English voice
      const malayalamVoice = voices.find(v => v.lang.startsWith('ml'));
      const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('hi'));

      let textToSpeak = transliteration;
      let chosenVoice = indianVoice || null;

      if (malayalamVoice) {
        textToSpeak = malayalamText;
        chosenVoice = malayalamVoice;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
      utterance.volume = this.volume;
      utterance.pitch = 1.18; // slightly upbeat / animated comedy pitch
      utterance.rate = 1.05;

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis warning:', err);
      if (onEnd) onEnd();
    }
  }

  /**
   * Play specific Malayalam comedic stinger sound
   */
  public static playMalayalamStinger(type: 'boing' | 'drama' | 'whistle' | 'chime' | 'alarm' = 'boing') {
    if (this.isMuted || this.volume <= 0) return;
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.85, ctx.currentTime);
      masterGain.connect(ctx.destination);

      switch (type) {
        case 'drama':
          this.playDramaticPunch(ctx, masterGain);
          break;
        case 'whistle':
          this.playSlideWhistle(ctx, masterGain);
          break;
        case 'alarm':
          this.playAmmaAlarm(ctx, masterGain);
          break;
        case 'chime':
          this.playMilestoneChime();
          break;
        case 'boing':
        default:
          this.playCartoonBoing(ctx, masterGain);
          break;
      }
    } catch (e) {
      console.warn('Stinger error:', e);
    }
  }

  /**
   * Classic Malayalam comedy dramatic cue ("DUN-DUN-DUNNN!")
   */
  private static playDramaticPunch(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;
    const chords = [
      { freq: 220, time: 0, dur: 0.15 },
      { freq: 207.65, time: 0.18, dur: 0.15 },
      { freq: 196, time: 0.36, dur: 0.45 }
    ];

    chords.forEach(({ freq, time, dur }) => {
      const t = now + time;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq / 2, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(destination);

      osc.start(t);
      osc2.start(t);
      osc.stop(t + dur + 0.05);
      osc2.stop(t + dur + 0.05);
    });
  }

  /**
   * Comedic cartoon slide whistle ("wheeee-ooop!")
   */
  private static playSlideWhistle(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.38);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Amma's electricity alarm buzz
   */
  private static playAmmaAlarm(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(660, t + 0.05);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(t);
      osc.stop(t + 0.1);
    }
  }

  /**
   * Play the door opening sound based on profile
   */
  public static playDoorOpen(profile: SoundProfile = 'realistic') {
    if (this.isMuted || this.volume <= 0) return;
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      switch (profile) {
        case 'realistic':
          this.playRealisticDoorOpen(ctx, masterGain);
          break;
        case 'cartoon':
          this.playCartoonBoing(ctx, masterGain);
          break;
        case 'retro':
          this.playRetroChime(ctx, masterGain);
          break;
        case 'scifi':
          this.playSciFiAirlock(ctx, masterGain);
          break;
        case 'asmr':
          this.playAsmrOpen(ctx, masterGain);
          break;
        default:
          this.playRealisticDoorOpen(ctx, masterGain);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Play the door closing sound
   */
  public static playDoorClose(profile: SoundProfile = 'realistic') {
    if (this.isMuted || this.volume <= 0) return;
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      switch (profile) {
        case 'cartoon':
          this.playCartoonClose(ctx, masterGain);
          break;
        case 'retro':
          this.playRetroClose(ctx, masterGain);
          break;
        case 'scifi':
          this.playSciFiClose(ctx, masterGain);
          break;
        default:
          this.playRealisticDoorClose(ctx, masterGain);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Play bite / crunch sound when inspecting or eating a snack
   */
  public static playSnackCrunch() {
    if (this.isMuted || this.volume <= 0) return;
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const now = ctx.currentTime;
      // 3 tiny noise crunch bursts
      for (let i = 0; i < 3; i++) {
        const t = now + i * 0.055;
        const bufferSize = ctx.sampleRate * 0.04;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400 + Math.random() * 600, t);
        filter.Q.setValueAtTime(3, t);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(t);
        noise.stop(t + 0.04);
      }
    } catch (e) {
      console.warn('Audio crunch error:', e);
    }
  }

  /**
   * Play milestone celebration chime
   */
  public static playMilestoneChime() {
    if (this.isMuted || this.volume <= 0) return;
    try {
      const ctx = getAudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.8, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(t);
        osc.stop(t + 0.6);
      });
    } catch (e) {
      console.warn('Milestone audio error:', e);
    }
  }

  // --- PRIVATE PROFILE IMPLEMENTATIONS ---

  /**
   * Realistic Fridge Open:
   * 1. Heavy rubber vacuum suction seal release ("thump-shhh")
   * 2. Gentle hinge friction creak
   * 3. Interior mechanical light switch click
   */
  private static playRealisticDoorOpen(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;

    // 1. Rubber Gasket Suction Pop (Low boom + filtered air rush)
    const lowThump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    lowThump.type = 'sine';
    lowThump.frequency.setValueAtTime(95, now);
    lowThump.frequency.exponentialRampToValueAtTime(32, now + 0.14);

    thumpGain.gain.setValueAtTime(0.7, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    lowThump.connect(thumpGain);
    thumpGain.connect(destination);
    lowThump.start(now);
    lowThump.stop(now + 0.15);

    // Suction vacuum release hiss
    const noiseBufSize = ctx.sampleRate * 0.22;
    const noiseBuf = ctx.createBuffer(1, noiseBufSize, ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseBufSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 0.2);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.45, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.22);

    // 2. Light Switch Click
    const clickTime = now + 0.1;
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1400, clickTime);
    clickOsc.frequency.exponentialRampToValueAtTime(300, clickTime + 0.025);

    clickGain.gain.setValueAtTime(0.25, clickTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.025);

    clickOsc.connect(clickGain);
    clickGain.connect(destination);
    clickOsc.start(clickTime);
    clickOsc.stop(clickTime + 0.03);

    // 3. Subtle metallic hinge glide
    const hingeTime = now + 0.08;
    const hingeOsc = ctx.createOscillator();
    const hingeGain = ctx.createGain();
    hingeOsc.type = 'sawtooth';
    hingeOsc.frequency.setValueAtTime(260, hingeTime);
    hingeOsc.frequency.linearRampToValueAtTime(290, hingeTime + 0.25);

    hingeGain.gain.setValueAtTime(0.001, hingeTime);
    hingeGain.gain.linearRampToValueAtTime(0.04, hingeTime + 0.05);
    hingeGain.gain.exponentialRampToValueAtTime(0.001, hingeTime + 0.25);

    const hingeFilter = ctx.createBiquadFilter();
    hingeFilter.type = 'bandpass';
    hingeFilter.frequency.setValueAtTime(600, hingeTime);
    hingeFilter.Q.setValueAtTime(6, hingeTime);

    hingeOsc.connect(hingeFilter);
    hingeFilter.connect(hingeGain);
    hingeGain.connect(destination);
    hingeOsc.start(hingeTime);
    hingeOsc.stop(hingeTime + 0.26);
  }

  /**
   * Realistic Fridge Close:
   * 1. Heavy magnetic seal latch snap
   * 2. Deep muffled refrigerator body dampening thud
   */
  private static playRealisticDoorClose(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;

    // Deep body thud
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(120, now);
    thud.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    thudGain.gain.setValueAtTime(0.8, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    thud.connect(thudGain);
    thudGain.connect(destination);
    thud.start(now);
    thud.stop(now + 0.2);

    // Magnetic seal snap
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(800, now);
    snap.frequency.exponentialRampToValueAtTime(150, now + 0.06);

    snapGain.gain.setValueAtTime(0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    snap.connect(snapGain);
    snapGain.connect(destination);
    snap.start(now);
    snap.stop(now + 0.07);
  }

  /**
   * Cartoon Boing / Squeak
   */
  private static playCartoonBoing(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.22);
    osc.frequency.linearRampToValueAtTime(520, now + 0.38);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.46);

    // Cute high squeak chirp
    const squeak = ctx.createOscillator();
    const squeakGain = ctx.createGain();
    squeak.type = 'triangle';
    squeak.frequency.setValueAtTime(1200, now + 0.05);
    squeak.frequency.linearRampToValueAtTime(1800, now + 0.12);
    squeakGain.gain.setValueAtTime(0.2, now + 0.05);
    squeakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    squeak.connect(squeakGain);
    squeakGain.connect(destination);
    squeak.start(now + 0.05);
    squeak.stop(now + 0.15);
  }

  private static playCartoonClose(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  /**
   * Retro 8-Bit Chime
   */
  private static playRetroChime(ctx: AudioContext, destination: GainNode) {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.06;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  private static playRetroClose(ctx: AudioContext, destination: GainNode) {
    const notes = [659.25, 440];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.07;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(destination);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  /**
   * Sci-Fi Cryo Chamber Airlock
   */
  private static playSciFiAirlock(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;

    // Pneumatic gas release
    const bufSize = ctx.sampleRate * 0.35;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.3);
    filter.Q.setValueAtTime(4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    noise.start(now);
    noise.stop(now + 0.35);

    // Deep sub-pulse
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(65, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + 0.35);

    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    sub.connect(subGain);
    subGain.connect(destination);
    sub.start(now);
    sub.stop(now + 0.36);
  }

  private static playSciFiClose(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * ASMR Subtle Crisp & Soft Thud
   */
  private static playAsmrOpen(ctx: AudioContext, destination: GainNode) {
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + 0.14);

    // Warm high shimmer
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(880, now + 0.03);
    shimmer.frequency.exponentialRampToValueAtTime(440, now + 0.18);

    shimmerGain.gain.setValueAtTime(0.08, now + 0.03);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(destination);
    shimmer.start(now + 0.03);
    shimmer.stop(now + 0.2);
  }
}
