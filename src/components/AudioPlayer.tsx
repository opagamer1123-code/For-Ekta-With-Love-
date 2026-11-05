import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { romanticAudio, TRACK_INFO, CHAPTER_6_VOLUME } from '../services/soundtrack';

interface AudioPlayerProps {
  embedded?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ embedded = false }) => {
  const [isPlaying, setIsPlaying] = useState(romanticAudio.getIsPlaying());
  const [isPausedForReel, setIsPausedForReel] = useState(romanticAudio.getIsPausedByReel());

  useEffect(() => {
    // Keep volume set to 15%
    romanticAudio.setVolume(CHAPTER_6_VOLUME);

    // Subscribe to playback state changes (syncing when reels pause/resume or chapter 6 triggers)
    const unsubscribe = romanticAudio.subscribe((playing) => {
      setIsPlaying(playing);
      setIsPausedForReel(romanticAudio.getIsPausedByReel());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleBadgeClick = () => {
    // User can manually toggle if audio has already been triggered
    if (romanticAudio.getHasEnteredChapter6() || isPlaying) {
      romanticAudio.toggle();
    }
  };

  const containerClasses = embedded ? 'relative z-30' : 'fixed top-4 right-4 z-50';

  return (
    <div className={containerClasses}>
      <div
        onClick={handleBadgeClick}
        className={`bg-[#FFFDF9]/95 backdrop-blur-md border border-[rgba(166,77,104,0.22)] shadow-xs rounded-full px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 sm:gap-2 select-none transition-all duration-300 ${
          isPlaying ? 'cursor-pointer' : ''
        }`}
        title={
          isPlaying
            ? `${TRACK_INFO.fullLabel} · Playing at 15% volume ♡`
            : `${TRACK_INFO.fullLabel} · Plays when Ekta enters Chapter 6 ("The Boy Behind the Story") at 15% volume`
        }
        aria-label={`${TRACK_INFO.displayLabel} ambient soundtrack at 15% volume`}
      >
        {/* Glowing Heart / Music Icon */}
        <div className="w-6 h-6 rounded-full bg-[#F8DCE5] text-[#A64D68] flex items-center justify-center shrink-0 shadow-2xs">
          <Heart className={`w-3.5 h-3.5 fill-[#A64D68] ${isPlaying ? 'animate-pulse' : 'opacity-60'}`} />
        </div>

        {/* Track Title */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] sm:text-xs font-serif font-medium tracking-wide text-[#5A3545] whitespace-nowrap">
            {TRACK_INFO.displayLabel}
          </span>

          {/* Equalizer Waveform Bars (animated when playing) */}
          {isPlaying ? (
            <span
              className="flex items-end gap-[2px] h-3 w-3"
              aria-hidden="true"
              title="Ambient soundtrack playing at 15% volume"
            >
              <span
                className="w-[2px] bg-[#A64D68] rounded-full animate-bounce h-2"
                style={{ animationDelay: '0ms', animationDuration: '0.8s' }}
              />
              <span
                className="w-[2px] bg-[#A64D68] rounded-full animate-bounce h-3"
                style={{ animationDelay: '180ms', animationDuration: '0.9s' }}
              />
              <span
                className="w-[2px] bg-[#A64D68] rounded-full animate-bounce h-1.5"
                style={{ animationDelay: '360ms', animationDuration: '0.75s' }}
              />
            </span>
          ) : isPausedForReel ? (
            <span
              className="text-[9px] font-sans text-[#A64D68]/80 italic px-1 rounded bg-[#F8DCE5]/60"
              title="Music paused while watching video reel"
            >
              reel
            </span>
          ) : (
            <span className="text-[10px] text-[#9A817B] font-letter italic hidden sm:inline" title="Unlocks at Chapter 6">
              (Ch. 6)
            </span>
          )}
        </div>

        {/* Volume Badge: strictly showing 15% */}
        <div className="flex items-center gap-1 pl-1 border-l border-[rgba(166,77,104,0.18)]">
          <span className="text-[10px] font-mono font-semibold text-[#A64D68] bg-[#F8DCE5]/70 px-1.5 py-0.5 rounded-full">
            15%
          </span>
        </div>
      </div>
    </div>
  );
};
