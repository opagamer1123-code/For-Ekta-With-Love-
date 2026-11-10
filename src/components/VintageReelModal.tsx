import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Heart,
  Film,
  ExternalLink,
} from 'lucide-react';
import { ReelItem, reelsData } from '../content/reels';
import { romanticAudio } from '../services/soundtrack';
import { CustomVideoProgressBar } from './CustomVideoProgressBar';

export interface VintageReelModalProps {
  initialReel: ReelItem | null;
  allReels?: ReelItem[];
  reel?: ReelItem | null; // Backward compatibility
  onClose: () => void;
  likedReelIds?: number[];
  onToggleLike?: (reel: ReelItem) => void;
  onReelChange?: (reel: ReelItem) => void;
}

export const VintageReelModal: React.FC<VintageReelModalProps> = ({
  initialReel,
  allReels = reelsData,
  reel,
  onClose,
  likedReelIds: propLikedReelIds,
  onToggleLike: propOnToggleLike,
  onReelChange,
}) => {
  const currentSelectedReel = initialReel || reel || null;
  const activeReels = allReels.length > 0 ? allReels : reelsData;
  const initialIndex = currentSelectedReel
    ? Math.max(0, activeReels.findIndex((r) => r.id === currentSelectedReel.id))
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [videoError, setVideoError] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Real-time video playback position and progress tracking
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Reset video progress tracking when switching reels
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setIsPlaying(true);
  }, [currentIndex]);

  // Instagram Story & Reel real-time interactive drag physics
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [gestureDirection, setGestureDirection] = useState<'none' | 'horizontal' | 'vertical'>('none');
  const [slideState, setSlideState] = useState<
    | 'idle'
    | 'exit-left'
    | 'exit-right'
    | 'enter-from-right'
    | 'enter-from-left'
    | 'exit-up'
    | 'exit-down'
    | 'enter-from-bottom'
    | 'enter-from-top'
  >('idle');

  // Instagram-style double tap to like heart bloom
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);

  // Floating heart particles for Like button
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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Touch tracking refs
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const wheelDebounce = useRef<boolean>(false);
  const lastTapTime = useRef<number>(0);

  // Mount, body scroll lock, and background music pause
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsEntered(true), 15);

    // Lock body scroll while open
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    // Pause romantic soundtrack during reel watching
    romanticAudio.pauseForReel();

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      romanticAudio.resumeFromReel();
    };
  }, []);

  // Track the reel currently being viewed so likes/prop re-renders never jump to another reel
  const currentReelIdRef = useRef<number>(
    activeReels[initialIndex]?.id ?? (currentSelectedReel?.id || 1)
  );
  const initialPropIdRef = useRef<number | null>(currentSelectedReel?.id ?? null);

  // Keep currentReelIdRef in sync whenever currentIndex changes, and inform parent
  useEffect(() => {
    const current = activeReels[currentIndex];
    if (current) {
      currentReelIdRef.current = current.id;
      if (onReelChange) {
        onReelChange(current);
      }
    }
  }, [currentIndex, activeReels, onReelChange]);

  // If initialReel explicitly changes to a completely NEW reel from external parent props, update index
  useEffect(() => {
    if (currentSelectedReel && currentSelectedReel.id !== initialPropIdRef.current) {
      initialPropIdRef.current = currentSelectedReel.id;
      const idx = activeReels.findIndex((r) => r.id === currentSelectedReel.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
        currentReelIdRef.current = currentSelectedReel.id;
        setVideoError(false);
      }
    }
  }, [currentSelectedReel?.id, activeReels]);

  // If activeReels updates while modal is open, strictly preserve the reel currently being watched
  useEffect(() => {
    const targetId = currentReelIdRef.current;
    const targetIdx = activeReels.findIndex((r) => r.id === targetId);
    if (targetIdx !== -1 && targetIdx !== currentIndex) {
      setCurrentIndex(targetIdx);
    }
  }, [activeReels, currentIndex]);

  // Sync likes from server
  useEffect(() => {
    if (propLikedReelIds) return;
    let isSubscribed = true;
    fetch('/api/reels/likes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isSubscribed || !data) return;
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
      isSubscribed = false;
    };
  }, [propLikedReelIds]);

  const activeLikedIds = propLikedReelIds ?? internalLikedIds;
  const currentReel = activeReels[currentIndex] || activeReels[0];
  const isCurrentReelLiked = currentReel ? activeLikedIds.includes(currentReel.id) : false;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    romanticAudio.resumeFromReel();
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  // Instagram Story Horizontal Flip Transitions (Swipe Left/Right)
  const triggerStoryFlipNext = useCallback(() => {
    if (activeReels.length <= 1) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSlideState('exit-left');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeReels.length);
      setVideoError(false);
      setDragX(0);
      setDragY(0);
      setSlideState('enter-from-right');
      requestAnimationFrame(() => {
        setTimeout(() => setSlideState('idle'), 280);
      });
    }, 200);
  }, [activeReels.length]);

  const triggerStoryFlipPrev = useCallback(() => {
    if (activeReels.length <= 1) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSlideState('exit-right');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeReels.length) % activeReels.length);
      setVideoError(false);
      setDragX(0);
      setDragY(0);
      setSlideState('enter-from-left');
      requestAnimationFrame(() => {
        setTimeout(() => setSlideState('idle'), 280);
      });
    }, 200);
  }, [activeReels.length]);

  // Vertical Reel Slide Transitions (Swipe Up/Down)
  const triggerSlideToNext = useCallback(() => {
    if (activeReels.length <= 1) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSlideState('exit-up');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeReels.length);
      setVideoError(false);
      setDragX(0);
      setDragY(0);
      setSlideState('enter-from-bottom');
      requestAnimationFrame(() => {
        setTimeout(() => setSlideState('idle'), 280);
      });
    }, 200);
  }, [activeReels.length]);

  const triggerSlideToPrev = useCallback(() => {
    if (activeReels.length <= 1) return;
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSlideState('exit-down');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeReels.length) % activeReels.length);
      setVideoError(false);
      setDragX(0);
      setDragY(0);
      setSlideState('enter-from-top');
      requestAnimationFrame(() => {
        setTimeout(() => setSlideState('idle'), 280);
      });
    }, 200);
  }, [activeReels.length]);

  // Autoplay video on reel change
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            romanticAudio.pauseForReel();
          })
          .catch(() => {
            // Autoplay note: handled by tap gesture
          });
      }
    }
  }, [currentIndex, currentReel?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerStoryFlipNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerStoryFlipPrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        triggerSlideToNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        triggerSlideToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, triggerStoryFlipNext, triggerStoryFlipPrev, triggerSlideToNext, triggerSlideToPrev]);

  // Desktop Trackpad & Mouse Wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelDebounce.current) return;

    if (Math.abs(e.deltaX) > 28 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      wheelDebounce.current = true;
      if (e.deltaX > 0) {
        triggerStoryFlipNext();
      } else {
        triggerStoryFlipPrev();
      }
      setTimeout(() => {
        wheelDebounce.current = false;
      }, 420);
      return;
    }

    if (Math.abs(e.deltaY) > 32) {
      wheelDebounce.current = true;
      if (e.deltaY > 0) {
        triggerSlideToNext();
      } else {
        triggerSlideToPrev();
      }
      setTimeout(() => {
        wheelDebounce.current = false;
      }, 420);
    }
  };

  // Touch Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (slideState !== 'idle') return;
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
    touchStartTime.current = Date.now();
    setGestureDirection('none');
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null || slideState !== 'idle') return;
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY.current;
    const deltaX = touch.clientX - touchStartX.current;

    if (gestureDirection === 'none') {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
          setGestureDirection('horizontal');
          setIsDragging(true);
        } else {
          setGestureDirection('vertical');
          setIsDragging(true);
        }
      }
      return;
    }

    if (gestureDirection === 'horizontal') {
      const damping = 0.88;
      setDragX(deltaX * damping);
    } else if (gestureDirection === 'vertical') {
      const damping = 0.85;
      setDragY(deltaY * damping);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const duration = Date.now() - touchStartTime.current;
    const currentDragX = dragX;
    const currentDragY = dragY;

    setIsDragging(false);

    const threshold = 48;
    const isFastFlick = duration < 280;

    if (gestureDirection === 'horizontal') {
      if (currentDragX < -threshold || (isFastFlick && currentDragX < -20)) {
        triggerStoryFlipNext();
      } else if (currentDragX > threshold || (isFastFlick && currentDragX > 20)) {
        triggerStoryFlipPrev();
      } else {
        setDragX(0);
      }
    } else if (gestureDirection === 'vertical') {
      if (currentDragY < -threshold || (isFastFlick && currentDragY < -20)) {
        triggerSlideToNext();
      } else if (currentDragY > threshold || (isFastFlick && currentDragY > 20)) {
        triggerSlideToPrev();
      } else {
        setDragY(0);
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
    setGestureDirection('none');
  };

  // Click outside to close (only on backdrop)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  // Delicate haptic feedback via Vibration API for mobile tactile response
  const triggerDelicateHapticPulse = (action: 'like' | 'unlike' = 'like') => {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        if (action === 'like') {
          // Delicate, tactile heartbeat pulse: crisp micro-tap sequence [14, 35, 18]
          navigator.vibrate([14, 35, 18]);
        } else {
          // Soft, gentle tactile release pulse for unlike
          navigator.vibrate(10);
        }
      } catch {
        // Safe fallback if device vibration is restricted by browser policy
      }
    }
  };

  // Instagram-style Like & Unlike Toggle Handler
  const handleLikeClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentReel) return;

    const reelId = currentReel.id;
    const isCurrentlyLiked = activeLikedIds.includes(reelId);
    const willBeLiked = !isCurrentlyLiked;

    // Trigger delicate, tactile haptic response on mobile devices
    triggerDelicateHapticPulse(willBeLiked ? 'like' : 'unlike');

    if (willBeLiked) {
      // 1. Liking: Show floating hearts burst
      const burstId = Date.now();
      const burstParticles = [
        { id: burstId + 1, offsetX: -20, emoji: '♡' },
        { id: burstId + 2, offsetX: -6, emoji: '❤️' },
        { id: burstId + 3, offsetX: 8, emoji: '✨' },
        { id: burstId + 4, offsetX: 22, emoji: '💕' },
      ];
      setFloatingHearts((prev) => [...prev, ...burstParticles]);
      setTimeout(() => {
        setFloatingHearts((prev) =>
          prev.filter((p) => !burstParticles.some((bp) => bp.id === p.id))
        );
      }, 1300);
    } else {
      // 2. Unliking: Immediately clear floating hearts, transition smoothly
      setFloatingHearts([]);
    }

    if (propOnToggleLike) {
      propOnToggleLike(currentReel);
      return;
    }

    // Local fallback update if propOnToggleLike not provided
    const updated = willBeLiked
      ? Array.from(new Set([...internalLikedIds, reelId]))
      : internalLikedIds.filter((id) => id !== reelId);

    setInternalLikedIds(updated);
    try {
      localStorage.setItem('for_ekta_liked_reels_v1', JSON.stringify(updated));
    } catch {}

    // Dispatch like or unlike to backend
    fetch('/api/reels/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reelId,
        reelTitle: currentReel.title,
        likedAt: new Date().toISOString(),
        action: willBeLiked ? 'like' : 'unlike',
        liked: willBeLiked,
      }),
    }).catch((err) => {
      console.warn('Silent reel like sync:', err);
    });
  };

  // Instagram-style double tap on video to like
  const handleVideoTouchOrClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
      // Double tap only likes (never unlikes, matching Instagram)
      if (!isCurrentReelLiked) {
        handleLikeClick();
      }
      setShowDoubleTapHeart(true);
      setTimeout(() => setShowDoubleTapHeart(false), 850);
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = now;
    }
  };

  if (!isMounted || typeof document === 'undefined' || !currentReel) {
    return null;
  }

  const hasVideo = Boolean(
    currentReel.videoUrl && currentReel.videoUrl.trim().length > 0 && !videoError
  );
  const isGooglePhotosLink =
    Boolean(currentReel.videoUrl) &&
    (currentReel.videoUrl.includes('photos.google.com') ||
      currentReel.videoUrl.includes('photos.app.goo.gl'));

  // 3D Story Flip Transform
  const getCardTransformStyle = () => {
    if (isDragging) {
      if (gestureDirection === 'horizontal') {
        const rotY = Math.max(-26, Math.min(26, -dragX / 12));
        const scale = Math.max(0.94, 1 - Math.abs(dragX) / 1800);
        return {
          transform: `translate3d(${dragX}px, 0, 0) rotateY(${rotY}deg) scale(${scale})`,
          transition: 'none',
          transformOrigin: dragX < 0 ? 'right center' : 'left center',
        };
      } else {
        const scale = Math.max(0.95, 1 - Math.abs(dragY) / 1600);
        return {
          transform: `translate3d(0, ${dragY}px, 0) scale(${scale})`,
          transition: 'none',
        };
      }
    }

    if (slideState === 'exit-left') {
      return {
        transform: 'translate3d(-110%, 0, 0) rotateY(-28deg) scale(0.9)',
        opacity: 0,
        transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease-in',
        transformOrigin: 'right center',
      };
    }

    if (slideState === 'exit-right') {
      return {
        transform: 'translate3d(110%, 0, 0) rotateY(28deg) scale(0.9)',
        opacity: 0,
        transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease-in',
        transformOrigin: 'left center',
      };
    }

    if (slideState === 'enter-from-right' || slideState === 'enter-from-left') {
      return {
        transform: 'translate3d(0, 0, 0) rotateY(0deg) scale(1)',
        opacity: 1,
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
      };
    }

    if (slideState === 'exit-up') {
      return {
        transform: 'translate3d(0, -115%, 0) scale(0.92)',
        opacity: 0,
        transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease-in',
      };
    }

    if (slideState === 'exit-down') {
      return {
        transform: 'translate3d(0, 115%, 0) scale(0.92)',
        opacity: 0,
        transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease-in',
      };
    }

    if (slideState === 'enter-from-bottom' || slideState === 'enter-from-top') {
      return {
        transform: 'translate3d(0, 0, 0) scale(1)',
        opacity: 1,
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
      };
    }

    return {
      transform: 'translate3d(0, 0, 0) rotateY(0deg) scale(1)',
      opacity: 1,
      transition: 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease-out',
    };
  };

  const modalJSX = (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-0 xs:p-2 sm:p-4 bg-black/88 backdrop-blur-md transition-opacity duration-300 select-none overflow-hidden touch-none overscroll-none ${
        isEntered && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        perspective: '1200px',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={currentReel.title}
    >
      {/* Real-time Horizontal Drag Indicator Pill */}
      {isDragging && gestureDirection === 'horizontal' && Math.abs(dragX) > 18 && (
        <div
          className="fixed z-50 top-5 sm:top-7 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white backdrop-blur-md shadow-2xl pointer-events-none transition-all flex items-center gap-2 border border-white/20 bg-[#A64D68]/95"
          style={{ opacity: Math.min(Math.abs(dragX) / 45, 1) }}
        >
          {dragX < 0 ? (
            <>
              <span>Next Memory</span>
              <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-3.5 h-3.5 animate-pulse" />
              <span>Previous Memory</span>
            </>
          )}
        </div>
      )}

      {/* Real-time Vertical Drag Indicator Pill */}
      {isDragging && gestureDirection === 'vertical' && Math.abs(dragY) > 20 && (
        <div
          className={`fixed z-50 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white backdrop-blur-md shadow-2xl pointer-events-none transition-all flex items-center gap-2 border border-white/20 ${
            dragY < 0 ? 'top-5 sm:top-7 bg-[#A64D68]/95' : 'bottom-5 sm:bottom-7 bg-[#5A3545]/95'
          }`}
          style={{ opacity: Math.min(Math.abs(dragY) / 50, 1) }}
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

      {/* Top-Right Screen Close Button */}
      <button
        type="button"
        onClick={handleClose}
        className="fixed top-[max(0.75rem,env(safe-area-inset-top,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] sm:top-5 sm:right-5 z-50 w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
        aria-label="Close viewer (Esc)"
        title="Close viewer (Esc)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Desktop Left Navigation Button */}
      {activeReels.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerStoryFlipPrev();
          }}
          className="hidden md:flex flex-col items-center justify-center fixed left-3 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer group"
          title="Previous Memory (Swipe Right or ← Key)"
          aria-label="Previous Memory"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Desktop Right Navigation Button */}
      {activeReels.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerStoryFlipNext();
          }}
          className="hidden md:flex flex-col items-center justify-center fixed right-3 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer group"
          title="Next Memory (Swipe Left or → Key)"
          aria-label="Next Memory"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* =================================================================== */}
      {/* CLEAN, FRAMELESS REEL VIEWER CARD                                   */}
      {/* Immersive 9:16 Video Canvas with Clean Overlays                     */}
      {/* =================================================================== */}
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-[min(94vw,400px)] sm:max-w-[420px] md:max-w-[430px] aspect-[9/16] max-h-[96dvh] sm:max-h-[90dvh] rounded-none xs:rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10 flex flex-col justify-between select-none will-change-transform"
        style={{
          ...getCardTransformStyle(),
        }}
      >
        {/* Background Ambient Blur Video (for letterboxed videos) */}
        {hasVideo && (
          <video
            src={currentReel.videoUrl}
            muted
            playsInline
            autoPlay
            loop
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none select-none"
          />
        )}

        {/* Primary Video Element (Clean, centered, full 9:16 vertical stage) */}
        <div
          onClick={handleVideoTouchOrClick}
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer overflow-hidden z-10"
        >
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                key={currentReel.id}
                src={currentReel.videoUrl}
                poster={currentReel.thumbnailUrl || undefined}
                autoPlay
                loop
                playsInline
                preload="auto"
                onError={() => setVideoError(true)}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                    if (videoRef.current.buffered.length > 0) {
                      setBuffered(
                        videoRef.current.buffered.end(videoRef.current.buffered.length - 1)
                      );
                    }
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration || 0);
                  }
                }}
                onPlay={() => {
                  romanticAudio.pauseForReel();
                  setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain mx-auto my-auto block bg-black/60"
              />

              {/* Instagram Double-Tap Heart Bloom Animation */}
              {showDoubleTapHeart && (
                <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                  <div className="animate-instagram-heart-bloom text-[#E2556E] drop-shadow-[0_10px_25px_rgba(226,85,110,0.6)]">
                    <Heart className="w-24 h-24 sm:w-28 sm:h-28 fill-[#E2556E]" />
                  </div>
                </div>
              )}
            </>
          ) : isGooglePhotosLink || videoError ? (
            <div className="p-6 text-center space-y-3 max-w-xs mx-auto text-[#FFF8ED] z-20">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-[#F8DCE5] flex items-center justify-center mx-auto shadow-inner">
                <Film className="w-6 h-6 text-[#F8DCE5]" />
              </div>
              <div className="space-y-1">
                <span className="inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                  Google Photos Memory
                </span>
                <h4 className="font-heading font-serif text-sm text-white font-semibold">
                  {currentReel.title}
                </h4>
              </div>
              <p className="text-[11px] text-white/85 leading-relaxed font-letter">
                This video memory is stored in Google Photos.
              </p>
              <a
                href={currentReel.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#A64D68] to-[#8E3E56] text-white text-xs font-semibold shadow-md border border-white/20 transition-all cursor-pointer"
              >
                <span>Watch in Google Photos</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-6 text-center space-y-2 text-white z-20">
              <Film className="w-8 h-8 mx-auto text-[#F8DCE5]" />
              <p className="font-serif text-sm text-white">{currentReel.title}</p>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* TOP OVERLAY: STORY DASHES, REEL BADGE & CLOSE BUTTON                */}
        {/* =================================================================== */}
        <div className="relative z-30 pt-2.5 pb-8 px-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
          {/* Clean Segmented Story Progress Bar with Live Playback Fill */}
          <div className="flex items-center gap-1 w-full pb-2 pointer-events-auto">
            {activeReels.map((item, idx) => (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (idx !== currentIndex) {
                    if (videoRef.current) videoRef.current.pause();
                    setSlideState(idx > currentIndex ? 'exit-left' : 'exit-right');
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setSlideState(idx > currentIndex ? 'enter-from-right' : 'enter-from-left');
                      setTimeout(() => setSlideState('idle'), 280);
                    }, 180);
                  }
                }}
                className="h-1 flex-1 rounded-full cursor-pointer transition-all duration-300 relative overflow-hidden bg-white/25 hover:bg-white/40"
                title={`Memory ${idx + 1}: ${item.title}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-75"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
                        : '0%',
                    backgroundColor: idx === currentIndex ? '#FFD166' : 'white',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top Bar Header */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="text-[10px] sm:text-[11px] font-mono text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                {currentIndex + 1} / {activeReels.length}
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer pointer-events-auto active:scale-90"
              title="Close viewer"
              aria-label="Close viewer"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* BOTTOM OVERLAY: TITLE, CAPTION, DEDICATION & LIKE BUTTON           */}
        {/* =================================================================== */}
        <div className="relative z-30 pt-16 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-4 px-3 sm:px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none">
          {/* Custom Interactive Video Progress Bar with live feedback */}
          {hasVideo && (
            <div className="pointer-events-auto pb-2">
              <CustomVideoProgressBar
                currentTime={currentTime}
                duration={duration}
                buffered={buffered}
                onSeek={(time) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = time;
                    setCurrentTime(time);
                  }
                }}
                isPlaying={isPlaying}
                onTogglePlay={() => {
                  if (!videoRef.current) return;
                  if (isPlaying) {
                    videoRef.current.pause();
                  } else {
                    romanticAudio.pauseForReel();
                    videoRef.current.play();
                  }
                }}
                isMuted={isMuted}
                onToggleMute={() => {
                  if (!videoRef.current) return;
                  videoRef.current.muted = !videoRef.current.muted;
                  setIsMuted(videoRef.current.muted);
                }}
                theme="dark"
                showTimeText={true}
                showPlayPause={true}
                showMute={true}
                className="bg-black/50 border-white/20"
              />
            </div>
          )}

          <div className="flex items-end justify-between gap-3">
            {/* Left Column: Title, Dedication, Caption */}
            <div className="flex-1 space-y-1 pointer-events-auto text-left">
              <h3 className="font-heading font-serif font-bold text-sm sm:text-base text-white leading-snug drop-shadow-md line-clamp-1">
                {currentReel.title}
              </h3>

              <p className="font-handwriting text-xs sm:text-sm text-[#F8DCE5] leading-tight drop-shadow-xs">
                “A little moment, saved just for you, Ekta ♡”
              </p>

              {currentReel.caption && (
                <p className="font-letter italic text-[11px] text-white/80 line-clamp-2 leading-relaxed drop-shadow-xs">
                  {currentReel.caption}
                </p>
              )}

              {/* Clean gesture hint */}
              <div className="pt-0.5 flex items-center gap-1.5 text-[9.5px] text-white/60 font-sans">
                <span>Swipe left / right to flip</span>
                <span className="text-white/80 font-bold">⇄</span>
              </div>
            </div>

            {/* Right Column: Interactive Heart Like Button */}
            <div className="flex flex-col items-center gap-1 pointer-events-auto shrink-0 mb-1">
              <div className="relative inline-flex items-center justify-center">
                {/* Floating Mini Hearts */}
                {floatingHearts.map((heart) => (
                  <span
                    key={heart.id}
                    className="absolute pointer-events-none select-none text-sm z-40"
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

                {/* Heart Button */}
                <button
                  type="button"
                  onClick={handleLikeClick}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer active:scale-90 ${
                    isCurrentReelLiked
                      ? 'bg-[#FFF0F4]/95 text-[#E2556E] border border-white/50 ring-2 ring-[#E2556E]/40 scale-105'
                      : 'bg-black/50 hover:bg-black/70 text-white border border-white/30 hover:scale-105 backdrop-blur-md'
                  }`}
                  title={isCurrentReelLiked ? 'You liked this little memory ♡' : 'Tap to like this reel'}
                  aria-label={isCurrentReelLiked ? 'Liked reel' : 'Like this reel'}
                >
                  <Heart
                    className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-all duration-300 ${
                      isCurrentReelLiked
                        ? 'text-[#E2556E] fill-[#E2556E] animate-heart-pop drop-shadow-xs'
                        : 'text-white fill-none'
                    }`}
                    strokeWidth={isCurrentReelLiked ? 2 : 1.75}
                  />
                </button>
              </div>

              <span className="text-[9px] font-sans font-semibold text-white/85 drop-shadow-xs">
                {isCurrentReelLiked ? 'Liked ♡' : 'Like'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};
