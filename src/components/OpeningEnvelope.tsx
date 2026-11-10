import React, { useState, useEffect } from 'react';
import { Heart, Feather, RotateCcw, Volume2, VolumeX, Clock } from 'lucide-react';
import { EnvelopeIllustration, EnvelopeAnimationPhase } from './EnvelopeIllustration';
import { PageTurnBook } from './PageTurnBook';
import { authoritativeStoryChapters } from '../config/ektaStoryConfig';
import { romanticAudio } from '../services/soundtrack';
import { paperFlipAudio } from '../services/paperSound';

interface OpeningEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  onLetterRevealed: () => void;
}

export const OpeningEnvelope: React.FC<OpeningEnvelopeProps> = ({
  isOpen,
  onOpen,
  onLetterRevealed,
}) => {
  const [phase, setPhase] = useState<EnvelopeAnimationPhase>(isOpen ? 'revealed' : 'closed');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => paperFlipAudio.getIsMuted());
  const [storyReadingSeconds, setStoryReadingSeconds] = useState<number>(0);

  // Track how much time she takes to read the unfolded story
  useEffect(() => {
    if (phase !== 'revealed') return;
    const timer = setInterval(() => {
      setStoryReadingSeconds((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('ekta_story_reading_seconds', next.toString());
        } catch {}
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const formatReadingTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins === 0) {
      return `${remainingSecs}s`;
    }
    return `${mins}m ${remainingSecs.toString().padStart(2, '0')}s`;
  };

  // Subscribe to audio mute changes
  useEffect(() => {
    return paperFlipAudio.subscribe((muted) => {
      setIsAudioMuted(muted);
    });
  }, []);

  // Coordinated staged cinematic physical opening sequence (approx 3.0 seconds total)
  // 1. Wax seal press and crack — 0.35s
  // 2. Wax seal breaking & sparkles — 0.40s
  // 3. Envelope flap 3D folding open — 0.80s
  // 4. Letter sliding out of pocket — 0.90s
  // 5. Final letter bloom & reveal — 0.50s
  const runOpeningSequence = () => {
    if (isAnimating || phase !== 'closed') return;

    setIsAnimating(true);

    // Reset reading timer fresh to 0 whenever the envelope opening sequence begins
    setStoryReadingSeconds(0);
    try {
      localStorage.setItem('ekta_story_reading_seconds', '0');
    } catch {}

    // Stage 1: Wax seal press and crack fissure (0.0s - 0.35s)
    setPhase('seal-press');
    paperFlipAudio.playWaxCrack();

    // Stage 2: Wax seal breaking & splitting into fragments (0.35s - 0.75s)
    setTimeout(() => {
      setPhase('seal-break');
    }, 350);

    // Stage 3: Triangular flap 3D folds backwards from hinge (0.75s - 1.55s)
    setTimeout(() => {
      setPhase('flap-opening');
      paperFlipAudio.playFlapOpen();
    }, 750);

    // Stage 4: Letter slides smoothly out of pocket (1.55s - 2.45s)
    setTimeout(() => {
      setPhase('letter-sliding');
      paperFlipAudio.playLetterSlide();
    }, 1550);

    // Stage 5: Letter reaches full emergence & blooms into focus (2.45s - 2.95s)
    setTimeout(() => {
      setPhase('letter-reveal');
      paperFlipAudio.playLetterUnfold();
    }, 2450);

    // Stage 6: Seamlessly cross-fade into the page-turn book reading experience (at ~3.0s)
    setTimeout(() => {
      setStoryReadingSeconds(0);
      try {
        localStorage.setItem('ekta_story_reading_seconds', '0');
      } catch {}
      setPhase('revealed');
      setIsAnimating(false);
      onOpen();

      // Smoothly scroll down to the revealed letter reading view
      setTimeout(() => {
        const letterCard = document.getElementById('story-book-section');
        if (letterCard) {
          letterCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 2980);
  };

  const handleResetToSealed = () => {
    if (isAnimating) return;
    setStoryReadingSeconds(0);
    try {
      localStorage.setItem('ekta_story_reading_seconds', '0');
    } catch {}
    setPhase('closed');
    romanticAudio.pause();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    paperFlipAudio.toggleMute();
  };

  const handleCompleteStory = () => {
    if (storyReadingSeconds >= 5) {
      try {
        fetch('/api/reading-time/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'Chapter 1: A Story Written for Ekta (10-Year Confession)',
            seconds: storyReadingSeconds,
            formattedDuration: formatReadingTime(storyReadingSeconds),
          }),
        }).catch(() => {});
      } catch {}
    }
    onLetterRevealed();
  };

  return (
    <section
      id="envelope-section"
      className="min-h-screen flex flex-col items-center justify-between px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 relative overflow-hidden paper-pattern will-change-transform"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-label="A Story for Ekta"
    >
      {/* Decorative Pressed Flowers / Botanical Line Flourishes (aria-hidden) */}
      <div
        className="absolute top-6 left-6 w-24 h-24 opacity-25 pointer-events-none text-[#A64D68]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M10 50 Q25 25 50 10" />
          <circle cx="50" cy="10" r="3" fill="#F8DCE5" />
          <path d="M15 35 Q25 32 30 22" />
          <path d="M28 45 Q36 40 40 30" />
        </svg>
      </div>
      <div
        className="absolute top-6 right-6 w-24 h-24 opacity-25 pointer-events-none text-[#A64D68] scale-x-[-1]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M10 50 Q25 25 50 10" />
          <circle cx="50" cy="10" r="3" fill="#F8DCE5" />
          <path d="M15 35 Q25 32 30 22" />
        </svg>
      </div>

      {/* STATE A: Sealed Envelope & 3D Opening Animation Experience */}
      {phase !== 'revealed' ? (
        <div className="flex flex-col items-center justify-between w-full flex-1 max-w-3xl mx-auto">
          {/* Hero Typography Composition */}
          <div className="text-center max-w-[760px] mx-auto relative z-20 flex flex-col items-center animate-[fadeSlideDown_0.8s_ease-out]">
            {/* Small handwritten eyebrow with optional subtle audio toggle */}
            <div className="inline-flex items-center gap-3 mb-2.5">
              <span className="h-px w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#A64D68]/40" aria-hidden="true" />
              <span className="font-handwriting text-2xl sm:text-3xl text-[#A64D68] tracking-wide inline-flex items-center gap-1.5">
                For Ekta ♡
              </span>
              <span className="h-px w-6 sm:w-8 bg-gradient-to-l from-transparent to-[#A64D68]/40" aria-hidden="true" />

              <button
                type="button"
                onClick={handleToggleSound}
                className="ml-1 p-1 rounded-full text-[#9A817B] hover:text-[#A64D68] hover:bg-[#F8DCE5]/40 transition-colors"
                title={isAudioMuted ? 'Turn on paper sounds' : 'Mute paper sounds'}
                aria-label={isAudioMuted ? 'Turn on paper sounds' : 'Mute paper sounds'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 opacity-70" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Initial hero headline */}
            <h1 className="font-heading text-[clamp(2rem,4.2vw,3.2rem)] text-[#5A3545] font-semibold leading-[1.2] tracking-tight max-w-[760px]">
              Hey Ekta, I have a little story to tell you...
            </h1>

            {/* Supporting subtext */}
            <p className="mt-3 text-base sm:text-lg md:text-xl text-[#9A817B] font-letter italic max-w-[560px] leading-relaxed">
              Some stories stay in the heart for years before they find the courage to be told.
            </p>
          </div>

          {/* Staged 3D Physical Envelope with Breaking Wax Seal */}
          <div className="w-full my-auto pt-14 sm:pt-20 md:pt-24 pb-4 relative z-20 flex items-center justify-center">
            <EnvelopeIllustration
              phase={phase}
              onSealClick={runOpeningSequence}
              disabled={isAnimating}
            />
          </div>

          {/* Gentle Callout: Tapping the wax seal triggers the physical 3D opening */}
          <div className="relative z-20 text-center flex flex-col items-center justify-center animate-[fadeSlideUp_0.9s_ease-out_0.2s_both] pb-3">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#FFF5F8]/90 border border-[#F8DCE5] shadow-xs">
              <Heart className="w-3.5 h-3.5 text-[#A64D68] fill-[#A64D68]/70 animate-pulse" aria-hidden="true" />
              <span className="font-handwriting text-base sm:text-lg text-[#A64D68] tracking-wide">
                {phase === 'closed'
                  ? 'Tap the wax seal to unfold the letter ♡'
                  : phase === 'seal-press' || phase === 'seal-break'
                  ? 'The seal gently cracks open...'
                  : phase === 'flap-opening'
                  ? 'Unfolding the letter...'
                  : 'Revealing her story with all my heart...'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* STATE B: Unfolded Letter & Authentic Physical 3D Page-Turn Experience */
        <div id="story-book-section" className="w-full flex-1 flex flex-col items-center animate-[letterUnfoldSmooth_0.8s_cubic-bezier(0.16,1,0.3,1)]">
          {/* Top Banner Ribbon */}
          <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-2.5 mb-4 px-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-handwriting text-2xl text-[#A64D68] inline-flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-[#A64D68]" />
                A Story Written for Ekta ♡
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-serif text-[#8E5265] bg-[#FFF5F8]/90 border border-[#F8DCE5] shadow-2xs">
                <Clock className="w-3 h-3 text-[#A64D68]" />
                <span>Reading time: {formatReadingTime(storyReadingSeconds)} ♡</span>
              </span>
            </div>

            <button
              onClick={handleResetToSealed}
              className="inline-flex items-center gap-1.5 text-xs text-[#9A817B] hover:text-[#A64D68] transition-colors py-1 px-2.5 rounded-full bg-[#FFF5F8]/70 hover:bg-[#F8DCE5]/50 border border-[#F8DCE5] cursor-pointer"
              title="Close back to sealed envelope"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>View Envelope</span>
            </button>
          </div>

          {/* Genuine 3D Hardcover Page-Turn Book with exact story chapters */}
          <PageTurnBook
            chapters={authoritativeStoryChapters}
            initialChapterIndex={0}
            sectionTitle="Chapter"
            badgeLabel="10-Year Confession"
            completeButtonText="Continue to My Letter & Notes ♡"
            onComplete={handleCompleteStory}
            onReturnHome={handleResetToSealed}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes letterUnfoldSmooth {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[fadeSlideDown_0.8s_ease-out],
          .animate-[fadeSlideUp_0.9s_ease-out_0.2s_both],
          .animate-[letterUnfoldSmooth_0.8s_cubic-bezier(0.16,1,0.3,1)] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};
