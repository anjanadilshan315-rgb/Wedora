/** Small built-in sounds, made in the browser. No MP3 download is required. */
export class HeirloomSound {
  private context: AudioContext | null = null;
  private sources = new Set<AudioScheduledSourceNode>();
  private melodyTimer: number | null = null;
  private version = 0;

  private note(
    frequency: number,
    when: number,
    duration: number,
    volume: number,
  ) {
    const context = this.context!;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    this.sources.add(oscillator);
    oscillator.onended = () => {
      this.sources.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(when);
    oscillator.stop(when + duration + 0.05);
  }

  private rustle(
    when: number,
    duration: number,
    volume: number,
    frequency: number,
  ) {
    const context = this.context!;
    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * duration),
      context.sampleRate,
    );
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(frequency, when);
    filter.frequency.exponentialRampToValueAtTime(
      frequency / 2,
      when + duration,
    );
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    this.sources.add(source);
    source.onended = () => {
      this.sources.delete(source);
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
    source.start(when);
    source.stop(when + duration);
  }

  private doorCreak(when: number) {
    const context = this.context!;
    const source = context.createOscillator();
    const gain = context.createGain();
    source.type = "triangle";
    source.frequency.setValueAtTime(115, when);
    source.frequency.exponentialRampToValueAtTime(58, when + 1.8);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(0.022, when + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);
    source.connect(gain);
    gain.connect(context.destination);
    this.sources.add(source);
    source.onended = () => {
      this.sources.delete(source);
      source.disconnect();
      gain.disconnect();
    };
    source.start(when);
    source.stop(when + 1.85);
  }

  /** Called from a guest's click, which allows browser audio to start. */
  async start(opening: boolean, builtInMusic: boolean, reducedMotion = false) {
    this.stop();
    const version = this.version;
    this.context ??= new AudioContext();
    await this.context.resume();
    if (version !== this.version) return;
    const now = this.context.currentTime + 0.03;
    if (opening) {
      // Brass latch, wooden doors, soft courtyard footsteps and an arrival chime.
      this.rustle(now, 0.12, 0.12, 1800);
      this.doorCreak(now + 0.12);
      this.rustle(now + 0.25, 0.65, 0.065, 700);
      if (!reducedMotion)
        [1.65, 2.1, 2.55].forEach((delay) =>
          this.note(100, now + delay, 0.14, 0.045),
        );
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        this.note(
          frequency,
          now + (reducedMotion ? 0.18 : 3.3) + index * 0.15,
          1.3,
          0.04,
        );
      });
    }
    if (builtInMusic) {
      const melody = [
        261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23, 440, 587.33,
        440, 349.23,
      ];
      const playPhrase = (start: number) =>
        melody.forEach((frequency, index) => {
          this.note(frequency, start + index * 0.9, 2.4, 0.03);
          this.note(frequency * 2, start + index * 0.9, 2.2, 0.008);
        });
      const delay = opening && !reducedMotion ? 4.6 : 0.2;
      playPhrase(now + delay);
      this.melodyTimer = window.setInterval(
        () => playPhrase(this.context!.currentTime + delay + 0.03),
        melody.length * 900,
      );
    }
  }

  stop() {
    this.version++;
    if (this.melodyTimer !== null) window.clearInterval(this.melodyTimer);
    this.melodyTimer = null;
    this.sources.forEach((source) => {
      try {
        source.stop();
      } catch {
        /* Already ended. */
      }
    });
    this.sources.clear();
  }

  dispose() {
    this.stop();
    if (this.context && this.context.state !== "closed")
      void this.context.close().catch(() => {});
    this.context = null;
  }
}
