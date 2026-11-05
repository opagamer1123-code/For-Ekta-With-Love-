import React, { useState, useEffect } from 'react';
import { Heart, Feather, RotateCcw, Volume2, VolumeX } from 'lucide-react';
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

  // Subscribe to audio mute changes
  useEffect(() => {
    return paperFlipAudio.subscribe((muted) => {
      setIsAudioMuted(muted);
    });
  }, []);

  // Coordinated staged cinematic physical opening sequence (3.7 seconds total)
  // 1. Wax seal press and crack — 0.4s
  // 2. Wax seal breaking — 0.5s
  // 3. Envelope flap opening — 1.0s
  // 4. Letter sliding out — 1.2s
  // 5. Final letter reveal — 0.6s
  const runOpeningSequence = () => {
    if (isAnimating || phase !== 'closed') return;

    setIsAnimating(true);

    // Stage 1: Wax seal press and crack fissure (0.0s - 0.4s)
    setPhase('seal-press');
    paperFlipAudio.playWaxCrack();

    // Stage 2: Wax seal breaking & splitting into fragments (0.4s - 0.9s)
    setTimeout(() => {
      setPhase('seal-break');
    }, 400);

    // Stage 3: Triangular flap 3D folds backwards from hinge (0.9s - 1.9s)
    setTimeout(() => {
      setPhase('flap-opening');
      paperFlipAudio.playFlapOpen();
    }, 900);

    // Stage 4: Letter slides out with gentle pause at ~40% (1.9s - 3.1s)
    setTimeout(() => {
      setPhase('letter-sliding');
      paperFlipAudio.playLetterSlide();
    }, 1900);

    // Stage 5: Letter reaches full emergence & blooms into focus (3.1s - 3.7s)
    setTimeout(() => {
      setPhase('letter-reveal');
      paperFlipAudio.playLetterUnfold();
    }, 3100);

    // Stage 6: Seamlessly cross-fade into the page-turn book reading experience (at 3.7s)
    setTimeout(() => {
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
    }, 3700);
  };

  const handleResetToSealed = () => {
    if (isAnimating) return;
    setPhase('closed');
    romanticAudio.pause();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    paperFlipAudio.toggleMute();
  };

  return (
    <section
      id="envelope-section"
      className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-between px-4 sm:px-6 pt-7 sm:pt-10 md:pt-12 pb-10 sm:pb-14 relative overflow-hidden paper-pattern will-change-transform"
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
          <div className="w-full my-auto py-2 relative z-20 flex items-center justify-center">
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
          <div className="w-full max-w-3xl flex items-center justify-between mb-4 px-2">
            <span className="font-handwriting text-2xl text-[#A64D68] inline-flex items-center gap-1.5">
              <Feather className="w-4 h-4 text-[#A64D68]" />
              A Story Written for Ekta ♡
            </span>

            <button
              onClick={handleResetToSealed}
              className="inline-flex items-center gap-1.5 text-xs text-[#9A817B] hover:text-[#A64D68] transition-colors py-1 px-2 rounded-md hover:bg-[#F8DCE5]/30 cursor-pointer"
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
            onComplete={onLetterRevealed}
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
