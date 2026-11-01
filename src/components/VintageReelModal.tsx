import React, { useState, useEffect, useCallback } from 'react';
import { ReelItem, reelsData } from '../content/reels';
import { VideoViewerOverlay } from './NotesSection';

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
  const targetReel = initialReel || reel || null;

  // Internal liked reels state fallback if prop is omitted
  const [internalLikedIds, setInternalLikedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('for_ekta_liked_reels_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

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

  const handleInternalToggle = useCallback((reelItem: ReelItem) => {
    if (propOnToggleLike) {
      propOnToggleLike(reelItem);
      return;
    }

    const reelId = reelItem.id;
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
        reelTitle: reelItem.title,
        likedAt: new Date().toISOString(),
      }),
    }).catch((err) => {
      console.warn('Silent reel like sync:', err);
    });
  }, [internalLikedIds, propOnToggleLike]);

  if (!targetReel) return null;

  return (
    <VideoViewerOverlay
      initialReel={targetReel}
      allReels={allReels}
      onClose={onClose}
      likedReelIds={propLikedReelIds ?? internalLikedIds}
      onToggleLike={handleInternalToggle}
    />
  );
};
