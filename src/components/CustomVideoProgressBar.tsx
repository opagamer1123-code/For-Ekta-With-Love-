import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export interface CustomVideoProgressBarProps {
  currentTime: number;
  duration: number;
  buffered?: number;
  onSeek: (time: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  theme?: 'vintage' | 'dark' | 'glass';
  showTimeText?: boolean;
  showPlayPause?: boolean;
  showMute?: boolean;
  className?: string;
}

/**
 * Format seconds into mm:ss or m:ss
 */
export function formatVideoTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const CustomVideoProgressBar: React.FC<CustomVideoProgressBarProps> = ({
  currentTime,
  duration,
  buffered = 0,
  onSeek,
  isPlaying = false,
  onTogglePlay,
  isMuted,
  onToggleMute,
  theme = 'vintage',
  showTimeText = true,
  showPlayPause = true,
  showMute = false,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  // Active display time (either while scrubbing or current playback)
  const displayTime = isScrubbing && scrubTime !== null ? scrubTime : currentTime;
  const safeDuration = duration > 0 ? duration : 1;
  const progressPct = Math.min(100, Math.max(0, (displayTime / safeDuration) * 100));
  const bufferedPct = Math.min(100, Math.max(0, (buffered / safeDuration) * 100));

  // Compute time from a pointer event X coordinate
  const getTimeFromEvent = useCallback(
    (clientX: number): { time: number; pct: number } => {
      if (!trackRef.current) return { time: 0, pct: 0 };
      const rect = trackRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const pct = Math.min(1, Math.max(0, relativeX / rect.width));
      const time = pct * (duration || 0);
      return { time, pct: pct * 100 };
    },
    [duration]
  );

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!trackRef.current) return;
    trackRef.current.setPointerCapture(e.pointerId);

    const { time } = getTimeFromEvent(e.clientX);
    setIsScrubbing(true);
    setScrubTime(time);
    onSeek(time);

    // Subtle tactile haptic pulse
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(20);
      } catch {
        // ignore
      }
    }
  };

  // Pointer Move (Scrubbing)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { time, pct } = getTimeFromEvent(e.clientX);

    if (isScrubbing) {
      e.preventDefault();
      setScrubTime(time);
      onSeek(time);
    } else {
      setHoverTime(time);
      setHoverPosition(pct);
    }
  };

  // Pointer Up (End of Scrub)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      e.preventDefault();
      e.stopPropagation();
      try {
        trackRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (scrubTime !== null) {
        onSeek(scrubTime);
      }
      setIsScrubbing(false);
      setScrubTime(null);

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate?.(30);
        } catch {
          // ignore
        }
      }
    }
  };

  const handlePointerLeave = () => {
    if (!isScrubbing) {
      setHoverTime(null);
      setHoverPosition(null);
    }
  };

  // Theme-specific styles
  const isDark = theme === 'dark';
  const isGlass = theme === 'glass';

  // Container styling
  const containerClasses = isDark
    ? 'bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-xl'
    : isGlass
    ? 'bg-white/80 backdrop-blur-md border border-[#F8DCE5] text-[#4A1D2B] shadow-md'
    : 'bg-[#FFFDF9]/95 border border-[#F8DCE5] text-[#4A1D2B] shadow-sm';

  // Track background
  const trackBgClass = isDark
    ? 'bg-white/20'
    : 'bg-[#F8DCE5]/80';

  // Buffered background
  const bufferedBgClass = isDark
    ? 'bg-white/35'
    : 'bg-[#E2A9B8]/40';

  // Progress fill gradient
  const progressFillGradient = isDark
    ? 'bg-gradient-to-r from-[#E2556E] via-[#F8A4B8] to-[#FFD166]'
    : 'bg-gradient-to-r from-[#A64D68] via-[#D99AA5] to-[#C7A66A]';

  // Thumb glow & border
  const thumbClasses = isDark
    ? 'bg-white border-2 border-[#E2556E] shadow-[0_0_10px_rgba(226,85,110,0.8)]'
    : 'bg-[#FFFDF9] border-2 border-[#A64D68] shadow-[0_0_8px_rgba(199,166,106,0.7)]';

  return (
    <div
      className={`custom-video-progress-bar rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 select-none flex items-center gap-2.5 ${containerClasses} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Play / Pause Toggle Button */}
      {showPlayPause && onTogglePlay && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
            isDark
              ? 'bg-white/15 hover:bg-white/30 text-white'
              : 'bg-[#F8DCE5]/60 hover:bg-[#F8DCE5] text-[#A64D68]'
          }`}
          title={isPlaying ? 'Pause video' : 'Play video'}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
          )}
        </button>
      )}

      {/* Main Interactive Track & Thumb Container */}
      <div className="relative flex-1 flex flex-col justify-center py-2 group cursor-pointer">
        {/* Hover Time Tooltip */}
        {hoverTime !== null && hoverPosition !== null && (
          <div
            className={`absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-semibold pointer-events-none transition-all shadow-md z-30 whitespace-nowrap ${
              isDark
                ? 'bg-black/90 text-white border border-white/20'
                : 'bg-[#4A1D2B] text-white'
            }`}
            style={{ left: `${hoverPosition}%` }}
          >
            {formatVideoTime(hoverTime)}
          </div>
        )}

        {/* The Hit-Area and Progress Bar Track */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="relative w-full h-2 sm:h-2.5 flex items-center cursor-pointer touch-none"
          role="slider"
          aria-label="Video playback progress"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(displayTime)}
          aria-valuetext={`${formatVideoTime(displayTime)} of ${formatVideoTime(duration)}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              onSeek(Math.max(0, currentTime - 5));
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              onSeek(Math.min(duration, currentTime + 5));
            } else if (e.key === ' ' && onTogglePlay) {
              e.preventDefault();
              onTogglePlay();
            }
          }}
        >
          {/* Base Track */}
          <div
            className={`absolute inset-x-0 h-1.5 sm:h-2 rounded-full overflow-hidden transition-all group-hover:h-2 sm:group-hover:h-2.5 ${trackBgClass}`}
          >
            {/* Buffered Bar */}
            {bufferedPct > 0 && (
              <div
                className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-300 ${bufferedBgClass}`}
                style={{ width: `${bufferedPct}%` }}
              />
            )}

            {/* Filled Progress Bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 rounded-full transition-[width] duration-75 ${progressFillGradient}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Scrub Thumb / Glow Indicator */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full pointer-events-none transition-transform duration-100 ${thumbClasses} ${
              isScrubbing ? 'scale-125' : 'group-hover:scale-115'
            }`}
            style={{ left: `${progressPct}%` }}
          >
            {/* Center dot */}
            <div
              className={`w-1.5 h-1.5 rounded-full absolute inset-0 m-auto ${
                isDark ? 'bg-[#E2556E]' : 'bg-[#A64D68]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Time Feedback Display: mm:ss / mm:ss */}
      {showTimeText && (
        <div
          className={`shrink-0 flex items-center gap-1 text-[11px] sm:text-xs font-mono tabular-nums font-medium ${
            isDark ? 'text-white/85' : 'text-[#7A5B64]'
          }`}
          title="Current time / total duration"
        >
          <span className={isDark ? 'text-white font-bold' : 'text-[#A64D68] font-bold'}>
            {formatVideoTime(displayTime)}
          </span>
          <span className="opacity-50">/</span>
          <span className="opacity-80">{formatVideoTime(duration)}</span>
        </div>
      )}

      {/* Optional Mute Toggle */}
      {showMute && onToggleMute && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className={`shrink-0 p-1.5 rounded-full transition-all cursor-pointer ${
            isDark
              ? 'hover:bg-white/20 text-white/80 hover:text-white'
              : 'hover:bg-[#F8DCE5]/50 text-[#7A5B64] hover:text-[#A64D68]'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
};
