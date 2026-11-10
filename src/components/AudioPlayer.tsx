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

  // Song player is completely hidden from the UI as requested
  return null;
};
