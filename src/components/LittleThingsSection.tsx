import React, { useState, useEffect, useRef } from 'react';
import { Heart, Flower2 } from 'lucide-react';
import { LittleThingCard } from '../config/proposalConfig';
import { loadLittleThings } from '../services/notesStorage';
import { FoldedScrapbookCard } from './FoldedScrapbookCard';
import { LoveShowerOverlay } from './LoveShowerOverlay';

interface LittleThingsSectionProps {
  isOwnerMode: boolean;
  onContinueToQuestion: () => void;
  onPrevPage?: () => void;
}

// Pressed Botanical Sprig Background Illustration
const PressedBotanicalSprig: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 60 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-40 ${className}`}
    aria-hidden="true"
  >
    <path
      d="M30 75C30 50 35 30 50 10"
      stroke="#C7A66A"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M35 55C42 50 48 53 46 45C44 38 36 45 35 55Z"
      fill="#D99AA5"
      fillOpacity="0.4"
      stroke="#C7A66A"
      strokeWidth="0.8"
    />
    <path
      d="M28 42C20 40 18 32 24 30C30 28 32 38 28 42Z"
      fill="#F8DCE5"
      fillOpacity="0.6"
      stroke="#C7A66A"
      strokeWidth="0.8"
    />
    <path
      d="M38 32C46 28 48 20 42 19C36 18 36 28 38 32Z"
      fill="#D99AA5"
      fillOpacity="0.5"
      stroke="#C7A66A"
      strokeWidth="0.8"
    />
    <circle cx="50" cy="10" r="2.5" fill="#A64D68" fillOpacity="0.7" />
  </svg>
);

// Delicate Pressed Petals / Ribbon background accents
const ScrapbookPetal: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-30 ${className}`}
    aria-hidden="true"
  >
    <path
      d="M 20 5 C 10 15, 8 28, 20 35 C 32 28, 30 15, 20 5 Z"
      fill="#F8DCE5"
      stroke="#E2A9B8"
      strokeWidth="0.8"
    />
    <line x1="20" y1="12" x2="20" y2="28" stroke="#C7A66A" strokeWidth="0.6" opacity="0.6" />
  </svg>
);

export const LittleThingsSection: React.FC<LittleThingsSectionProps> = ({
  isOwnerMode,
  onContinueToQuestion,
  onPrevPage,
}) => {
  const [cards, setCards] = useState<LittleThingCard[]>([]);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Parallax Sprig Refs
  const sprig1Ref = useRef<HTMLDivElement | null>(null);
  const sprig2Ref = useRef<HTMLDivElement | null>(null);
  const sprig3Ref = useRef<HTMLDivElement | null>(null);

  // Intersection Observer Visibility states
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const [navVisible, setNavVisible] = useState(false);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Gentle Parallax Scroll Tracking
  useEffect(() => {
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY;
          if (sprig1Ref.current) {
            sprig1Ref.current.style.transform = `translate3d(0, ${(sy * 0.04).toFixed(1)}px, 0) rotate(-8deg)`;
          }
          if (sprig2Ref.current) {
            sprig2Ref.current.style.transform = `translate3d(0, ${(-sy * 0.03).toFixed(1)}px, 0) rotate(12deg)`;
          }
          if (sprig3Ref.current) {
            sprig3Ref.current.style.transform = `translate3d(0, ${(sy * 0.02).toFixed(1)}px, 0) rotate(-4deg)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Load 14 cards from storage or default config
  useEffect(() => {
    const loaded = loadLittleThings();
    setCards(loaded);
    const initialReveals: Record<string, boolean> = {};
    loaded.forEach((c) => {
      initialReveals[c.id] = c.revealedInitially || false;
    });
    setRevealedIds(initialReveals);
  }, []);

  // Intersection Observer for scroll triggers
  useEffect(() => {
    if (prefersReducedMotion) {
      setHeaderVisible(true);
      const allVis: Record<string, boolean> = {};
      cards.forEach((c) => (allVis[c.id] = true));
      setVisibleCards(allVis);
      setNavVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const targetId = target.dataset.observeId;

            if (targetId === 'header') {
              setHeaderVisible(true);
            } else if (targetId === 'nav') {
              setNavVisible(true);
            } else if (targetId && targetId.startsWith('card-')) {
              const cardId = targetId.replace('card-', '');
              setVisibleCards((prev) => ({ ...prev, [cardId]: true }));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (navRef.current) observer.observe(navRef.current);
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [cards, prefersReducedMotion]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Divide the cards into the layout groups:
  // 1. First 3 prominent cards (Top Row)
  // 2. Middle cards (Cards 04 to 13)
  const topThreeCards = cards.slice(0, 3);
  const middleCards = cards.slice(3, 13);
  const finalCard = cards[13] || cards[cards.length - 1];

  return (
    <section
      id="little-things-section"
      className="py-12 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-20 w-full overflow-hidden will-change-transform bg-gradient-to-b from-[#FFF5F1]/80 via-[#FDF0EA]/90 to-[#FFF6F3]/80 rounded-[32px] sm:rounded-[40px] my-4 shadow-[0_20px_60px_rgba(74,29,43,0.04)]"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-label="Chapter 4 — Little Things That Make You, You for Ekta"
    >
      {/* =================================================================== */}
      {/* DELICATE PRESSED FLOWERS, PETALS, RIBBONS, AND HEARTS BACKGROUND */}
      {/* =================================================================== */}
      <div
        ref={sprig1Ref}
        className="absolute top-16 left-4 sm:left-8 pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0) rotate(-8deg)',
          willChange: 'transform',
        }}
      >
        <PressedBotanicalSprig className="w-14 sm:w-20 h-auto" />
      </div>

      <div
        ref={sprig2Ref}
        className="absolute top-1/2 -right-6 sm:right-6 pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0) rotate(12deg)',
          willChange: 'transform',
        }}
      >
        <PressedBotanicalSprig className="w-16 sm:w-24 h-auto" />
      </div>

      <div
        ref={sprig3Ref}
        className="absolute bottom-28 left-6 sm:left-12 pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0) rotate(-4deg)',
          willChange: 'transform',
        }}
      >
        <div className="w-10 h-10 rounded-full border border-[#C7A66A]/30 bg-[#FFFDF9]/80 flex items-center justify-center text-[#A64D68] text-xs shadow-xs">
          ♡
        </div>
      </div>

      {/* Floating Pressed Petals */}
      <ScrapbookPetal className="absolute top-40 right-16 w-8 h-8 -rotate-12 hidden md:block" />
      <ScrapbookPetal className="absolute top-2/3 left-10 w-9 h-9 rotate-45 hidden md:block" />
      <ScrapbookPetal className="absolute bottom-48 right-12 w-7 h-7 rotate-12 hidden md:block" />

      {/* =================================================================== */}
      {/* 1. SECTION HEADER (Requested Title, Subtitle, and Heading Label) */}
      {/* =================================================================== */}
      <div
        ref={headerRef}
        data-observe-id="header"
        className={`text-center max-w-2xl mx-auto mb-14 sm:mb-18 px-2 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          headerVisible
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-[0.98]'
        }`}
      >
        {/* Chapter Heading Label: ♡ Admiring You ♡ */}
        <div className="flex items-center justify-center gap-2 mb-2 text-[#A64D68]">
          <h2 className="font-handwriting text-2xl sm:text-3xl lg:text-4xl tracking-wider font-normal">
            ♡ Admiring You ♡
          </h2>
        </div>

        {/* Subtitle in Italic Letter Typography */}
        <p className="mt-2 text-sm sm:text-base text-[#7A5B64] font-letter italic leading-relaxed max-w-lg mx-auto">
          A little collection of the things that make you so beautifully yourself.
        </p>

        {/* Delicate divider with flower flourish */}
        <div className="mt-4 flex items-center justify-center gap-3 text-[#C7A66A]">
          <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#C7A66A]/50" />
          <Flower2 className="w-3.5 h-3.5 text-[#D99AA5]" />
          <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#C7A66A]/50" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. TOP ROW: FIRST THREE CARDS (Prominent 3-Column Desktop Layout) */}
      {/* =================================================================== */}
      {topThreeCards.length > 0 && (
        <div className="mb-10 sm:mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-serif font-semibold uppercase tracking-[0.2em] text-[#C7A66A]">
              Treasured Details · Part 1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 w-full">
            {topThreeCards.map((card, idx) => {
              const isRevealed = revealedIds[card.id] ?? false;
              const isVisible = visibleCards[card.id] || prefersReducedMotion;
              const staggerDelayMs = idx * 100;

              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-observe-id={`card-${card.id}`}
                  style={{
                    transitionDelay: prefersReducedMotion ? '0ms' : `${staggerDelayMs}ms`,
                  }}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-[0.98]'
                  }`}
                >
                  <FoldedScrapbookCard
                    card={card}
                    index={idx}
                    totalCards={cards.length}
                    isRevealed={isRevealed}
                    onToggleReveal={toggleReveal}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. MIDDLE SECTION: REMAINING CARDS (Balanced Multi-Column Grid) */}
      {/* =================================================================== */}
      {middleCards.length > 0 && (
        <div className="mb-10 sm:mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-serif font-semibold uppercase tracking-[0.2em] text-[#C7A66A]">
              Every Little Quality · Part 2
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-7 w-full">
            {middleCards.map((card, offsetIdx) => {
              const idx = offsetIdx + 3;
              const isRevealed = revealedIds[card.id] ?? false;
              const isVisible = visibleCards[card.id] || prefersReducedMotion;
              const staggerDelayMs = Math.min(offsetIdx * 60, 360);

              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-observe-id={`card-${card.id}`}
                  style={{
                    transitionDelay: prefersReducedMotion ? '0ms' : `${staggerDelayMs}ms`,
                  }}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-[0.98]'
                  }`}
                >
                  <FoldedScrapbookCard
                    card={card}
                    index={idx}
                    totalCards={cards.length}
                    isRevealed={isRevealed}
                    onToggleReveal={toggleReveal}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. FINAL GRAND CARD: SIMPLY EKTA ♡ (Larger Special Highlight) */}
      {/* =================================================================== */}
      {finalCard && (
        <div className="mb-6">
          <div className="text-center mb-6">
            <span className="text-xs font-serif font-semibold uppercase tracking-[0.22em] text-[#C7A66A] flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-[#C7A66A]/40" />
              Emotional Highlight ♡ Grand Finale
              <span className="h-px w-8 bg-[#C7A66A]/40" />
            </span>
          </div>

          <div
            ref={(el) => {
              cardRefs.current[13] = el;
            }}
            data-observe-id={`card-${finalCard.id}`}
            className={`w-full max-w-4xl mx-auto transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              visibleCards[finalCard.id] || prefersReducedMotion
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-10 scale-[0.98]'
            }`}
          >
            <FoldedScrapbookCard
              card={finalCard}
              index={13}
              totalCards={cards.length}
              isRevealed={revealedIds[finalCard.id] ?? false}
              onToggleReveal={toggleReveal}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. CHAPTER NAVIGATION */}
      {/* =================================================================== */}
      <div
        ref={navRef}
        data-observe-id="nav"
        className={`mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-[#F8DCE5]/80 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          navVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
      >
        {onPrevPage ? (
          <button
            onClick={onPrevPage}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] sm:min-h-[48px] px-6 py-3 rounded-full border border-[#A64D68]/40 hover:border-[#A64D68] text-[#A64D68] hover:bg-[#F8DCE5]/30 text-sm font-medium transition-all active:scale-98 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#A64D68]/40 cursor-pointer"
            aria-label="Return to Moments in Motion page"
          >
            <span>← Previous: Moments in Motion ♡</span>
          </button>
        ) : (
          <div className="hidden sm:block w-28" aria-hidden="true" />
        )}

        <div className="text-xs text-[#7A5B64] font-letter italic order-last sm:order-none py-1">
          Chapter 4 of 6 · Little Things That Make You, You
        </div>

        <button
          onClick={onContinueToQuestion}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[46px] sm:min-h-[48px] px-7 py-3 rounded-full bg-gradient-to-r from-[#A64D68] to-[#8E3E56] hover:from-[#933D56] hover:to-[#4A1D2B] text-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 group focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#A64D68]/40 cursor-pointer"
          aria-label="Go to There's No One Else in My Heart page"
        >
          <span>Next: There's No One Else in My Heart ♡</span>
          <Heart className="w-4 h-4 fill-white/80 group-hover:scale-125 transition-transform" aria-hidden="true" />
        </button>
      </div>

      {/* Love Shower Falling Hearts Animation Overlay (Kept continuously active for Ekta) */}
      <LoveShowerOverlay isActive={true} />
    </section>
  );
};
