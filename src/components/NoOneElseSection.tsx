import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Feather, ChevronRight, ChevronLeft, Flower2 } from 'lucide-react';
import { paperFlipAudio } from '../services/paperSound';

interface NoOneElseSectionProps {
  onNextPage: () => void;
  onPrevPage: () => void;
}

// Delicate SVG Pressed Botanical Corner Decoration
const BotanicalCorner: React.FC<{ className?: string; flipped?: boolean }> = ({
  className = '',
  flipped = false,
}) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none opacity-60 ${flipped ? '-scale-x-100' : ''} ${className}`}
    aria-hidden="true"
  >
    <path
      d="M10 70 C 20 40, 40 20, 70 10"
      stroke="#C9A66B"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M25 50 C 18 42, 22 34, 30 36 C 35 37, 33 46, 25 50 Z"
      fill="#F8E5E9"
      stroke="#D995A5"
      strokeWidth="0.8"
    />
    <path
      d="M45 32 C 40 22, 48 18, 54 22 C 58 25, 54 32, 45 32 Z"
      fill="#F8E5E9"
      stroke="#D995A5"
      strokeWidth="0.8"
    />
    <circle cx="70" cy="10" r="2.5" fill="#C9A66B" />
    <circle cx="62" cy="18" r="1.5" fill="#D995A5" />
    <circle cx="18" cy="62" r="1.5" fill="#D995A5" />
  </svg>
);

// Delicate Hand-drawn Rose Florets
const PressedRoseFlorets: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 100 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <path
      d="M2 12 H 38 M62 12 H 98"
      stroke="#C9A66B"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeDasharray="2 4"
    />
    <circle cx="50" cy="12" r="4.5" fill="#F8E5E9" stroke="#D995A5" strokeWidth="0.8" />
    <path
      d="M48 12 C 48 10, 52 10, 52 12 C 52 14, 48 14, 48 12 Z"
      fill="#D995A5"
    />
    <circle cx="41" cy="12" r="1.2" fill="#C9A66B" />
    <circle cx="59" cy="12" r="1.2" fill="#C9A66B" />
  </svg>
);

export const NoOneElseSection: React.FC<NoOneElseSectionProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [revealStep, setRevealStep] = useState(0);

  // Handwritten animation for the emotional highlight sentence
  const highlightFullTextPart1 =
    "If my heart has room for a thousand feelings, somehow, ";
  const highlightDustyRosePart =
    "every single one of them leads back to you";
  const highlightFullTextPart2 =
    ". And it's you, only you, who has made me understand what it means to feel this deeply. ♡";

  const fullHighlightString = `${highlightFullTextPart1}${highlightDustyRosePart}${highlightFullTextPart2}`;
  const [handwrittenCharIndex, setHandwrittenCharIndex] = useState(0);
  const [isHandwritingDone, setIsHandwritingDone] = useState(false);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  // Reduced motion preference detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Subtle page turn audio on mount
  useEffect(() => {
    try {
      paperFlipAudio.play('next');
    } catch {
      // safe fallback
    }
  }, []);

  // Natural progressive reading reveal:
  // 1: Heading
  // 2: Paragraph 1
  // 3: Paragraph 2 ("And that someone is you.")
  // 4: Paragraph 3
  // 5: Paragraph 4
  // 6: Paragraph 5
  // 7: Paragraph 6 (slower reveal)
  // 8: Emotional Highlight Section
  // 9: Final Signature
  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealStep(9);
      setHandwrittenCharIndex(fullHighlightString.length);
      setIsHandwritingDone(true);
      return;
    }

    const stepTimings = [
      { step: 1, delay: 200 },   // Heading
      { step: 2, delay: 600 },   // Para 1
      { step: 3, delay: 1300 },  // Para 2: "And that someone is you."
      { step: 4, delay: 2100 },  // Para 3
      { step: 5, delay: 3000 },  // Para 4
      { step: 6, delay: 3900 },  // Para 5
      { step: 7, delay: 5100 },  // Para 6 (slower reveal)
      { step: 8, delay: 6400 },  // Highlight start
    ];

    const timeouts = stepTimings.map(({ step, delay }) =>
      setTimeout(() => {
        setRevealStep(step);
      }, delay)
    );

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [prefersReducedMotion, fullHighlightString.length]);

  // Handwritten character-by-character typing animation when step 8 is reached
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (revealStep < 8) return;
    if (handwrittenCharIndex >= fullHighlightString.length) {
      setIsHandwritingDone(true);
      setTimeout(() => setRevealStep(9), 400); // Reveal signature at the very end
      return;
    }

    // Natural varied pen cadence: average ~28ms per character
    const char = fullHighlightString[handwrittenCharIndex];
    const isPunctuation = char === ',' || char === '.' || char === '—';
    const cadence = isPunctuation ? 180 : 26 + Math.floor(Math.random() * 18);

    const timer = setTimeout(() => {
      setHandwrittenCharIndex((prev) => prev + 1);
    }, cadence);

    return () => clearTimeout(timer);
  }, [revealStep, handwrittenCharIndex, fullHighlightString, prefersReducedMotion]);

  // Click to skip handwritten animation
  const handleSkipTyping = () => {
    setHandwrittenCharIndex(fullHighlightString.length);
    setIsHandwritingDone(true);
    setRevealStep(9);
  };

  // Split written progress into the three parts
  const p1Len = highlightFullTextPart1.length;
  const pRoseLen = highlightDustyRosePart.length;

  const currentPart1 = fullHighlightString.slice(0, Math.min(handwrittenCharIndex, p1Len));
  const currentDustyRose =
    handwrittenCharIndex > p1Len
      ? fullHighlightString.slice(p1Len, Math.min(handwrittenCharIndex, p1Len + pRoseLen))
      : '';
  const currentPart2 =
    handwrittenCharIndex > p1Len + pRoseLen
      ? fullHighlightString.slice(p1Len + pRoseLen, handwrittenCharIndex)
      : '';

  const showHeart =
    handwrittenCharIndex >= fullHighlightString.length || prefersReducedMotion;

  return (
    <section
      id="no-one-else-section"
      className="py-12 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-20 w-full scroll-mt-20 will-change-transform"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-label="Chapter 5: There's No One Else in My Heart ♡"
    >
      {/* =================================================================== */}
      {/* 1. CHAPTER HEADING (ELEGANT HANDWRITTEN SCRIPT & GOLD DIVIDER)      */}
      {/* =================================================================== */}
      <div
        className={`text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-2 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          revealStep >= 1
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-6 scale-[0.98]'
        }`}
      >
        {/* Small Heading Label & Floral Ornament */}
        <div className="flex items-center justify-center gap-2 mb-2.5 text-[#D995A5]">
          <span className="font-handwriting text-2xl sm:text-3xl text-[#754052] tracking-wider">
            ♡ A Confession from My Heart ♡
          </span>
        </div>

        {/* Chapter Title in Burgundy Editorial Typography */}
        <h1 className="font-heading font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A1D2B] font-semibold leading-tight tracking-tight">
          There's No One Else in My Heart ♡
        </h1>

        {/* Subtitle in Italic Literary Lora */}
        <p className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-[#754052] font-letter italic leading-relaxed max-w-xl mx-auto">
          “Some feelings are too deep for words, but I'll try to put mine into a little letter for you.”
        </p>

        {/* Thin Champagne-Gold Decorative Divider with Botanical Rose Florette */}
        <div className="mt-5 flex items-center justify-center">
          <PressedRoseFlorets className="w-48 sm:w-64 h-auto" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. THE COMPLETE VINTAGE PARCHMENT LETTER CONTAINER                  */}
      {/* =================================================================== */}
      <div
        className="relative bg-[#FFF9F0] rounded-[28px] sm:rounded-[36px] border border-[#E5BCC5]/80 shadow-[0_20px_60px_rgba(74,29,43,0.08),0_4px_18px_rgba(201,166,107,0.12)] p-6 sm:p-10 md:p-14 overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 12%, rgba(201, 166, 107, 0.06) 0%, transparent 40%), radial-gradient(circle at 90% 88%, rgba(217, 149, 165, 0.08) 0%, transparent 50%), linear-gradient(to bottom, #FFFDF8, #FFF9F0)',
        }}
      >
        {/* Authentic Decorative Washi Tape on Top Center */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-6 sm:h-7 bg-[#F8E5E9]/90 border-y border-[#D995A5]/60 shadow-xs backdrop-blur-2xs rounded-xs pointer-events-none z-30 rotate-1"
          style={{
            clipPath:
              'polygon(0% 0%, 4% 10%, 8% 0%, 92% 0%, 96% 10%, 100% 0%, 98% 50%, 100% 100%, 96% 90%, 92% 100%, 8% 100%, 4% 90%, 0% 100%, 2% 50%)',
          }}
        >
          <div className="absolute inset-x-2 top-0 h-px bg-white/70" />
          <div className="absolute inset-x-2 bottom-0 h-px bg-[#754052]/20" />
        </div>

        {/* Delicate Botanical Corner Ornaments */}
        <BotanicalCorner className="absolute top-3 left-3 w-16 sm:w-22 h-auto text-[#C9A66B]" />
        <BotanicalCorner className="absolute top-3 right-3 w-16 sm:w-22 h-auto text-[#C9A66B]" flipped />
        <BotanicalCorner className="absolute bottom-3 left-3 w-16 sm:w-22 h-auto text-[#C9A66B] rotate-180" flipped />
        <BotanicalCorner className="absolute bottom-3 right-3 w-16 sm:w-22 h-auto text-[#C9A66B] rotate-180" />

        {/* Subtle Double Inner Border with Filigree Accent */}
        <div className="absolute inset-3 sm:inset-4 rounded-[22px] sm:rounded-[30px] border border-[#C9A66B]/30 pointer-events-none" />

        {/* Letter Metadata Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#F8E5E9] pb-3 mb-6 sm:mb-8 text-xs text-[#9A817B]">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#754052] tracking-wider text-[11px] sm:text-xs uppercase">
              Chapter 05
            </span>
            <span aria-hidden="true" className="text-[#C9A66B]">·</span>
            <span className="font-letter italic text-[11px] sm:text-xs text-[#754052]/80">
              A Personal Confession ♡
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#D995A5] font-letter italic text-[11px] sm:text-xs">
            <Heart className="w-3 h-3 fill-[#F8E5E9] text-[#D995A5]" />
            <span>Dedicated to Ekta</span>
          </div>
        </div>

        {/* Main Letter Body (All 6 Paragraphs Exactly as Written) */}
        <div className="relative z-10 space-y-5 sm:space-y-6 text-[#3D1A24] font-letter text-base sm:text-lg md:text-[1.18rem] leading-relaxed sm:leading-[2.05]">
          {/* Paragraph 1 */}
          <p
            className={`transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              revealStep >= 2
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Ekta, sometimes I wonder how I'm supposed to explain a feeling that has become such a big part of me. It's not that I haven't met other people or that I don't know there are millions of beautiful souls in this world. It's just that, somewhere along the way, my heart found someone it never wanted to look beyond.
          </p>

          {/* Paragraph 2 — Tender Emotional Standalone Reveal */}
          <div
            className={`my-6 py-3 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-[#FFF5F8] to-[#FFF9F2] border-l-3 border-[#D995A5] shadow-2xs transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              revealStep >= 3
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-[0.98]'
            }`}
          >
            <p className="font-handwriting text-2xl sm:text-3xl text-[#754052] tracking-wide font-normal">
              And that someone is you.
            </p>
          </div>

          {/* Paragraph 3 */}
          <p
            className={`transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              revealStep >= 4
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            I don't think I could ever look at someone else and feel what I feel when I look at you. Not because I believe you're perfect, but because there's something about you that feels irreplaceable to me. Your eyes, your smile, your voice, your little ways of being yourself — somehow, all of it has found a place in my heart that nobody else could take.
          </p>

          {/* Paragraph 4 */}
          <p
            className={`transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              revealStep >= 5
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            Sometimes it feels like all the love I've carried inside me has been waiting for you. Like there's no other name my heart wants to whisper, no other smile it wishes to see, and no other person it wants to share all those little moments with.
          </p>

          {/* Paragraph 5 */}
          <p
            className={`transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              revealStep >= 6
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            I don't know what tomorrow holds, and I would never want you to feel that you owe me the same feelings. But I want you to know something: if I ever get the chance to love you, I'll have so much love, patience, care, and tenderness to give.
          </p>

          {/* Paragraph 6 (Slightly slower, more deliberate reveal) */}
          <p
            className={`font-medium text-[#4A1D2B] transition-all duration-1200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              revealStep >= 7
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5'
            }`}
          >
            Because, Ekta, I don't want to search for someone else when my heart already knows who it wishes to choose.
          </p>
        </div>

        {/* Subtle Decorative Floral Divider */}
        <div className="relative z-10 my-8 sm:my-10 flex items-center justify-center gap-3 text-[#C9A66B]">
          <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#C9A66B]/50 to-transparent" />
          <Heart className="w-3.5 h-3.5 fill-[#F8E5E9] text-[#C9A66B]" />
          <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#C9A66B]/50 to-transparent" />
        </div>

        {/* =================================================================== */}
        {/* 3. SPECIAL FINAL LINE — THE EMOTIONAL HIGHLIGHT                    */}
        {/* Separate letter-style section, handwritten animation, dusty rose    */}
        {/* =================================================================== */}
        <div
          ref={highlightRef}
          className={`relative z-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            revealStep >= 8
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-[0.98]'
          }`}
        >
          <div
            onClick={!isHandwritingDone ? handleSkipTyping : undefined}
            className={`relative rounded-2xl sm:rounded-3xl bg-[#FFFDF8] border-2 border-[#D995A5]/80 p-6 sm:p-9 shadow-[0_12px_36px_rgba(74,29,43,0.07),0_2px_10px_rgba(201,166,107,0.18)] ${
              !isHandwritingDone ? 'cursor-pointer' : ''
            }`}
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(248, 229, 233, 0.4) 0%, transparent 70%)',
            }}
            title={!isHandwritingDone ? 'Click to reveal immediately' : undefined}
          >
            {/* Small Champagne-Gold Heart Illustration on Top */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFF9F0] border border-[#C9A66B]/60 shadow-xs flex items-center justify-center text-[#C9A66B]">
                <Heart className="w-5 h-5 fill-[#C9A66B] text-[#C9A66B] animate-pulse" />
              </div>
            </div>

            {/* Handwritten Script Typography (Noticeably larger than main text) */}
            <div className="text-center max-w-2xl mx-auto">
              <p
                className="font-handwriting text-xl sm:text-2xl md:text-3xl text-[#4A1D2B] leading-relaxed sm:leading-loose tracking-wide"
                aria-live="polite"
              >
                {/* Part 1 */}
                <span>{currentPart1}</span>

                {/* Highlight in Dusty Rose */}
                {currentDustyRose && (
                  <span className="text-[#C77D91] font-semibold underline decoration-[#D995A5]/50 decoration-wavy decoration-1 underline-offset-4">
                    {currentDustyRose}
                  </span>
                )}

                {/* Part 2 */}
                <span>{currentPart2}</span>

                {/* Animated Pulsing Heart at End */}
                {showHeart && (
                  <span className="inline-block ml-1 text-[#C77D91] align-middle">
                    <Heart className="inline w-5 h-5 sm:w-6 sm:h-6 fill-[#C77D91] text-[#C77D91] animate-pulse inline-block align-baseline" />
                  </span>
                )}

                {/* Blinking quill cursor during active handwriting */}
                {!isHandwritingDone && !prefersReducedMotion && (
                  <span className="inline-block w-1.5 h-5 sm:h-6 bg-[#C9A66B] ml-1 animate-pulse align-middle" />
                )}
              </p>

              {/* Gentle Skip Prompt if typing is in progress */}
              {!isHandwritingDone && !prefersReducedMotion && (
                <p className="mt-3 text-[11px] font-letter italic text-[#9A817B]">
                  (Handwriting in progress · click anywhere to reveal fully)
                </p>
              )}
            </div>

            {/* The Signature at the Very End */}
            <div
              className={`mt-6 pt-5 border-t border-[#F8E5E9] text-center transition-all duration-1000 ${
                revealStep >= 9 || isHandwritingDone
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              }`}
            >
              <span className="font-handwriting text-2xl sm:text-3xl md:text-4xl text-[#754052] tracking-wider block">
                Always, with affection ♡
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. CHAPTER NAVIGATION BUTTONS (PREV / NEXT)                         */}
      {/* =================================================================== */}
      <div className="mt-12 sm:mt-16 pt-8 border-t border-[#F8E5E9] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Button to Little Things */}
        <button
          type="button"
          onClick={onPrevPage}
          className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full border border-[#D995A5] hover:border-[#754052] text-[#754052] bg-[#FFFDF8] hover:bg-[#F8E5E9]/50 text-xs sm:text-sm font-medium transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
          aria-label="Return to Little Things that Make You, You"
        >
          <ChevronLeft className="w-4 h-4 text-[#754052]" />
          <span>← Previous: Little Things</span>
        </button>

        {/* Center Chapter Indicator */}
        <div className="text-xs text-[#9A817B] font-letter italic text-center">
          Dedicated Page 5 of 6 · There's No One Else in My Heart ♡
        </div>

        {/* Next Button to Questions */}
        <button
          type="button"
          onClick={onNextPage}
          className="inline-flex items-center gap-2 min-h-[44px] px-7 py-2.5 rounded-full bg-gradient-to-r from-[#754052] to-[#4A1D2B] hover:from-[#5A2C3C] hover:to-[#38141F] text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          aria-label="Continue to Questions chapter"
        >
          <span>Next: Questions ♡</span>
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </section>
  );
};
