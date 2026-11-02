/** Small built-in sounds, made in the browser. No MP3 download is required. */
export class EnvelopeSound {
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

  /** Called from a guest's click, which allows browser audio to start. */
  async start(opening: boolean, builtInMusic: boolean, reducedMotion = false) {
    this.stop();
    const version = this.version;
    this.context ??= new AudioContext();
    await this.context.resume();
    if (version !== this.version) return;
    const now = this.context.currentTime + 0.03;
    if (opening) {
      // A wax crack, paper unfolding and an ascending welcome chime.
      this.rustle(now, 0.13, 0.2, 2400);
      this.rustle(now + 0.09, 0.15, 0.1, 1600);
      this.rustle(now + (reducedMotion ? 0.12 : 0.5), 0.7, 0.12, 1100);
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        this.note(
          frequency,
          now + (reducedMotion ? 0.18 : 1.8) + index * 0.13,
          1.1,
          0.04,
        );
      });
    }
    if (builtInMusic) {
      const melody = [
        523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 523.25,
        659.25, 783.99, 1046.5, 880, 783.99, 659.25, 587.33,
      ];
      const playPhrase = (start: number) =>
        melody.forEach((frequency, index) => {
          this.note(frequency, start + index * 0.52, 2.4, 0.03);
          this.note(frequency * 2, start + index * 0.52, 2.2, 0.008);
        });
      const delay = opening && !reducedMotion ? 3.2 : 0.2;
      playPhrase(now + delay);
      this.melodyTimer = window.setInterval(
        () => playPhrase(this.context!.currentTime + delay + 0.03),
        melody.length * 520,
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
