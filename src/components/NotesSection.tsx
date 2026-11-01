import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Film,
  Sparkles,
  Heart,
  Video,
  X,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { DiaryNote } from '../types/notes';
import { ReelItem, reelsData } from '../content/reels';

interface NotesSectionProps {
  notes?: DiaryNote[];
  isOwnerMode?: boolean;
  onUpdateNotes?: (notes: DiaryNote[]) => void;
  activeTab?: 'shared' | 'private';
  onTabChange?: (tab: 'shared' | 'private') => void;
  onSwitchToOwnerMode?: () => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

// -----------------------------------------------------------------------------
// Dedicated Video Viewer Overlay Component
// -----------------------------------------------------------------------------
export interface VideoViewerOverlayProps {
  initialReel: ReelItem | null;
  allReels?: ReelItem[];
  onClose: () => void;
  likedReelIds: number[];
  onToggleLike: (reel: ReelItem) => void;
}

export const VideoViewerOverlay: React.FC<VideoViewerOverlayProps> = ({
  initialReel,
  allReels = reelsData,
  onClose,
  likedReelIds,
  onToggleLike,
}) => {
  const activePlayableReels = allReels.filter(
    (r) => Boolean(r.videoUrl && r.videoUrl.trim().length > 0)
  );

  const isSelectedPlayable = Boolean(
    initialReel?.videoUrl && initialReel.videoUrl.trim().length > 0
  );

  const initialIndex = isSelectedPlayable
    ? Math.max(
        0,
        activePlayableReels.findIndex((r) => r.id === initialReel?.id)
      )
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isClosing, setIsClosing] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Real-time drag tracking & smooth scroll physics state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState<string>('none');
  const [cardOpacity, setCardOpacity] = useState<number>(1);

  // Floating heart burst particles on clicking Like
  const [floatingHearts, setFloatingHearts] = useState<
    Array<{ id: number; offsetX: number; emoji: string }>
  >([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const lastTouchYRef = useRef<number>(0);
  const isDirectionLockedRef = useRef<boolean>(false);
  const isSwipingVerticalRef = useRef<boolean>(false);
  const wheelDebounceRef = useRef<boolean>(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secondFrameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentReel = isSelectedPlayable
    ? activePlayableReels[currentIndex] || initialReel
    : initialReel;

  const isCurrentReelLiked = currentReel ? likedReelIds.includes(currentReel.id) : false;

  const formatReelNumber = (id: number) => {
    return `REEL ${String(id).padStart(2, '0')}`;
  };

  // Clean up any pending animation timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (secondFrameTimeoutRef.current) clearTimeout(secondFrameTimeoutRef.current);
    };
  }, []);

  const handleTriggerClose = useCallback(() => {
    if (isClosing) return;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (secondFrameTimeoutRef.current) clearTimeout(secondFrameTimeoutRef.current);
    setIsClosing(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      onClose();
      setIsClosing(false);
    }, 200);
  }, [isClosing, onClose]);

  // Buttery-smooth, hardware-accelerated slide transition between video reels
  const triggerReelTransition = useCallback(
    (direction: 'next' | 'prev') => {
      if (isTransitioning || activePlayableReels.length <= 1) return;
      setIsTransitioning(true);
      setVideoError(false);

      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (secondFrameTimeoutRef.current) clearTimeout(secondFrameTimeoutRef.current);

      // Pause current video to save CPU/GPU during transition
      if (videoRef.current) {
        videoRef.current.pause();
      }

      // Phase 1: Rapid, smooth exit slide
      const exitDistance = direction === 'next' ? -window.innerHeight * 0.75 : window.innerHeight * 0.75;
      setTransitionStyle('transform 0.20s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.18s ease-out');
      setDragY(exitDistance);
      setCardOpacity(0.05);

      // Phase 2: Switch index and place incoming reel at opposite edge
      animationTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => {
          if (direction === 'next') {
            return (prev + 1) % activePlayableReels.length;
          } else {
            return prev === 0 ? activePlayableReels.length - 1 : prev - 1;
          }
        });

        // Instant reposition at entrance boundary
        const entranceDistance = direction === 'next' ? window.innerHeight * 0.7 : -window.innerHeight * 0.7;
        setTransitionStyle('none');
        setDragY(entranceDistance);
        setCardOpacity(0.3);

        // Phase 3: Silky-smooth spring glide into center
        secondFrameTimeoutRef.current = setTimeout(() => {
          setTransitionStyle('transform 0.30s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out');
          setDragY(0);
          setCardOpacity(1);

          setTimeout(() => {
            setIsTransitioning(false);
            setTransitionStyle('none');
          }, 320);
        }, 16);
      }, 200);
    },
    [activePlayableReels.length, isTransitioning]
  );

  const handleNextReel = useCallback(() => {
    triggerReelTransition('next');
  }, [triggerReelTransition]);

  const handlePrevReel = useCallback(() => {
    triggerReelTransition('prev');
  }, [triggerReelTransition]);

  // Handle Like Button click: triggers persistent state update, floating animation & backend email notification
  const handleLikeClick = (reelToLike: ReelItem) => {
    const burstId = Date.now();
    const burstParticles = [
      { id: burstId + 1, offsetX: -22, emoji: '♡' },
      { id: burstId + 2, offsetX: -7, emoji: '❤️' },
      { id: burstId + 3, offsetX: 7, emoji: '✨' },
      { id: burstId + 4, offsetX: 22, emoji: '♡' },
    ];
    setFloatingHearts((prev) => [...prev, ...burstParticles]);
    setTimeout(() => {
      setFloatingHearts((prev) =>
        prev.filter((p) => !burstParticles.some((bp) => bp.id === p.id))
      );
    }, 1250);

    onToggleLike(reelToLike);
  };

  // Keyboard navigation & Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleTriggerClose();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevReel();
      }
    };

    if (currentReel) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentReel, handleTriggerClose, handleNextReel, handlePrevReel]);

  // Autoplay and loop video when active reel changes
  useEffect(() => {
    if (videoRef.current && currentReel?.videoUrl) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [currentReel?.id, currentReel?.videoUrl]);

  // Continuous Mobile Touch Drag & Swipe Tracking (1:1 instant tracking)
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent swipe drag if touching interactive buttons or links
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, textarea, [data-interactive="true"]')) {
      return;
    }
    if (isTransitioning || activePlayableReels.length <= 1) return;

    touchStartYRef.current = e.touches[0].clientY;
    touchStartXRef.current = e.touches[0].clientX;
    lastTouchYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isDirectionLockedRef.current = false;
    isSwipingVerticalRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || touchStartXRef.current === null || isTransitioning) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - touchStartYRef.current;
    const deltaX = currentX - touchStartXRef.current;

    if (!isDirectionLockedRef.current) {
      if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) {
        isDirectionLockedRef.current = true;
        if (Math.abs(deltaY) >= Math.abs(deltaX)) {
          isSwipingVerticalRef.current = true;
        } else {
          isSwipingVerticalRef.current = false;
          return;
        }
      } else {
        return;
      }
    }

    if (!isSwipingVerticalRef.current) return;

    lastTouchYRef.current = currentY;
    setIsDragging(true);
    setTransitionStyle('none');

    // 1:1 direct finger tracking with natural tactile response
    setDragY(deltaY);

    // Subtle opacity feedback as user pulls
    const dragDistance = Math.abs(deltaY);
    const progress = Math.min(dragDistance / 350, 1);
    setCardOpacity(1 - progress * 0.18);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || !isSwipingVerticalRef.current || isTransitioning) {
      touchStartYRef.current = null;
      touchStartXRef.current = null;
      isSwipingVerticalRef.current = false;
      return;
    }

    const endY = e.changedTouches[0]?.clientY ?? lastTouchYRef.current;
    const deltaY = endY - touchStartYRef.current;
    const duration = Math.max(Date.now() - touchStartTimeRef.current, 1);
    const velocity = deltaY / duration; // px per millisecond

    setIsDragging(false);
    touchStartYRef.current = null;
    touchStartXRef.current = null;
    isSwipingVerticalRef.current = false;

    // Swipe UP (finger moved up) -> Advance to NEXT reel
    if (deltaY < -45 || (deltaY < -15 && velocity < -0.28)) {
      triggerReelTransition('next');
    }
    // Swipe DOWN (finger moved down) -> Return to PREVIOUS reel
    else if (deltaY > 45 || (deltaY > 15 && velocity > 0.28)) {
      triggerReelTransition('prev');
    }
    // Released before threshold -> Snappy spring back to center
    else {
      setTransitionStyle('transform 0.26s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.22s ease-out');
      setDragY(0);
      setCardOpacity(1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 32 || wheelDebounceRef.current || isTransitioning) return;
    wheelDebounceRef.current = true;
    setTimeout(() => {
      wheelDebounceRef.current = false;
    }, 450);

    if (e.deltaY > 0) {
      triggerReelTransition('next');
    } else {
      triggerReelTransition('prev');
    }
  };

  if (!currentReel) return null;

  const isGooglePhotosLink =
    Boolean(currentReel.videoUrl) &&
    (currentReel.videoUrl.includes('photos.google.com') ||
      currentReel.videoUrl.includes('photos.app.goo.gl'));

  const hasPlayableStream = Boolean(
    currentReel.videoUrl &&
      currentReel.videoUrl.trim().length > 0 &&
      !isGooglePhotosLink &&
      !videoError
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md transition-opacity duration-200 select-none overflow-hidden ${
        isClosing ? 'animate-out fade-out duration-200' : 'animate-in fade-in duration-300'
      }`}
      onClick={handleTriggerClose}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`${formatReelNumber(currentReel.id)}: ${currentReel.title}`}
    >
      {/* Real-time Visual Hint Badge During Swipe Drag */}
      {isDragging && Math.abs(dragY) > 24 && (
        <div
          className={`fixed z-50 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-serif font-semibold text-white backdrop-blur-md shadow-2xl pointer-events-none transition-all flex items-center gap-2 border border-white/20 ${
            dragY < 0 ? 'top-6 bg-[#A64D68]/95' : 'bottom-6 bg-[#5A3545]/95'
          }`}
          style={{
            opacity: Math.min(Math.abs(dragY) / 60, 1),
          }}
        >
          {dragY < 0 ? (
            <>
              <span>Next Memory</span>
              <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
            </>
          ) : (
            <>
              <span>Previous Memory</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* PURE REEL CONTAINER — ADAPTS TO ALL SCREEN RESOLUTIONS */}
      {/* =================================================================== */}
      <div
        className={`relative w-auto h-[min(88dvh,780px)] sm:h-[min(90dvh,840px)] aspect-[9/16] max-w-[min(440px,94vw)] rounded-3xl overflow-hidden bg-black shadow-[0_25px_65px_-10px_rgba(0,0,0,0.95)] border border-white/10 select-none flex flex-col justify-between ${
          isClosing
            ? 'animate-out zoom-out-95 fade-out duration-200 ease-in'
            : !isDragging && !isTransitioning && dragY === 0
            ? 'animate-in zoom-in-95 fade-in duration-200 ease-out'
            : ''
        }`}
        style={{
          transform: `translate3d(0, ${dragY}px, 0) scale(${
            isDragging ? Math.max(0.96, 1 - Math.abs(dragY) / 2200) : 1
          })`,
          opacity: cardOpacity,
          transition: transitionStyle,
          willChange: 'transform, opacity',
          touchAction: 'pan-x',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full-bleed Video Player Layer with Dual-Layer Multi-Resolution Support */}
        <div className="absolute inset-0 w-full h-full bg-[#0E070B] flex items-center justify-center overflow-hidden">
          {hasPlayableStream ? (
            <>
              {/* Ambient blurred backdrop video to seamlessly fill any video resolution (9:16, 4:5, 1:1, 16:9) without harsh black bars */}
              <video
                src={currentReel.videoUrl}
                poster={currentReel.thumbnailUrl || undefined}
                muted
                playsInline
                autoPlay
                loop
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-35 brightness-75 pointer-events-none select-none"
              />
              {/* Primary video rendered with object-contain so 100% of the video resolution is preserved without cropping */}
              <video
                ref={videoRef}
                src={currentReel.videoUrl}
                poster={currentReel.thumbnailUrl || undefined}
                controls={false}
                autoPlay
                loop
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                className="relative z-10 w-full h-full object-contain"
              />
            </>
          ) : isGooglePhotosLink || videoError ? (
            <div className="p-6 text-center space-y-4 max-w-xs mx-auto text-[#FFF8ED]">
              <div className="w-16 h-16 rounded-full bg-[#A64D68]/40 border border-[#C7A66A]/60 text-[#F8DCE5] flex items-center justify-center mx-auto shadow-inner">
                <Film className="w-8 h-8 text-[#F8DCE5]" />
              </div>
              <div className="space-y-1">
                <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#A64D68] text-[#FFF8ED] border border-[#C7A66A]/40">
                  Google Photos Memory
                </span>
                <h4 className="font-heading font-serif text-lg text-[#FFFDF9] font-semibold">
                  {currentReel.title}
                </h4>
              </div>
              <p className="text-xs text-[#FFF8ED]/85 leading-relaxed font-letter">
                This video is linked from Google Photos. Tap below to watch directly:
              </p>
              <a
                href={currentReel.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#A64D68] to-[#8E3E56] hover:from-[#933D56] hover:to-[#5A3545] text-white text-xs font-semibold shadow-md border border-[#C7A66A]/50 transition-all cursor-pointer"
              >
                <span>Watch in Google Photos</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-6 text-center space-y-3 max-w-xs mx-auto text-[#FFF8ED]">
              <div className="w-14 h-14 rounded-full bg-white/10 text-[#F8DCE5] flex items-center justify-center mx-auto shadow-inner border border-[#C7A66A]/30">
                <Film className="w-7 h-7 text-[#F8DCE5]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-serif text-base text-white font-semibold">
                  {currentReel.title}
                </h4>
                <p className="font-letter text-xs text-[#F8DCE5] italic">
                  A sweet video memory is being prepared.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Top Header Overlay: Minimal Reel Counter & Close Button */}
        <div className="relative z-30 flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-b from-black/75 via-black/30 to-transparent">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white/95 text-[11px] font-sans font-semibold tracking-wider uppercase">
              {formatReelNumber(currentReel.id)}
            </span>
            {activePlayableReels.length > 1 && (
              <span className="text-[11px] font-mono text-white/75 bg-black/35 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                {currentIndex + 1} / {activePlayableReels.length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleTriggerClose}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/70 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
            aria-label="Close video"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Floating Reel Like Button — Positioned on right side of reel (exact circled spot) */}
        <div className="absolute right-3.5 bottom-16 sm:bottom-20 z-30 flex flex-col items-center gap-1">
          {/* Floating mini-heart particles */}
          {floatingHearts.map((heart) => (
            <span
              key={heart.id}
              className="absolute pointer-events-none select-none text-base z-40"
              style={{
                left: `calc(50% + ${heart.offsetX}px)`,
                bottom: '36px',
                animation: 'floatUpHeart 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              }}
              aria-hidden="true"
            >
              {heart.emoji}
            </span>
          ))}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick(currentReel);
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer active:scale-90 ${
              isCurrentReelLiked
                ? 'bg-[#FFF0F4]/95 text-[#E2556E] border-2 border-[#E2A9B8] ring-4 ring-[#E2556E]/25 scale-105'
                : 'bg-black/55 hover:bg-black/75 text-white border border-white/60 hover:scale-110 backdrop-blur-xs'
            }`}
            title={isCurrentReelLiked ? 'You liked this reel ♡' : 'Tap to like this reel'}
            aria-label={isCurrentReelLiked ? 'Liked reel' : 'Like this reel'}
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                isCurrentReelLiked
                  ? 'text-[#E2556E] fill-[#E2556E] animate-heart-pop drop-shadow-sm'
                  : 'text-white'
              }`}
              strokeWidth={isCurrentReelLiked ? 2 : 1.75}
            />
          </button>

          <span
            className={`text-[9px] font-bold tracking-wider uppercase drop-shadow-md select-none px-2 py-0.5 rounded-full ${
              isCurrentReelLiked
                ? 'bg-[#A64D68] text-white shadow-xs'
                : 'bg-black/60 text-white/95 backdrop-blur-xs'
            }`}
          >
            {isCurrentReelLiked ? 'Liked ♡' : 'Like'}
          </span>
        </div>

        {/* Bottom Details Scrim Gradient Overlaid Directly on Reel */}
        <div className="relative z-20 pt-20 pb-4 sm:pb-5 px-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
          <div className="pointer-events-auto space-y-1 pr-16">
            <h3 className="text-white font-serif font-semibold text-xs sm:text-sm md:text-base leading-snug drop-shadow-md line-clamp-1">
              {currentReel.title}
            </h3>

            <p className="font-handwriting text-xs sm:text-sm md:text-base text-[#F8DCE5] leading-tight drop-shadow-xs">
              “A little moment, saved just for you, Ekta ♡”
            </p>

            {currentReel.caption && (
              <p className="font-letter italic text-[11px] sm:text-xs text-white/80 line-clamp-2 leading-tight drop-shadow-xs">
                {currentReel.caption}
              </p>
            )}

            {/* Mobile swipe hint */}
            {activePlayableReels.length > 1 && (
              <div className="pt-0.5 flex items-center gap-1.5 text-[10px] text-white/60 font-sans tracking-wide">
                <span>Swipe up for next memory</span>
                <span>↑</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Side Navigation Buttons */}
        {activePlayableReels.length > 1 && (
          <div className="hidden sm:flex flex-col items-center gap-2.5 absolute -right-14 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={handlePrevReel}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white/90 border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Previous Reel (Swipe down or ↑ key)"
              aria-label="Previous Reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <div className="px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-white/80 backdrop-blur-md">
              {currentIndex + 1}/{activePlayableReels.length}
            </div>

            <button
              type="button"
              onClick={handleNextReel}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white/90 border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Next Reel (Swipe up or ↓ key)"
              aria-label="Next Reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Progressive Loading Reel Gallery Card
// -----------------------------------------------------------------------------
interface ReelGalleryCardProps {
  reel: ReelItem;
  index: number;
  onSelect: (reel: ReelItem) => void;
  formatReelNumber: (id: number) => string;
  isLiked: boolean;
  onToggleLike: (reel: ReelItem) => void;
}

const ReelGalleryCard: React.FC<ReelGalleryCardProps> = ({
  reel,
  index,
  onSelect,
  formatReelNumber,
  isLiked,
  onToggleLike,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasVideo = Boolean(reel.videoUrl && reel.videoUrl.trim().length > 0);
  const hasThumbnail = Boolean(reel.thumbnailUrl && reel.thumbnailUrl.trim().length > 0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true);
      setIsCardVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          setTimeout(() => {
            setIsCardVisible(true);
          }, 40);
          observer.unobserve(el);
        }
      },
      {
        root: null,
        rootMargin: '120px 0px 120px 0px',
        threshold: 0.08,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(reel)}
      className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#F8DCE5] bg-[#FFFDF9] shadow-xs hover:shadow-xl transition-all duration-700 ease-out hover:-translate-y-1 text-left flex flex-col cursor-pointer aspect-[9/16] ${
        isCardVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-[0.97]'
      }`}
      style={{
        transitionDelay: `${Math.min(index * 60, 480)}ms`,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(reel);
        }
      }}
      aria-label={`Open ${formatReelNumber(reel.id)}: ${reel.title}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F8] via-[#FFFDF9] to-[#F8DCE5]/60" />

      {hasThumbnail && !imageError ? (
        <>
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF5F8] via-[#F8DCE5]/50 to-[#FFF8ED] animate-pulse flex flex-col items-center justify-center p-4">
              <div className="w-9 h-9 rounded-full bg-[#F8DCE5]/70 flex items-center justify-center text-[#A64D68]/60 shadow-2xs">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          )}

          {isNearViewport && (
            <img
              src={reel.thumbnailUrl}
              alt={reel.title}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                isImageLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xs scale-105'
              }`}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F8] via-[#FFFDF9] to-[#F8DCE5]/70 flex flex-col items-center justify-center p-4 text-center">
          <Heart
            className="w-24 h-24 text-[#F8DCE5]/60 absolute -bottom-4 -right-4 -rotate-12 pointer-events-none"
            aria-hidden="true"
          />
          <div className="w-10 h-10 rounded-full bg-[#F8DCE5]/70 flex items-center justify-center text-[#A64D68] mb-2 shadow-2xs">
            <Video className="w-5 h-5 text-[#A64D68]" />
          </div>
          <span className="font-handwriting text-base text-[#A64D68] leading-tight">
            Sweet Memory
          </span>
          <span className="text-[10px] text-[#9A817B] font-letter italic mt-1 line-clamp-2">
            {hasVideo ? 'Video ready to play' : 'Curated with love'}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity group-hover:opacity-95" />

      {/* Top Header with Like Button on Card */}
      <div className="relative z-10 p-2.5 sm:p-3 flex items-center justify-between">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/90 text-[#A64D68] backdrop-blur-xs shadow-2xs border border-[#F8DCE5]/50">
          {formatReelNumber(reel.id)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(reel);
          }}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer active:scale-90 ${
            isLiked
              ? 'bg-[#FFF0F4] text-[#E2556E] border border-[#E2A9B8] scale-105 shadow-sm ring-2 ring-[#E2556E]/20'
              : 'bg-black/45 hover:bg-black/65 text-white/90 border border-white/40 hover:scale-110'
          }`}
          title={isLiked ? 'You liked this reel ♡' : 'Tap to like this reel'}
          aria-label={isLiked ? 'Liked reel' : 'Like this reel'}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
              isLiked ? 'fill-[#E2556E] text-[#E2556E] animate-heart-pop' : 'text-white'
            }`}
            strokeWidth={isLiked ? 2 : 1.75}
          />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            hasVideo
              ? 'bg-white/90 text-[#A64D68] group-hover:scale-115 group-hover:bg-[#A64D68] group-hover:text-white'
              : 'bg-white/70 text-[#A64D68]/70 group-hover:scale-105 group-hover:bg-white/90'
          }`}
        >
          <Play className="w-5 h-5 ml-0.5 fill-current" />
        </div>
      </div>

      <div className="relative z-10 p-2.5 sm:p-3 space-y-1">
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-white drop-shadow-xs line-clamp-1 group-hover:text-[#F8DCE5] transition-colors">
            {reel.title}
          </h3>
          {isLiked && (
            <span className="shrink-0 text-[10px] text-[#F8DCE5] font-semibold drop-shadow-xs flex items-center gap-0.5">
              <span>Liked</span> <span className="text-[#E2556E]">❤️</span>
            </span>
          )}
        </div>
        {reel.caption && (
          <p className="text-[10px] sm:text-[11px] text-white/80 italic font-letter line-clamp-2 leading-tight">
            “{reel.caption}”
          </p>
        )}
        {!hasVideo && (
          <span className="inline-block text-[9px] text-[#F8DCE5]/90 font-medium pt-0.5">
            Tap to view details ♡
          </span>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// NotesSection Main Component
// -----------------------------------------------------------------------------
export const NotesSection: React.FC<NotesSectionProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);

  // Persistent liked reels state synchronized with server
  const [likedReelIds, setLikedReelIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('for_ekta_liked_reels_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync liked reels from server Firestore on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/reels/likes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        const incomingIds: number[] = Array.isArray(data.likedReelIds)
          ? data.likedReelIds
          : data.likes
          ? Object.keys(data.likes).map(Number)
          : [];

        if (incomingIds.length > 0) {
          setLikedReelIds((prev) => {
            const merged = Array.from(new Set([...prev, ...incomingIds]));
            try {
              localStorage.setItem('for_ekta_liked_reels_v1', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle or add like, persist to localStorage, and trigger backend email dispatch
  const handleToggleLike = useCallback((reel: ReelItem) => {
    const reelId = reel.id;
    const isAlreadyLiked = likedReelIds.includes(reelId);

    if (isAlreadyLiked) {
      // Toggle off
      const updated = likedReelIds.filter((id) => id !== reelId);
      setLikedReelIds(updated);
      try {
        localStorage.setItem('for_ekta_liked_reels_v1', JSON.stringify(updated));
      } catch {}
      return;
    }

    // Toggle on
    const updated = [...likedReelIds, reelId];
    setLikedReelIds(updated);
    try {
      localStorage.setItem('for_ekta_liked_reels_v1', JSON.stringify(updated));
    } catch {}

    // Dispatch email notification and Firestore record
    fetch('/api/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reelId,
        reelTitle: reel.title,
        likedAt: new Date().toISOString(),
      }),
    }).catch((err) => {
      console.warn('Silent reel like sync:', err);
    });
  }, [likedReelIds]);

  const formatReelNumber = (id: number) => {
    return `REEL ${String(id).padStart(2, '0')}`;
  };

  return (
    <section
      id="notes-section"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20 animate-in fade-in duration-300"
      aria-label="Little Moments, Just for You - Reels for Ekta"
    >
      {/* Gallery Section Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#F8DCE5] to-[#FFF5F8] border border-[#E2A9B8] shadow-2xs mb-3 text-[#A64D68]">
          <Film className="w-6 h-6 text-[#A64D68]" />
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl text-[#5A3545] font-semibold mb-2">
          Little Moments, Just for You ♡
        </h2>
        <p className="font-letter text-sm sm:text-base text-[#9A817B] italic">
          Some moments deserve to be watched again and again.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-[#A64D68] mt-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-medium">10 Special Memories Prepared for Ekta</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Responsive Grid of 10 Numbered Video Cards with Progressive Observer Loading */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {reelsData.map((reel, index) => (
          <ReelGalleryCard
            key={reel.id}
            reel={reel}
            index={index}
            onSelect={(selected) => setActiveReel(selected)}
            formatReelNumber={formatReelNumber}
            isLiked={likedReelIds.includes(reel.id)}
            onToggleLike={handleToggleLike}
          />
        ))}
      </div>

      {/* Dedicated Video Viewer Overlay Component */}
      {activeReel && (
        <VideoViewerOverlay
          initialReel={activeReel}
          allReels={reelsData}
          onClose={() => setActiveReel(null)}
          likedReelIds={likedReelIds}
          onToggleLike={handleToggleLike}
        />
      )}

      {/* Bottom Dedicated Page Navigation */}
      <div className="mt-14 pt-8 border-t border-[#F8DCE5]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {onPrevPage ? (
          <button
            onClick={onPrevPage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#A64D68]/40 hover:border-[#A64D68] text-[#A64D68] hover:bg-[#F8DCE5]/30 text-sm font-medium transition-all cursor-pointer"
            aria-label="Return to My Letter page"
          >
            <span>← Previous: My Letter</span>
          </button>
        ) : (
          <div className="invisible sm:block w-28" aria-hidden="true" />
        )}

        <div className="text-xs text-[#9A817B] font-letter italic">
          Dedicated Page 3 of 5 · Little Moments
        </div>

        {onNextPage && (
          <button
            onClick={onNextPage}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A64D68] to-[#8E3E56] hover:from-[#933D56] hover:to-[#5A3545] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
            aria-label="Go to Little Things page"
          >
            <span>Next: Little Things ♡</span>
          </button>
        )}
      </div>
    </section>
  );
};
