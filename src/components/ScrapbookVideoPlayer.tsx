import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Film, Heart } from 'lucide-react';
import { CustomVideoProgressBar } from './CustomVideoProgressBar';
import { romanticAudio } from '../services/soundtrack';

export interface ScrapbookVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  caption?: string;
  autoPlay?: boolean;
  className?: string;
  onEnded?: () => void;
}

export const ScrapbookVideoPlayer: React.FC<ScrapbookVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  title,
  caption,
  autoPlay = false,
  className = '',
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync video time and buffered state
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    if (videoRef.current.buffered.length > 0) {
      setBuffered(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause background music to let video audio be heard clearly
      romanticAudio.pauseForReel();
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  return (
    <div
      className={`scrapbook-video-container relative rounded-2xl overflow-hidden bg-[#2A1620] border-2 border-[#E2A9B8]/70 shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Washi Tape on Top Right Corner */}
      <div
        className="absolute -top-1.5 right-6 w-20 h-5 bg-[#F8DCE5]/90 border-y border-[#E2A9B8]/60 shadow-xs z-30 pointer-events-none rotate-2"
        style={{
          clipPath:
            'polygon(0% 0%, 5% 10%, 10% 0%, 95% 0%, 100% 10%, 95% 100%, 90% 90%, 5% 100%, 0% 90%)',
        }}
      />

      {/* Main Video Viewport */}
      <div
        className="relative w-full aspect-[9/16] max-h-[360px] sm:max-h-[420px] bg-black/90 flex items-center justify-center cursor-pointer group"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          playsInline
          autoPlay={autoPlay}
          loop={false}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => {
            romanticAudio.pauseForReel();
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnded}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain mx-auto"
        />

        {/* Ambient background blur */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 blur-xl scale-110 -z-1"
          style={{
            backgroundImage: posterUrl ? `url(${posterUrl})` : undefined,
            backgroundSize: 'cover',
          }}
        />

        {/* Central Play/Pause Watermark on Pause */}
        {!isPlaying && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/25 transition-opacity">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#A64D68]/90 to-[#8E3E56]/90 border-2 border-white/60 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs scale-100 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/80 text-white z-20">
            <Film className="w-8 h-8 text-[#F8DCE5] mb-2" />
            <p className="text-xs text-white/90 font-serif">Video memory is currently loading...</p>
          </div>
        )}

        {/* Title Badge on Video Top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-sans font-medium border border-white/20 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#FFD166]" />
            <span className="truncate max-w-[180px]">{title}</span>
          </span>
          <span className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md text-[#F8DCE5] flex items-center justify-center border border-white/20">
            <Heart className="w-3 h-3 fill-[#E2556E] text-[#E2556E]" />
          </span>
        </div>
      </div>

      {/* Embedded Dedicated Custom Progress Bar with Rich Feedback */}
      <div className="p-3 bg-gradient-to-b from-[#2A1620] to-[#1F0E17] border-t border-white/10 space-y-1.5">
        <CustomVideoProgressBar
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          onSeek={handleSeek}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          theme="dark"
          showTimeText={true}
          showPlayPause={true}
          showMute={true}
          className="bg-black/50 border-white/10"
        />

        {caption && (
          <p className="text-[11px] text-[#F8DCE5]/80 font-letter italic px-1 pt-0.5 line-clamp-1">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};
