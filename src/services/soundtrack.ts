/**
 * Romantic Background Audio Engine for Ekta's Scrapbook
 * Plays "Dil Se Dil" (Sita Ramam) as the ambient background soundtrack.
 * Automatically pauses when she watches reels in Chapter 3 ("Moments in Motion ♡")
 * and instantly resumes at the exact second it was paused when she stops watching reels.
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

// Fixed romantic ambient volume requested: 43%
export const LOCKED_VOLUME = 0.43;

class RomanticAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isPausedByReel: boolean = false;
  private pausedTime: number = 0;
  private volume: number = LOCKED_VOLUME;
  private listeners: Set<(isPlaying: boolean) => void> = new Set();
  private gestureListenerAttached: boolean = false;

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
        // Play repeatedly in infinite loop
        el.loop = true;
        el.preload = 'auto';
        el.volume = LOCKED_VOLUME;

        el.addEventListener('play', () => {
          this.isPlaying = true;
          this.notifyListeners();
        });

        el.addEventListener('pause', () => {
          // Only change state if intentionally managed by reel pause
          if (this.isPausedByReel) {
            this.isPlaying = false;
            this.notifyListeners();
          } else {
            // Song must play repeatedly with no option to stop
            // If browser paused unexpectedly, attempt to keep playing
            if (!this.isPausedByReel) {
              el.play().catch(() => {});
            }
          }
        });

        // Enforce repeated loop playback when track ends
        el.addEventListener('ended', () => {
          el.currentTime = 0;
          el.play().catch(() => {});
        });

        // Ensure volume stays locked to 43%
        el.addEventListener('volumechange', () => {
          if (el.volume !== LOCKED_VOLUME) {
            el.volume = LOCKED_VOLUME;
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
   * Volume is strictly locked to 43%
   */
  public setVolume(_vol?: number) {
    this.volume = LOCKED_VOLUME;
    if (this.audio) {
      this.audio.volume = LOCKED_VOLUME;
    }
  }

  public getVolume(): number {
    return LOCKED_VOLUME;
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

  /**
   * Play background song repeatedly
   */
  public async play(): Promise<boolean> {
    const audio = this.initAudioElement();
    if (!audio) return false;

    this.isPausedByReel = false;
    audio.volume = LOCKED_VOLUME;
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
      console.warn('Playback gesture required or blocked:', err);
      this.isPlaying = false;
      this.notifyListeners();
      return false;
    }
  }

  /**
   * No option to stop: user cannot stop or pause the music.
   * Method kept for API compatibility but will not stop continuous playback.
   */
  public pause() {
    // Intentionally no-op: song plays repeatedly with no option to stop
    // Only pauseForReel() pauses during reel watching
  }

  /**
   * Toggle: ensures music continues playing
   */
  public toggle(): boolean {
    if (!this.isPlaying) {
      this.play().catch(() => {});
    }
    return true;
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
   * Instantly resumes playback at the exact second where it stopped.
   */
  public resumeFromReel() {
    if (!this.isPausedByReel && !this.audio?.paused) return;

    const audio = this.audio;
    if (!audio) return;
    this.isPausedByReel = false;
    audio.volume = LOCKED_VOLUME;
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
   * Starts background music upon the first romantic gesture
   * and ensures continuous repeating playback.
   */
  public initAutoPlayOnGesture() {
    if (typeof window === 'undefined' || this.gestureListenerAttached) return;
    this.gestureListenerAttached = true;

    const handleFirstUserGesture = () => {
      cleanup();
      if (!this.isPlaying && !this.isPausedByReel) {
        this.play().catch(() => {});
      }
    };

    const cleanup = () => {
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
      window.removeEventListener('pointerdown', handleFirstUserGesture);
    };

    window.addEventListener('click', handleFirstUserGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstUserGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstUserGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleFirstUserGesture, { once: true, passive: true });

    // Also attempt immediate autoplay
    this.play().catch(() => {});
  }
}

export const romanticAudio = new RomanticAudioEngine();
