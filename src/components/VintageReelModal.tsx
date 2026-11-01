import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize,
  X,
  ChevronUp,
  ChevronDown,
  Heart,
  Sparkles,
  Film,
  ExternalLink,
} from 'lucide-react';
import { ReelItem, reelsData } from '../content/reels';
import { romanticAudio } from '../services/soundtrack';

export interface VintageReelModalProps {
  initialReel: ReelItem | null;
  allReels?: ReelItem[];
  reel?: ReelItem | null; // Backward compatibility
  onClose: () => void;
  likedReelIds?: number[];
  onToggleLike?: (reel: ReelItem) => void;
}

export const VintageReelModal: React.FC<VintageReelModalProps> = ({
  initialReel,
  allReels = reelsData,
  reel,
  onClose,
  likedReelIds: propLikedReelIds,
  onToggleLike: propOnToggleLike,
}) => {
  const currentSelectedReel = initialReel || reel || null;

  // Active playable reels
  const activeReels = allReels.length > 0 ? allReels : reelsData;
  const initialIndex = currentSelectedReel
    ? Math.max(0, activeReels.findIndex((r) => r.id === currentSelectedReel.id))
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Delicate & Fluid Entry/Exit Modal Animation State
  const [isEntered, setIsEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Fluid scale, opacity and translate transform physics
  const [dragY, setDragY] = useState(0);
  const [cardScale, setCardScale] = useState(0.95);
  const [cardOpacity, setCardOpacity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState<string>(
    'transform 0.40s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.36s ease-out'
  );

  // Floating heart burst particles on clicking Like
  const [floatingHearts, setFloatingHearts] = useState<
    Array<{ id: number; offsetX: number; emoji: string }>
  >([]);

  // Internal liked IDs fallback
  const [internalLikedIds, setInternalLikedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('for_ekta_liked_reels_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const reelCardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Touch & Swipe tracking refs
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const lastTouchYRef = useRef<number>(0);
  const isDirectionLockedRef = useRef<boolean>(false);
  const isSwipingVerticalRef = useRef<boolean>(false);
  const wheelDebounceRef = useRef<boolean>(false);
  const animationTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Smooth, delicate entry on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsEntered(true);
      setCardScale(1);
      setCardOpacity(1);
    });

    // Pause romantic background song while she is watching the reel
    romanticAudio.pauseForReel();

    return () => {
      cancelAnimationFrame(raf);
      // Instantly resume background song right where it stopped when she stops watching
      romanticAudio.resumeFromReel();
    };
  }, []);

  // Sync index if initialReel prop changes
  useEffect(() => {
    if (currentSelectedReel) {
      const idx = activeReels.findIndex((r) => r.id === currentSelectedReel.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
        setVideoError(false);
      }
    }
  }, [currentSelectedReel, activeReels]);

  // Sync liked reels from server if prop is not supplied
  useEffect(() => {
    if (propLikedReelIds) return;
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
          setInternalLikedIds((prev) => {
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
  }, [propLikedReelIds]);

  // Clean up any pending animation timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimer1Ref.current) clearTimeout(animationTimer1Ref.current);
      if (animationTimer2Ref.current) clearTimeout(animationTimer2Ref.current);
    };
  }, []);

  const currentReel = activeReels[currentIndex] || currentSelectedReel;
  const likedList = propLikedReelIds ?? internalLikedIds;
  const isCurrentReelLiked = currentReel ? likedList.includes(currentReel.id) : false;

  const formatReelNumber = (id: number) => {
    return `REEL ${String(id).padStart(2, '0')}`;
  };

  // Safe, delicate Exit Handler with subtle scale-down and fade
  const handleClose = useCallback(() => {
    if (isClosing) return;
    if (animationTimer1Ref.current) clearTimeout(animationTimer1Ref.current);
    if (animationTimer2Ref.current) clearTimeout(animationTimer2Ref.current);

    setIsClosing(true);
    setTransitionStyle('transform 0.30s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease-in-out');
    setCardScale(0.95);
    setCardOpacity(0);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Instantly start background song where it was stopped
    romanticAudio.resumeFromReel();

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 310);
  }, [isClosing, onClose]);

  // Delicate & Fluid Reel Switch Animation with subtle fade and scale transform
  const triggerReelTransition = useCallback(
    (direction: 'next' | 'prev') => {
      if (isTransitioning || activeReels.length <= 1) return;
      setIsTransitioning(true);
      setVideoError(false);

      if (animationTimer1Ref.current) clearTimeout(animationTimer1Ref.current);
      if (animationTimer2Ref.current) clearTimeout(animationTimer2Ref.current);

      if (videoRef.current) {
        videoRef.current.pause();
      }

      // Phase 1: Subtle fluid exit glide with gentle scale and fade
      const exitDistance = direction === 'next' ? -window.innerHeight * 0.45 : window.innerHeight * 0.45;
      setTransitionStyle('transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease-out');
      setDragY(exitDistance);
      setCardScale(0.94);
      setCardOpacity(0.06);

      // Phase 2: Index switch and instant reposition at entrance boundary
      animationTimer1Ref.current = setTimeout(() => {
        setCurrentIndex((prev) => {
          if (direction === 'next') {
            return (prev + 1) % activeReels.length;
          } else {
            return prev === 0 ? activeReels.length - 1 : prev - 1;
          }
        });

        const entranceDistance = direction === 'next' ? window.innerHeight * 0.42 : -window.innerHeight * 0.42;
        setTransitionStyle('none');
        setDragY(entranceDistance);
        setCardScale(0.95);
        setCardOpacity(0.3);

        // Phase 3: Delicate spring entrance into center with smooth scale recovery
        animationTimer2Ref.current = setTimeout(() => {
          setTransitionStyle('transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease-out');
          setDragY(0);
          setCardScale(1);
          setCardOpacity(1);

          setTimeout(() => {
            setIsTransitioning(false);
            setTransitionStyle('none');
          }, 390);
        }, 16);
      }, 240);
    },
    [activeReels.length, isTransitioning]
  );

  const handleNext = useCallback(() => {
    triggerReelTransition('next');
  }, [triggerReelTransition]);

  const handlePrev = useCallback(() => {
    triggerReelTransition('prev');
  }, [triggerReelTransition]);

  // Video play / pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          romanticAudio.pauseForReel();
        })
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      romanticAudio.resumeFromReel();
    }
  };

  // Volume & Mute Controls
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Fullscreen Toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (reelCardRef.current?.requestFullscreen) {
          await reelCardRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn('Fullscreen request:', err);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleClose, handleNext, handlePrev]);

  // Autoplay video when active reel changes
  useEffect(() => {
    if (videoRef.current && currentReel?.videoUrl) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [currentReel?.id, currentReel?.videoUrl]);

  // Desktop Mouse Wheel Navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 30 || wheelDebounceRef.current || isTransitioning) return;
    wheelDebounceRef.current = true;
    setTimeout(() => {
      wheelDebounceRef.current = false;
    }, 450);

    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // 1:1 Tactile Touch Dragging for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, textarea, [data-interactive="true"]')) {
      return;
    }
    if (isTransitioning || activeReels.length <= 1) return;

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

    // Direction lock: verify user is swiping vertically
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

    // 1:1 direct finger tracking with natural elasticity
    setDragY(deltaY);

    // Subtle tactile scale & opacity feedback
    const progress = Math.min(Math.abs(deltaY) / 380, 1);
    setCardOpacity(1 - progress * 0.16);
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
    if (deltaY < -38 || (deltaY < -15 && velocity < -0.26)) {
      triggerReelTransition('next');
    }
    // Swipe DOWN (finger moved down) -> PREVIOUS reel
    else if (deltaY > 38 || (deltaY > 15 && velocity > 0.26)) {
      triggerReelTransition('prev');
    }
    // Released before threshold -> Snappy spring snapback
    else {
      setTransitionStyle('transform 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.25), opacity 0.26s ease-out');
      setDragY(0);
      setCardScale(1);
      setCardOpacity(1);
    }
  };

  // Like Click Handler
  const handleLikeClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentReel) return;

    // Trigger floating hearts burst
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
    }, 1300);

    if (propOnToggleLike) {
      propOnToggleLike(currentReel);
      return;
    }

    const reelId = currentReel.id;
    const isAlreadyLiked = internalLikedIds.includes(reelId);

    if (isAlreadyLiked) {
      const updated = internalLikedIds.filter((id) => id !== reelId);
      setInternalLikedIds(updated);
      try {
        localStorage.setItem('for_ekta_liked_reels_v1', JSON.stringify(updated));
      } catch {}
      return;
    }

    const updated = [...internalLikedIds, reelId];
    setInternalLikedIds(updated);
    try {
      localStorage.setItem('for_ekta_liked_reels_v1', JSON.stringify(updated));
    } catch {}

    fetch('/api/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reelId,
        reelTitle: currentReel.title,
        likedAt: new Date().toISOString(),
      }),
    }).catch((err) => {
      console.warn('Silent reel like sync:', err);
    });
  };

  if (!currentReel) return null;

  const hasVideo = Boolean(currentReel.videoUrl && currentReel.videoUrl.trim().length > 0 && !videoError);
  const isGooglePhotosLink =
    Boolean(currentReel.videoUrl) &&
    (currentReel.videoUrl.includes('photos.google.com') ||
      currentReel.videoUrl.includes('photos.app.goo.gl'));

  // Calculate dynamic scale during drag or transitions
  const currentScale = isDragging
    ? Math.max(0.96, 1 - Math.abs(dragY) / 2200)
    : cardScale;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md transition-opacity select-none overflow-hidden duration-350 ease-in-out ${
        isEntered && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`${formatReelNumber(currentReel.id)}: ${currentReel.title}`}
    >
      {/* Real-time Swipe Direction Indicator Pill */}
      {isDragging && Math.abs(dragY) > 22 && (
        <div
          className={`fixed z-50 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white backdrop-blur-md shadow-2xl pointer-events-none transition-all flex items-center gap-2 border border-white/20 ${
            dragY < 0 ? 'top-6 bg-[#A64D68]/95' : 'bottom-6 bg-[#5A3545]/95'
          }`}
          style={{ opacity: Math.min(Math.abs(dragY) / 60, 1) }}
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
      {/* PURE REEL CONTAINER — NO EXTRA FRAMES, DELICATE FADE & SCALE */}
      {/* =================================================================== */}
      <div
        ref={reelCardRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full sm:h-[min(90dvh,820px)] sm:w-auto aspect-auto sm:aspect-[9/16] max-w-full sm:max-w-[min(440px,94vw)] rounded-none sm:rounded-3xl overflow-hidden bg-[#0A0508] shadow-[0_25px_65px_-10px_rgba(0,0,0,0.95)] border-0 sm:border sm:border-white/15 select-none flex flex-col justify-between"
        style={{
          transform: `translate3d(0, ${dragY}px, 0) scale(${currentScale})`,
          opacity: cardOpacity,
          transition: transitionStyle,
          willChange: 'transform, opacity',
          touchAction: 'pan-x',
        }}
      >
        {/* Full-bleed Video Layer with Blurred Ambient Backdrop */}
        <div className="absolute inset-0 w-full h-full bg-[#0E070B] flex items-center justify-center overflow-hidden">
          {hasVideo ? (
            <>
              {/* Blurred Ambient Backdrop Video */}
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

              {/* Primary Video Element */}
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
                onPlay={() => {
                  setIsPlaying(true);
                  romanticAudio.pauseForReel();
                }}
                onPause={() => {
                  setIsPlaying(false);
                  romanticAudio.resumeFromReel();
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  romanticAudio.resumeFromReel();
                }}
                onClick={togglePlay}
                className="relative z-10 w-full h-full object-contain cursor-pointer"
              />

              {/* Centered Play Indicator When Paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center shadow-2xl transition-all scale-100 hover:scale-110 cursor-pointer z-30 border border-white/20"
                  aria-label="Play video"
                >
                  <Play className="w-7 h-7 ml-1 fill-white" />
                </button>
              )}
            </>
          ) : isGooglePhotosLink || videoError ? (
            <div className="p-6 text-center space-y-3 max-w-xs mx-auto text-[#FFF8ED]">
              <div className="w-14 h-14 rounded-full bg-[#A64D68]/40 border border-[#C7A66A]/60 text-[#F8DCE5] flex items-center justify-center mx-auto shadow-inner">
                <Film className="w-7 h-7 text-[#F8DCE5]" />
              </div>
              <div className="space-y-1">
                <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#A64D68] text-[#FFF8ED] border border-[#C7A66A]/40">
                  Google Photos Memory
                </span>
                <h4 className="font-heading font-serif text-base text-[#FFFDF9] font-semibold">
                  {currentReel.title}
                </h4>
              </div>
              <p className="text-xs text-[#FFF8ED]/85 leading-relaxed font-letter">
                This video is stored in Google Photos. Tap below to watch directly:
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
              <div className="w-14 h-14 rounded-full bg-white/10 text-[#F8DCE5] flex items-center justify-center mx-auto shadow-inner border border-white/20">
                <Film className="w-7 h-7 text-[#F8DCE5]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-serif text-base text-white font-semibold">
                  {currentReel.title}
                </h4>
                <p className="font-letter text-xs text-[#F8DCE5] italic">
                  A sweet video memory prepared with love.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Top Header Scrim Overlay: Reel Badge, Counter & Controls */}
        <div className="relative z-30 flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white/95 text-[11px] font-sans font-semibold tracking-wider uppercase shadow-xs">
              {formatReelNumber(currentReel.id)}
            </span>
            {activeReels.length > 1 && (
              <span className="text-[11px] font-mono text-white/80 bg-black/35 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                {currentIndex + 1} / {activeReels.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mute/Unmute Quick Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
              title="Toggle fullscreen"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/45 hover:bg-black/70 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-all cursor-pointer"
              aria-label="Close video"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Right-Side Interactive Action Column (Heart Like Button) */}
        <div className="absolute right-3.5 bottom-20 sm:bottom-24 z-30 flex flex-col items-center gap-1.5">
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

          {/* Like Heart Button */}
          <button
            type="button"
            onClick={handleLikeClick}
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
        <div className="absolute bottom-0 inset-x-0 z-20 pt-20 pb-4 sm:pb-5 px-3.5 sm:px-4 text-left bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none">
          <div className="pointer-events-auto space-y-1 pr-16 text-left flex flex-col items-start justify-end">
            <h3 className="text-white font-serif font-semibold text-sm sm:text-base leading-snug drop-shadow-md line-clamp-1 text-left text-start">
              {currentReel.title}
            </h3>

            <p className="font-handwriting text-xs sm:text-sm text-[#F8DCE5] leading-tight drop-shadow-xs text-left text-start">
              “A little moment, saved just for you, Ekta ♡”
            </p>

            {currentReel.caption && (
              <p className="font-letter italic text-[11px] sm:text-xs text-white/85 line-clamp-2 leading-tight drop-shadow-xs text-left text-start">
                {currentReel.caption}
              </p>
            )}

            {/* Mobile swipe hint */}
            {activeReels.length > 1 && (
              <div className="pt-0.5 flex items-center gap-1.5 text-[10px] text-white/60 font-sans tracking-wide text-left text-start">
                <span>Swipe up for next memory</span>
                <span className="animate-pulse">↑</span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Side Navigation Buttons */}
        {activeReels.length > 1 && (
          <div className="hidden sm:flex flex-col items-center gap-2.5 absolute -right-14 top-1/2 -translate-y-1/2 z-30">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white/90 border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
              title="Previous Reel (Swipe down or ↑ key)"
              aria-label="Previous Reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <div className="px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-white/80 backdrop-blur-md">
              {currentIndex + 1}/{activeReels.length}
            </div>

            <button
              type="button"
              onClick={handleNext}
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
