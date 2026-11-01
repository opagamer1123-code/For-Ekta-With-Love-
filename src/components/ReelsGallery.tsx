import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Film,
  Sparkles,
  Heart,
  Video,
  Search,
  X,
  SlidersHorizontal,
  Bookmark,
  RefreshCw,
} from 'lucide-react';
import { ReelItem, reelsData, ReelThumbnailSize } from '../content/reels';
import { VintageReelModal } from './VintageReelModal';

interface ReelsGalleryProps {
  onReelSelect?: (reel: ReelItem) => void;
  likedReelIds?: number[];
  onToggleLike?: (reel: ReelItem) => void;
}

// Helper to determine CSS Grid column and row spans for a balanced Instagram Explore pattern
function getReelSpanInfo(reel: ReelItem, index: number): {
  colSpanClass: string;
  rowSpanClass: string;
  isFeatured: boolean;
  isTall: boolean;
  sizeType: ReelThumbnailSize;
} {
  const size = reel.size;
  const isExplicitFeatured = Boolean(reel.isFeatured || size === 'featured');

  if (isExplicitFeatured) {
    return {
      colSpanClass: 'col-span-2',
      rowSpanClass: 'row-span-2',
      isFeatured: true,
      isTall: false,
      sizeType: 'featured',
    };
  }

  if (size === 'tall') {
    return {
      colSpanClass: 'col-span-1',
      rowSpanClass: 'row-span-2',
      isFeatured: false,
      isTall: true,
      sizeType: 'tall',
    };
  }

  if (size === 'square') {
    return {
      colSpanClass: 'col-span-1',
      rowSpanClass: 'row-span-1',
      isFeatured: false,
      isTall: false,
      sizeType: 'square',
    };
  }

  if (size === 'standard') {
    return {
      colSpanClass: 'col-span-1',
      rowSpanClass: 'row-span-1',
      isFeatured: false,
      isTall: false,
      sizeType: 'standard',
    };
  }

  // Automatic rhythmic assignment if size is not explicitly defined in data
  const mod = index % 10;
  if (mod === 0 || mod === 8) {
    return {
      colSpanClass: 'col-span-2',
      rowSpanClass: 'row-span-2',
      isFeatured: true,
      isTall: false,
      sizeType: 'featured',
    };
  } else if (mod === 2 || mod === 5) {
    return {
      colSpanClass: 'col-span-1',
      rowSpanClass: 'row-span-2',
      isFeatured: false,
      isTall: true,
      sizeType: 'tall',
    };
  }

  return {
    colSpanClass: 'col-span-1',
    rowSpanClass: 'row-span-1',
    isFeatured: false,
    isTall: false,
    sizeType: 'standard',
  };
}

// -----------------------------------------------------------------------------
// Individual Explore Tile Component with Scroll-Triggered Reveal Animation
// -----------------------------------------------------------------------------
interface ReelExploreTileProps {
  reel: ReelItem;
  index: number;
  isLiked: boolean;
  onOpen: (reel: ReelItem) => void;
  onToggleLike: (reel: ReelItem) => void;
  formatReelNumber: (id: number) => string;
}

const ReelExploreTile: React.FC<ReelExploreTileProps> = ({
  reel,
  index,
  isLiked,
  onOpen,
  onToggleLike,
  formatReelNumber,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const spanInfo = useMemo(() => getReelSpanInfo(reel, index), [reel, index]);
  const hasVideo = Boolean(reel.videoUrl && reel.videoUrl.trim().length > 0);
  const hasThumbnail = Boolean(reel.thumbnailUrl && reel.thumbnailUrl.trim().length > 0);

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        root: null,
        rootMargin: '60px 0px 60px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onOpen(reel)}
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer text-left select-none transition-all duration-700 ease-out ${
        spanInfo.colSpanClass
      } ${spanInfo.rowSpanClass} ${
        spanInfo.isFeatured
          ? 'border-2 border-[#C7A66A]/80 shadow-md hover:shadow-2xl hover:border-[#C7A66A] ring-2 ring-[#C7A66A]/20'
          : 'border border-[#F8DCE5] hover:border-[#C7A66A]/60 shadow-xs hover:shadow-xl'
      } bg-[#FFFDF9] hover:-translate-y-1 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-[0.97]'
      }`}
      style={{
        transitionDelay: `${Math.min((index % 6) * 75, 450)}ms`,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(reel);
        }
      }}
      aria-label={`Open ${formatReelNumber(reel.id)}: ${reel.title}`}
    >
      {/* Background Poster / Scrapbook Paper Placeholder */}
      {hasThumbnail && !imageError ? (
        <>
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF5F8] via-[#F8DCE5]/40 to-[#FFF8ED] animate-pulse flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#A64D68]/40 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          )}
          <img
            src={reel.thumbnailUrl}
            alt={reel.title}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : hasVideo ? (
        <video
          src={`${reel.videoUrl}#t=0.5`}
          preload="metadata"
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F8] via-[#FFFDF9] to-[#F8DCE5]/70 flex flex-col items-center justify-center p-3 text-center">
          <Heart
            className="w-20 h-20 text-[#F8DCE5]/50 absolute -bottom-3 -right-3 -rotate-12 pointer-events-none"
            aria-hidden="true"
          />
          <div className="w-9 h-9 rounded-full bg-[#F8DCE5]/80 flex items-center justify-center text-[#A64D68] mb-1.5 shadow-2xs">
            <Video className="w-4 h-4 text-[#A64D68]" />
          </div>
          <span className="font-handwriting text-sm text-[#A64D68] leading-tight">
            Sweet Memory
          </span>
          <span className="text-[10px] text-[#9A817B] font-letter italic mt-0.5 line-clamp-1">
            {hasVideo ? 'Video ready to play' : 'Curated with love'}
          </span>
        </div>
      )}

      {/* Romantic Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15 transition-opacity group-hover:opacity-95" />

      {/* Featured Scrapbook Badge & Delicate Corner Accent */}
      {spanInfo.isFeatured && (
        <div className="absolute top-0 right-0 z-20 pointer-events-none">
          <div className="bg-gradient-to-l from-[#C7A66A] to-[#E2A9B8] text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Top Header: Reel Number Pill & Heart Like Indicator */}
      <div className="relative z-10 p-2 sm:p-3 flex items-center justify-between">
        <span
          className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-2xs border ${
            spanInfo.isFeatured
              ? 'bg-[#FFF8ED]/95 text-[#A64D68] border-[#C7A66A]/70'
              : 'bg-white/90 text-[#A64D68] border-[#F8DCE5]/60'
          }`}
        >
          {formatReelNumber(reel.id)}
        </span>

        {/* Small Heart Like Indicator & Quick-Like Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(reel);
          }}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-90 ${
            isLiked
              ? 'bg-[#FFF0F4] text-[#E2556E] border border-[#E2A9B8] scale-105 ring-2 ring-[#E2556E]/20'
              : 'bg-black/40 hover:bg-black/60 text-white/90 border border-white/30 hover:scale-110'
          }`}
          title={isLiked ? 'You liked this reel ♡' : 'Tap to like this reel'}
          aria-label={isLiked ? 'Liked reel' : 'Like this reel'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              isLiked ? 'fill-[#E2556E] text-[#E2556E] animate-heart-pop' : 'text-white'
            }`}
            strokeWidth={isLiked ? 2 : 1.75}
          />
        </button>
      </div>

      {/* Center Subtle Play Button Motif */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          className={`rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            spanInfo.isFeatured
              ? 'w-12 h-12 sm:w-14 sm:h-14 bg-white/90 text-[#A64D68] group-hover:scale-115 group-hover:bg-[#A64D68] group-hover:text-white border border-[#C7A66A]/60'
              : 'w-8 h-8 sm:w-10 sm:h-10 bg-white/85 text-[#A64D68] group-hover:scale-115 group-hover:bg-[#A64D68] group-hover:text-white'
          }`}
        >
          <Play
            className={`fill-current ml-0.5 ${
              spanInfo.isFeatured ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'
            }`}
          />
        </div>
      </div>

      {/* Bottom Content: Title & Caption pinned firmly to the bottom-left corner */}
      <div className="absolute inset-x-0 bottom-0 z-10 pt-14 pb-2.5 sm:pb-3.5 px-2.5 sm:px-3 text-left flex flex-col items-start justify-end bg-gradient-to-t from-black/92 via-black/50 to-transparent pointer-events-none">
        <div className="flex items-center justify-start gap-1 w-full text-left">
          <h3
            className={`font-semibold text-white drop-shadow-xs line-clamp-1 group-hover:text-[#F8DCE5] transition-colors text-left text-start ${
              spanInfo.isFeatured
                ? 'text-xs sm:text-base font-heading'
                : 'text-[11px] sm:text-xs'
            }`}
          >
            {reel.title}
          </h3>
          {isLiked && (
            <span className="shrink-0 text-[9px] text-[#F8DCE5] font-semibold flex items-center">
              <span>❤️</span>
            </span>
          )}
        </div>

        {reel.caption && (
          <p
            className={`text-white/85 italic font-letter drop-shadow-xs line-clamp-1 sm:line-clamp-2 leading-tight text-left text-start ${
              spanInfo.isFeatured ? 'text-[10px] sm:text-xs' : 'text-[9px] sm:text-[10px]'
            }`}
          >
            “{reel.caption}”
          </p>
        )}

        {spanInfo.isFeatured && (
          <div className="pt-0.5 hidden sm:flex items-center gap-1 text-[9px] text-[#C7A66A] font-medium text-left">
            <span>Tap to watch in full screen ♡</span>
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// ReelsGallery Main Component with Instagram-Inspired 3-Column Mixed Grid
// -----------------------------------------------------------------------------
export const ReelsGallery: React.FC<ReelsGalleryProps> = ({
  onReelSelect,
  likedReelIds: propLikedReelIds,
  onToggleLike: propOnToggleLike,
}) => {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Internal liked reels state fallback
  const [internalLikedIds, setInternalLikedIds] = useState<number[]>(() => {
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

  const activeLikedIds = propLikedReelIds ?? internalLikedIds;

  // Toggle Like Handler
  const handleToggleLike = (reel: ReelItem) => {
    if (propOnToggleLike) {
      propOnToggleLike(reel);
      return;
    }

    const reelId = reel.id;
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

    // Dispatch email notification to backend
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
  };

  const handleOpenReel = (reel: ReelItem) => {
    setActiveReel(reel);
    onReelSelect?.(reel);
  };

  const formatReelNumber = (id: number) => {
    return `REEL ${String(id).padStart(2, '0')}`;
  };

  // Available categories extracted dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    reelsData.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ['All', ...Array.from(set), 'Liked ♡'];
  }, []);

  // Filtered Reels based on Search and Selected Category
  const filteredReels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return reelsData.filter((reel) => {
      // Category filter check
      if (selectedCategory === 'Liked ♡') {
        if (!activeLikedIds.includes(reel.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (reel.category !== selectedCategory) return false;
      }

      // Search query check
      if (!q) return true;

      const reelNumStr = String(reel.id);
      const paddedStr = String(reel.id).padStart(2, '0');
      const matchesNum =
        q === reelNumStr ||
        q === paddedStr ||
        q.includes(`reel ${reelNumStr}`) ||
        q.includes(`reel ${paddedStr}`) ||
        `reel ${paddedStr}`.toLowerCase().includes(q);

      const matchesTitle = reel.title.toLowerCase().includes(q);
      const matchesCaption = reel.caption ? reel.caption.toLowerCase().includes(q) : false;
      const matchesCategory = reel.category ? reel.category.toLowerCase().includes(q) : false;

      return matchesNum || matchesTitle || matchesCaption || matchesCategory;
    });
  }, [searchQuery, selectedCategory, activeLikedIds]);

  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* SECTION HEADER & ROMANTIC SCRAPBOOK EMBLEM */}
      {/* =================================================================== */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#F8DCE5] to-[#FFF5F8] border border-[#E2A9B8] shadow-2xs mb-3 text-[#A64D68]">
          <Film className="w-6 h-6 text-[#A64D68]" />
        </div>

        <h2 className="font-heading font-serif text-2xl sm:text-3xl md:text-4xl text-[#5A3545] font-semibold mb-2 tracking-tight">
          Moments in Motion ♡
        </h2>
        <p className="font-handwriting text-lg sm:text-xl md:text-2xl text-[#A64D68] leading-relaxed max-w-xl mx-auto">
          Little videos, lovely memories, and moments worth keeping.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-[#A64D68] mt-3 flex-wrap">
          <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
          <span className="font-medium text-[#5A3545]">
            {reelsData.length} Special Memories Prepared for Ekta
          </span>
          <span aria-hidden="true" className="text-[#C7A66A]">✦</span>
          <span className="text-[#A64D68] font-semibold">
            {activeLikedIds.length} {activeLikedIds.length === 1 ? 'memory liked' : 'memories liked'} ❤️
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* ELEGANT SEARCH & CATEGORY FILTERS */}
      {/* =================================================================== */}
      <div className="max-w-2xl mx-auto mb-6 sm:mb-8 space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9A817B]">
            <Search className="w-4 h-4 text-[#A64D68]/70" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories by number, title, or words... ♡"
            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-[#FFFDF9] border border-[#F8DCE5] focus:border-[#C7A66A] focus:ring-2 focus:ring-[#C7A66A]/20 text-xs sm:text-sm text-[#5A3545] placeholder-[#9A817B]/70 shadow-2xs outline-none transition-all"
            aria-label="Search reel video memories"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9A817B] hover:text-[#5A3545] cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#A64D68] to-[#8E3E56] text-white shadow-xs border border-[#C7A66A]/60 scale-102'
                    : 'bg-[#FFFDF9] text-[#5A3545]/80 hover:text-[#A64D68] hover:bg-[#F8DCE5]/40 border border-[#F8DCE5]'
                }`}
                aria-pressed={isSelected}
              >
                {cat === 'Liked ♡' ? (
                  <span className="flex items-center gap-1">
                    <span>Liked</span>
                    <span className="text-[#E2556E]">❤️</span>
                    <span className="text-[10px] opacity-80">({activeLikedIds.length})</span>
                  </span>
                ) : (
                  cat
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3-COLUMN MIXED-SIZE INSTAGRAM-INSPIRED GRID */}
      {/* =================================================================== */}
      {filteredReels.length > 0 ? (
        <div
          className="grid grid-cols-3 auto-rows-[120px] sm:auto-rows-[160px] md:auto-rows-[220px] lg:auto-rows-[270px] gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 grid-flow-dense"
          aria-label="Mixed-size video reels discovery feed"
        >
          {filteredReels.map((reel, idx) => (
            <ReelExploreTile
              key={reel.id}
              reel={reel}
              index={idx}
              isLiked={activeLikedIds.includes(reel.id)}
              onOpen={handleOpenReel}
              onToggleLike={handleToggleLike}
              formatReelNumber={formatReelNumber}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 max-w-md mx-auto bg-[#FFFDF9] rounded-3xl border border-[#F8DCE5] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F8] text-[#A64D68] border border-[#E2A9B8] flex items-center justify-center mx-auto shadow-2xs">
            <Heart className="w-6 h-6 text-[#A64D68]" />
          </div>

          <h3 className="font-heading text-lg font-semibold text-[#5A3545]">
            No moments found
          </h3>

          <p className="text-xs sm:text-sm text-[#9A817B] font-letter italic leading-relaxed">
            {searchQuery
              ? `No memories matched “${searchQuery}”. Try another memory or clear the search.`
              : selectedCategory === 'Liked ♡'
              ? 'You have not liked any reels yet. Tap the heart on any memory to save it here ♡'
              : 'No memories in this category.'}
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A64D68] hover:bg-[#8E3E56] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Show All Memories ♡</span>
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* PURE REEL VIEWER MODAL WITH SMOOTH SWIPE SCROLL */}
      {/* =================================================================== */}
      {activeReel && (
        <VintageReelModal
          initialReel={activeReel}
          allReels={filteredReels.length > 0 ? filteredReels : reelsData}
          onClose={() => setActiveReel(null)}
          likedReelIds={activeLikedIds}
          onToggleLike={handleToggleLike}
        />
      )}
    </div>
  );
};
