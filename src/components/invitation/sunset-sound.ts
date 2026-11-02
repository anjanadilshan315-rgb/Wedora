/** The ZIP's two-oscillator melody, with cleanup when the page closes. */
export class SunsetSound {
  private context: AudioContext | null = null;
  private song: HTMLAudioElement | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private notes = new Set<OscillatorNode>();
  private noteIndex = 0;
  private melody = [
    392, 493.88, 587.33, 783.99, 587.33, 493.88, 440, 523.25, 659.25, 880, 659.25, 523.25,
  ];

  async play(musicUrl: string) {
    this.pause();
    try {
      if (musicUrl) {
        this.song = new Audio(musicUrl);
        this.song.loop = true;
        this.song.volume = 0.6;
        await this.song.play();
      } else {
        this.context ??= new AudioContext();
        await this.context.resume();
        this.playNote();
        this.timer = setInterval(() => this.playNote(), 820);
      }
      return true;
    } catch {
      this.pause();
      return false;
    }
  }

  private playNote() {
    const context = this.context;
    if (!context || context.state !== "running") return;
    const time = context.currentTime;
    const frequency = this.melody[this.noteIndex++ % this.melody.length];
    const volume = context.createGain();
    volume.gain.setValueAtTime(0, time);
    volume.gain.linearRampToValueAtTime(0.05, time + 0.03);
    volume.gain.exponentialRampToValueAtTime(0.0001, time + 2.2);
    volume.connect(context.destination);
    let remainingNotes = 2;

    // A sine note and a quiet triangle harmonic create the original melody.
    for (const [type, multiplier] of [
      ["sine", 1],
      ["triangle", 2],
    ] as const) {
      const note = context.createOscillator();
      note.type = type;
      note.frequency.value = frequency * multiplier;
      note.connect(volume);
      this.notes.add(note);
      note.onended = () => {
        this.notes.delete(note);
        note.disconnect();
        remainingNotes--;
        if (!remainingNotes) volume.disconnect();
      };
      note.start(time);
      note.stop(time + 2.3);
    }
  }

  pause() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.song?.pause();
    this.song = null;
    for (const note of this.notes) {
      try {
        note.stop();
      } catch {
        /* The note may have already finished. */
      }
      note.disconnect();
    }
    this.notes.clear();
    if (this.context?.state === "running") void this.context.suspend();
  }

  dispose() {
    this.pause();
    if (this.context && this.context.state !== "closed") void this.context.close();
    this.context = null;
  }
}
