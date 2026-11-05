import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, Sparkles, Heart, Edit3, Film, Image } from 'lucide-react';
import { LittleThingCard } from '../config/proposalConfig';
import { renderScrapbookIllustration } from './ScrapbookIllustrations';
import { ScrapbookVideoPlayer } from './ScrapbookVideoPlayer';

interface FoldedScrapbookCardProps {
  card: LittleThingCard;
  index: number;
  totalCards: number;
  isRevealed: boolean;
  onToggleReveal: (id: string) => void;
  isOwnerMode?: boolean;
  onEditCard?: (card: LittleThingCard) => void;
  prefersReducedMotion?: boolean;
}

// Organic subtle rotations for authentic scrapbook feel
const ROTATION_CLASSES = [
  '-rotate-[0.6deg]',
  'rotate-[0.7deg]',
  '-rotate-[0.5deg]',
  'rotate-[0.6deg]',
  '-rotate-[0.7deg]',
  'rotate-[0.5deg]',
];

// Washi Tape rotations
const TAPE_ROTATIONS = ['-rotate-2', 'rotate-1.5', '-rotate-1', 'rotate-2', '-rotate-1.5'];

export const FoldedScrapbookCard: React.FC<FoldedScrapbookCardProps> = ({
  card,
  index,
  totalCards,
  isRevealed,
  onToggleReveal,
  isOwnerMode = false,
  onEditCard,
  prefersReducedMotion = false,
}) => {
  const isHeroCard = index < 3;
  const isFinalCard = index === totalCards - 1 || card.id === 'lt-14' || card.iconType === 'simply-ekta';
  const rotationClass = isFinalCard ? 'rotate-0' : ROTATION_CLASSES[index % ROTATION_CLASSES.length];
  const tapeRotation = TAPE_ROTATIONS[index % TAPE_ROTATIONS.length];
  const cardNum = String(index + 1).padStart(2, '0');

  // Split multi-paragraph content cleanly
  const paragraphs = card.content.split('\n\n').filter(Boolean);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div
      className={`relative w-full ${isFinalCard ? 'max-w-4xl mx-auto' : ''}`}
      style={{ willChange: 'transform' }}
    >
      {/* =================================================================== */}
      {/* AUTHENTIC DECORATIVE WASHI TAPE ON CARD TOP */}
      {/* =================================================================== */}
      <div
        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 sm:w-34 h-6 sm:h-7 bg-[#F8DCE5]/85 border-y border-[#E2A9B8]/50 shadow-xs backdrop-blur-2xs rounded-xs pointer-events-none z-30 transition-transform duration-300 ${tapeRotation}`}
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(166, 77, 104, 0.07) 5px, rgba(166, 77, 104, 0.07) 10px)',
          clipPath:
            'polygon(0% 0%, 4% 5%, 8% 0%, 12% 5%, 16% 0%, 20% 5%, 24% 0%, 28% 5%, 32% 0%, 36% 5%, 40% 0%, 44% 5%, 48% 0%, 52% 5%, 56% 0%, 60% 5%, 64% 0%, 68% 5%, 72% 0%, 76% 5%, 80% 0%, 84% 5%, 88% 0%, 92% 5%, 96% 0%, 100% 5%, 98% 50%, 100% 95%, 96% 100%, 92% 95%, 88% 100%, 84% 95%, 80% 100%, 76% 95%, 72% 100%, 68% 95%, 64% 100%, 60% 95%, 56% 100%, 52% 95%, 48% 100%, 44% 95%, 40% 100%, 36% 95%, 32% 100%, 28% 95%, 24% 100%, 20% 95%, 16% 100%, 12% 95%, 8% 100%, 4% 95%, 0% 100%, 2% 50%)',
        }}
      >
        <div className="absolute inset-x-2 top-0 h-px bg-white/60" />
        <div className="absolute inset-x-2 bottom-0 h-px bg-[#A64D68]/20" />
      </div>

      {/* =================================================================== */}
      {/* MAIN VINTAGE IVORY SCRAPBOOK CARD CONTAINER */}
      {/* =================================================================== */}
      <div
        className={`group relative bg-[#FFFDF8] rounded-[24px] sm:rounded-[28px] border ${
          isFinalCard
            ? 'border-[#C7A66A]/90 shadow-[0_18px_50px_rgba(74,29,43,0.11),0_4px_16px_rgba(199,166,106,0.2)]'
            : isHeroCard
            ? 'border-[#E2A9B8] shadow-[0_14px_38px_rgba(74,29,43,0.08),0_3px_12px_rgba(199,166,106,0.15)]'
            : 'border-[#E5BCC5]/90 shadow-[0_12px_32px_rgba(74,29,43,0.07),0_2px_8px_rgba(199,166,106,0.12)]'
        } p-5 sm:p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_22px_52px_rgba(74,29,43,0.13),0_6px_20px_rgba(199,166,106,0.22)] ${rotationClass} hover:rotate-0 flex flex-col justify-between`}
      >
        {/* Subtle Gold Filigree Inner Border Accent */}
        <div
          className={`absolute inset-2 sm:inset-2.5 rounded-[18px] sm:rounded-[22px] border ${
            isFinalCard ? 'border-[#C7A66A]/50 border-dashed' : 'border-[#C7A66A]/25'
          } pointer-events-none`}
        />

        {/* Top Decorative Header: Card Number & Quiet Metadata */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-[#9A817B]">
            <span className="font-serif font-bold text-[#A64D68] tracking-wider text-[11px] sm:text-xs">
              CARD {cardNum}
            </span>
            <span aria-hidden="true" className="text-[#C7A66A]">·</span>
            <span className="font-letter italic text-[11px] sm:text-xs text-[#7A5B64]">
              {isFinalCard ? 'Grand Finale ♡' : `Scrapbook Page ${index + 1}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerMode && onEditCard && (
              <button
                type="button"
                onClick={() => onEditCard(card)}
                className="min-w-[36px] min-h-[36px] p-1.5 text-[#5A3545]/60 hover:text-[#A64D68] hover:bg-[#F8DCE5]/40 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                title="Edit card"
                aria-label={`Edit ${card.title}`}
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
            <span className="text-[11px] text-[#A64D68] font-letter italic flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 fill-[#F8DCE5] text-[#A64D68]" />
              {isRevealed ? 'Unfolded' : 'Folded'}
            </span>
          </div>
        </div>

        {/* Card Title in Burgundy Typography */}
        <div className="relative z-10 text-center mb-2">
          <h3
            className={`font-heading font-serif text-[#4A1D2B] font-semibold tracking-tight ${
              isFinalCard
                ? 'text-2xl sm:text-3xl lg:text-4xl'
                : isHeroCard
                ? 'text-xl sm:text-2xl'
                : 'text-lg sm:text-xl'
            }`}
          >
            {card.title}
          </h3>
          <p className="text-xs text-[#9A817B] font-letter italic mt-0.5">
            {isFinalCard
              ? 'The final page of my love letter, written just for you'
              : 'A quiet, genuine detail kept close to my heart'}
          </p>
        </div>

        {/* Media Toggle when Video Memory is available */}
        {card.videoUrl && (
          <div className="relative z-10 flex items-center justify-center gap-1.5 mb-2">
            <button
              type="button"
              onClick={() => setShowVideo(false)}
              className={`inline-flex items-center gap-1 min-h-[30px] px-2.5 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer ${
                !showVideo
                  ? 'bg-[#A64D68] text-white shadow-xs font-semibold'
                  : 'bg-[#F8DCE5]/50 hover:bg-[#F8DCE5] text-[#7A5B64]'
              }`}
              title="View artistic illustration"
            >
              <Image className="w-3 h-3" />
              <span>Art View</span>
            </button>
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className={`inline-flex items-center gap-1 min-h-[30px] px-2.5 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer ${
                showVideo
                  ? 'bg-[#A64D68] text-white shadow-xs font-semibold'
                  : 'bg-[#F8DCE5]/70 hover:bg-[#F8DCE5] text-[#A64D68] font-medium border border-[#E2A9B8]'
              }`}
              title="Watch video memory with custom playback progress bar"
            >
              <Film className="w-3 h-3" />
              <span>Video Memory ♡</span>
            </button>
          </div>
        )}

        {/* Dedicated Media Area: Vector Illustration OR Video Player with Custom Progress Bar */}
        {card.videoUrl && showVideo ? (
          <div className="relative z-10 my-2">
            <ScrapbookVideoPlayer
              videoUrl={card.videoUrl}
              posterUrl={card.videoPoster}
              title={card.videoTitle || card.title}
              caption={card.videoCaption}
              autoPlay={false}
              className="w-full"
            />
          </div>
        ) : (
          <div
            className={`relative z-10 my-2 py-2 px-3 rounded-2xl bg-[#FFFDF9]/85 border border-[#F8DCE5]/70 shadow-inner flex items-center justify-center overflow-hidden ${
              isFinalCard ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FFF5F8]' : ''
            }`}
          >
            {renderScrapbookIllustration(
              card.iconType,
              isFinalCard
                ? 'w-full h-48 sm:h-56'
                : isHeroCard
                ? 'w-full h-38 sm:h-44'
                : 'w-full h-32 sm:h-36'
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* FOLDED PAPER BODY & SMOOTH 3D PAPER-FOLD UNVEIL INTERACTION */}
        {/* =================================================================== */}
        <div className="relative z-10 mt-3">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              /* FOLDED STATE (Flap with Crease & Tap to Unfold) */
              <motion.div
                key="folded"
                initial={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                {/* Paper Fold Crease Line */}
                <div className="w-full my-2 flex items-center justify-center gap-2">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E2A9B8]/60 to-transparent border-b border-dashed border-[#E2A9B8]/40" />
                  <span className="text-[10px] font-letter text-[#C7A66A] uppercase tracking-widest px-1">
                    Folded Page Crease
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E2A9B8]/60 to-transparent border-b border-dashed border-[#E2A9B8]/40" />
                </div>

                {/* Tap to Unfold Button / Sealed Flap Look */}
                <button
                  type="button"
                  onClick={() => onToggleReveal(card.id)}
                  className={`w-full py-3.5 px-4 rounded-2xl ${
                    isFinalCard
                      ? 'bg-gradient-to-b from-[#FFFDF9] via-[#FFF5F8] to-[#F8DCE5]/60 hover:to-[#F8DCE5]/80 border-2 border-dashed border-[#C7A66A]'
                      : 'bg-gradient-to-b from-[#FFFDF9] to-[#FFF8ED] hover:from-[#FFF8ED] hover:to-[#FFF3E0] border-2 border-dashed border-[#D99AA5]/80'
                  } text-center cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group/tap`}
                  aria-label={`Unfold ${card.title}`}
                >
                  <p className="text-xs sm:text-sm text-[#4A1D2B]/80 font-letter italic mb-2 line-clamp-1">
                    "{paragraphs[0].slice(0, 70)}..."
                  </p>

                  <div className="inline-flex items-center justify-center gap-2 min-h-[40px] px-5 py-2 rounded-full bg-gradient-to-r from-[#F8DCE5] to-[#FFF5F8] text-[#A64D68] border border-[#E2A9B8] text-xs font-semibold shadow-2xs group-hover/tap:bg-[#F8DCE5] group-hover/tap:scale-[1.02] transition-all">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#C7A66A]" aria-hidden="true" />
                    <span>Tap to unfold complete letter ♡</span>
                  </div>
                </button>
              </motion.div>
            ) : (
              /* UNFOLDED STATE (Full Letter Revealed with smooth 3D unfold) */
              <motion.div
                key="unfolded"
                initial={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: 0,
                        rotateX: -18,
                        transformOrigin: 'top',
                      }
                }
                animate={{
                  opacity: 1,
                  rotateX: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: 0,
                        rotateX: -15,
                        transition: { duration: 0.3 },
                      }
                }
                style={{ perspective: 1200 }}
                className={`rounded-2xl ${
                  isFinalCard
                    ? 'bg-[#FFFDF9] border border-[#C7A66A]/60 p-5 sm:p-8'
                    : 'bg-[#FFFDF9]/95 border border-[#F8DCE5] p-4.5 sm:p-6'
                } shadow-inner relative overflow-hidden`}
              >
                {/* Vintage Letterhead Fine Lines */}
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C7A66A]/20 via-[#D99AA5]/40 to-[#C7A66A]/20 pointer-events-none"
                  aria-hidden="true"
                />

                {/* The Complete Unabridged Descriptions */}
                <div className="space-y-3.5 sm:space-y-4 text-sm sm:text-base text-[#3D1A24] font-letter leading-relaxed sm:leading-loose">
                  {paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-justify sm:text-left">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Optional Video Memory Button with Custom Progress Bar */}
                {card.videoUrl && !showVideo && (
                  <div className="pt-2 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setShowVideo(true)}
                      className="inline-flex items-center gap-2 min-h-[36px] px-3.5 py-1.5 rounded-full bg-[#FFF0F4] hover:bg-[#F8DCE5] text-[#A64D68] border border-[#E2A9B8]/70 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5 text-[#A64D68]" />
                      <span>Watch Video Memory with Custom Scrubber ♡</span>
                    </button>
                  </div>
                )}

                {/* Closing Signature for Card 14 or Standard cards */}
                <div className="mt-5 pt-3.5 border-t border-[#F8DCE5]/80 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    {isFinalCard ? (
                      <span className="font-handwriting text-xl sm:text-2xl text-[#4A1D2B] tracking-wider block">
                        Always, with affection ♡
                      </span>
                    ) : (
                      <span className="font-handwriting text-lg sm:text-xl text-[#A64D68] tracking-wide">
                        Always true in my heart ♡
                      </span>
                    )}
                  </div>

                  {/* Small "Fold back ♡" control */}
                  <button
                    type="button"
                    onClick={() => onToggleReveal(card.id)}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-medium text-[#7A5B64] hover:text-[#4A1D2B] hover:bg-[#F8DCE5]/40 border border-[#E2A9B8]/40 transition-colors active:scale-95 cursor-pointer"
                    aria-label={`Fold back ${card.title}`}
                  >
                    <span>Fold back ♡</span>
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
