/**
 * Audio Service - Gera efeitos sonoros sinteticamente usando Web Audio API
 * Sem dependências externas, apenas Web Audio API nativa
 */

class AudioService {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Garante que o AudioContext está pronto
   */
  private ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Som de giro - frequência variável que simula o som de uma máquina girando
   */
  playSpinSound() {
    if (this.isMuted || !this.audioContext) return;

    this.ensureAudioContext();
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    // Criar osciladores para simular o som de giro
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    // Configurar LFO (Low Frequency Oscillator) para modular a frequência
    lfo.frequency.value = 8; // 8 Hz para vibrato
    lfoGain.gain.value = 50; // Profundidade da modulação

    // Conectar LFO ao oscilador
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    // Configurar osciladores
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(150, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.3);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(200, now);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    // Envelope de volume
    gain.gain.setValueAtTime(0.15 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    // Conectar tudo ao destino
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
    lfo.stop(now + 0.3);
  }

  /**
   * Som de vitória - sequência de notas ascendentes em tom maior
   */
  playVictorySound() {
    if (this.isMuted || !this.audioContext) return;

    this.ensureAudioContext();
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    // Notas da escala maior (C4, E4, G4, C5)
    const notes = [262, 330, 392, 523]; // Frequências em Hz
    const noteDuration = 0.15;
    const gap = 0.05;

    notes.forEach((frequency, index) => {
      const startTime = now + index * (noteDuration + gap);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = frequency;

      // Envelope ADSR simplificado
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2 * this.volume, startTime + 0.02);
      gain.gain.linearRampToValueAtTime(0.15 * this.volume, startTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);
    });
  }

  /**
   * Som de derrota - sequência de notas descendentes em tom menor
   */
  playLossSound() {
    if (this.isMuted || !this.audioContext) return;

    this.ensureAudioContext();
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    // Notas descendentes (A4, F#4, D4, B3)
    const notes = [440, 370, 294, 247]; // Frequências em Hz
    const noteDuration = 0.2;
    const gap = 0.05;

    notes.forEach((frequency, index) => {
      const startTime = now + index * (noteDuration + gap);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = frequency;

      // Envelope com decay mais rápido
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15 * this.volume, startTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + noteDuration);
    });
  }

  /**
   * Som de clique - som curto para feedback de UI
   */
  playClickSound() {
    if (this.isMuted || !this.audioContext) return;

    this.ensureAudioContext();
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    filter.type = 'highpass';
    filter.frequency.value = 500;

    gain.gain.setValueAtTime(0.1 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Alternar mute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Definir volume (0 a 1)
   */
  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Obter estado de mute
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Obter volume atual
   */
  getVolume(): number {
    return this.volume;
  }
}

// Singleton instance
let audioServiceInstance: AudioService | null = null;

export function getAudioService(): AudioService {
  if (!audioServiceInstance) {
    audioServiceInstance = new AudioService();
  }
  return audioServiceInstance;
}
