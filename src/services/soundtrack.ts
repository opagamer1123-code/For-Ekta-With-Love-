/**
 * Romantic Background Audio Engine for Ekta's Scrapbook
 * Plays "Dil Se Dil" (Sita Ramam) as the ambient background soundtrack.
 * Specifically triggered at 30% volume ONLY when Ekta enters Chapter 6 ("The Boy Behind the Story").
 * Automatically pauses when she watches video reels in Chapter 3 ("Moments in Motion ♡")
 * and resumes at 30% volume when she stops watching.
 */

export const BACKGROUND_SONG_URL =
  '/assets/aistudio/Dil_Se_Dil_-_Official_Music_Video___Sita_Ramam___Vishal_Chandrashekhar___Shashwat_Singh___Mandar_C.__suC_Y2eZtAw__dbf94d17.mp3';

export const TRACK_INFO = {
  title: 'Dil Se Dil',
  film: 'Sita Ramam',
  artist: 'Vishal Chandrashekhar, Shashwat Singh',
  displayLabel: 'Dil Se Dil ♡',
  fullLabel: 'Dil Se Dil · Sita Ramam',
};

// Target ambient volume when entering Chapter 6: 15%
export const CHAPTER_6_VOLUME = 0.15;
export const LOCKED_VOLUME = 0.15;

class RomanticAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isPausedByReel: boolean = false;
  private pausedTime: number = 0;
  private volume: number = CHAPTER_6_VOLUME;
  private listeners: Set<(isPlaying: boolean) => void> = new Set();
  private hasEnteredChapter6: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    if (!this.audio) {
      try {
        const el = new Audio(BACKGROUND_SONG_URL);
        el.loop = true;
        el.preload = 'auto';
        el.volume = this.volume;

        el.addEventListener('play', () => {
          this.isPlaying = true;
          this.notifyListeners();
        });

        el.addEventListener('pause', () => {
          this.isPlaying = false;
          this.notifyListeners();
        });

        // Enforce repeated loop playback when track ends if playing
        el.addEventListener('ended', () => {
          el.currentTime = 0;
          if (this.isPlaying) {
            el.play().catch(() => {});
          }
        });

        // Ensure volume stays locked to current target (30%)
        el.addEventListener('volumechange', () => {
          if (Math.abs(el.volume - this.volume) > 0.02) {
            el.volume = this.volume;
          }
        });

        this.audio = el;
      } catch (err) {
        console.warn('Audio element initialization error:', err);
      }
    }

    return this.audio;
  }

  private notifyListeners() {
    const state = this.isPlaying;
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (e) {
        console.warn('Audio listener error:', e);
      }
    });
  }

  public subscribe(listener: (isPlaying: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Set target playback volume (default 30%)
   */
  public setVolume(vol: number = CHAPTER_6_VOLUME) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsPausedByReel(): boolean {
    return this.isPausedByReel;
  }

  public getCurrentTime(): number {
    return this.audio ? this.audio.currentTime : 0;
  }

  public getHasEnteredChapter6(): boolean {
    return this.hasEnteredChapter6;
  }

  /**
   * Play background song at specified volume (defaults to 30%)
   */
  public async play(): Promise<boolean> {
    const audio = this.initAudioElement();
    if (!audio) return false;

    this.isPausedByReel = false;
    audio.volume = this.volume;
    audio.loop = true;

    try {
      if (this.pausedTime > 0 && Math.abs(audio.currentTime - this.pausedTime) > 0.5) {
        audio.currentTime = this.pausedTime;
      }
      await audio.play();
      this.isPlaying = true;
      this.notifyListeners();
      return true;
    } catch (err) {
      console.warn('Audio play error / interaction required:', err);
      this.isPlaying = false;
      this.notifyListeners();
      return false;
    }
  }

  /**
   * Specifically called when she enters Chapter 6 ("The Boy Behind the Story")
   * Plays Dil Se Dil strictly at 30% volume.
   */
  public playForChapter6(): Promise<boolean> {
    this.hasEnteredChapter6 = true;
    this.setVolume(CHAPTER_6_VOLUME);
    return this.play();
  }

  /**
   * Pause background audio
   */
  public pause() {
    const audio = this.audio;
    if (audio && !audio.paused) {
      this.isPlaying = false;
      audio.pause();
      this.notifyListeners();
    }
  }

  /**
   * Toggle playback state
   */
  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play().catch(() => {});
      return true;
    }
  }

  /**
   * Called when she starts watching a reel:
   * Pauses background music and saves exact currentTime.
   */
  public pauseForReel() {
    const audio = this.audio;
    if (audio && !audio.paused) {
      this.isPausedByReel = true;
      this.pausedTime = audio.currentTime;
      this.isPlaying = false;
      audio.pause();
      this.notifyListeners();
    }
  }

  /**
   * Called when she stops watching a reel:
   * Instantly resumes playback at the exact second where it stopped (at 30% volume).
   */
  public resumeFromReel() {
    if (!this.isPausedByReel && !this.audio?.paused) return;

    const audio = this.audio;
    if (!audio) return;
    this.isPausedByReel = false;
    audio.volume = this.volume;
    audio.loop = true;

    try {
      if (this.pausedTime > 0) {
        audio.currentTime = this.pausedTime;
      }
      audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notifyListeners();
        })
        .catch((err) => {
          console.warn('Could not auto-resume background song:', err);
        });
    } catch (err) {
      console.warn('Error resuming background song:', err);
    }
  }

  /**
   * No-op placeholder to maintain backward compatibility without rogue autoplay
   */
  public initAutoPlayOnGesture() {
    // Intentionally left inert: the song must play ONLY when entering Chapter 6
  }
}

export const romanticAudio = new RomanticAudioEngine();
