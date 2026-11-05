import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Film,
  Sparkles,
  Heart,
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { ReelItem, reelsData, ReelThumbnailSize } from '../content/reels';
import { VintageReelModal } from './VintageReelModal';

interface ReelsGalleryProps {
  onReelSelect?: (reel: ReelItem) => void;
  likedReelIds?: number[];
  onToggleLike?: (reel: ReelItem) => void;
}

// Helper to determine CSS Grid column and row spans for a balanced Instagram Explore pattern
// Exactly 3 columns on both desktop and mobile
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

  // Rhythmic fallback if size isn't specified
  const mod = index % 9;
  if (mod === 0) {
    return {
      colSpanClass: 'col-span-2',
      rowSpanClass: 'row-span-2',
      isFeatured: true,
      isTall: false,
      sizeType: 'featured',
    };
  } else if (mod === 2 || mod === 5 || mod === 6) {
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
    sizeType: 'square',
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

  // Delicate scroll reveal with IntersectionObserver
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
        rootMargin: '40px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  const staggerDelayMs = (index % 6) * 60;

  return (
    <div
      ref={cardRef}
      onClick={() => onOpen(reel)}
      className={`group relative ${spanInfo.colSpanClass} ${spanInfo.rowSpanClass} rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-3.5 scale-[0.98]'
      } ${
        spanInfo.isFeatured
          ? 'bg-[#FFF8ED] border-2 border-[#C7A66A]/80 shadow-[0_8px_24px_rgba(199,166,106,0.22)] ring-1 ring-[#F8DCE5]'
          : 'bg-[#FFFDF9] border border-[#F8DCE5]/80 hover:border-[#D99AA5] shadow-[0_4px_16px_rgba(90,53,69,0.06)] hover:shadow-md'
      } hover:scale-[1.02] active:scale-[0.98]`}
      style={{
        transitionDelay: `${staggerDelayMs}ms`,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(reel);
        }
      }}
      aria-label={`${formatReelNumber(reel.id)}: ${reel.title}`}
    >
      {/* Background Poster Image */}
      <div className="absolute inset-0 w-full h-full bg-[#180C14] overflow-hidden">
        {reel.thumbnailUrl && !imageError ? (
          <img
            src={reel.thumbnailUrl}
            alt={reel.title}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-30'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-tr from-[#2A1521] to-[#452030] text-[#FFF8ED]">
            <Film className="w-6 h-6 text-[#F8DCE5] mb-1" />
            <span className="text-[10px] font-serif">{reel.title}</span>
          </div>
        )}

        {/* Ambient Dark Scrim for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 group-hover:via-black/20 transition-all" />
      </div>

      {/* Featured Ribbon Badge (for large featured items) */}
      {spanInfo.isFeatured && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF8ED]/95 backdrop-blur-md text-[#A64D68] border border-[#C7A66A]/80 shadow-2xs text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-[#C7A66A] fill-current" />
          <span>Featured Memory ♡</span>
        </div>
      )}

      {/* Top Bar: Reel Number Pill & Heart Like Indicator */}
      <div
        className={`relative z-10 p-1.5 xs:p-2 sm:p-2.5 flex items-center justify-between ${
          spanInfo.isFeatured ? 'mt-7' : ''
        }`}
      >
        <span
          className={`px-1.5 py-0.5 sm:px-2 rounded-full text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-2xs border ${
            spanInfo.isFeatured
              ? 'bg-[#FFF8ED]/95 text-[#A64D68] border-[#C7A66A]/70'
              : 'bg-white/90 text-[#A64D68] border-[#F8DCE5]/70'
          }`}
        >
          {formatReelNumber(reel.id)}
        </span>

        {/* Interactive Quick Like Indicator */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(reel);
          }}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer active:scale-90 ${
            isLiked
              ? 'bg-[#FFF0F4] text-[#E2556E] border border-[#D99AA5] scale-105 ring-2 ring-[#E2556E]/20'
              : 'bg-black/45 hover:bg-black/65 text-white/90 border border-white/30 hover:scale-110'
          }`}
          title={isLiked ? 'You liked this memory ♡' : 'Tap to like this memory'}
          aria-label={isLiked ? 'Liked memory' : 'Like memory'}
        >
          <Heart
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
              isLiked ? 'fill-[#E2556E] text-[#E2556E] animate-heart-pop' : 'text-white'
            }`}
            strokeWidth={isLiked ? 2 : 1.75}
          />
        </button>
      </div>

      {/* Subtle Play Icon Center Motif */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          className={`rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
            spanInfo.isFeatured
              ? 'w-10 h-10 sm:w-13 sm:h-13 bg-white/90 text-[#A64D68] group-hover:scale-115 group-hover:bg-[#A64D68] group-hover:text-white border border-[#C7A66A]/60'
              : 'w-7 h-7 sm:w-9 sm:h-9 bg-white/85 text-[#A64D68] group-hover:scale-115 group-hover:bg-[#A64D68] group-hover:text-white'
          }`}
        >
          <Play
            className={`fill-current ml-0.5 ${
              spanInfo.isFeatured ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3 sm:w-4 sm:h-4'
            }`}
          />
        </div>
      </div>

      {/* Bottom Title & Romantic Caption Pin */}
      <div className="absolute inset-x-0 bottom-0 z-10 pt-10 pb-1.5 xs:pb-2 sm:pb-3 px-1.5 xs:px-2 sm:px-3 text-left flex flex-col items-start justify-end bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none">
        <div className="flex items-center justify-start gap-1 w-full text-left">
          <h3
            className={`font-semibold text-white drop-shadow-xs line-clamp-1 group-hover:text-[#F8DCE5] transition-colors text-left ${
              spanInfo.isFeatured
                ? 'text-xs sm:text-base font-serif'
                : 'text-[10px] xs:text-[11px] sm:text-xs'
            }`}
          >
            {reel.title}
          </h3>
          {isLiked && (
            <span className="shrink-0 text-[8px] sm:text-[9px] text-[#F8DCE5] font-semibold flex items-center">
              <span>❤️</span>
            </span>
          )}
        </div>

        {reel.caption && (
          <p
            className={`text-white/85 italic font-letter drop-shadow-xs line-clamp-1 leading-tight text-left ${
              spanInfo.isFeatured ? 'text-[9px] sm:text-[11px]' : 'text-[8px] xs:text-[9px] sm:text-[10px]'
            }`}
          >
            “{reel.caption}”
          </p>
        )}

        {spanInfo.isFeatured && (
          <div className="pt-0.5 hidden sm:flex items-center gap-1 text-[9px] text-[#F8DCE5] font-medium text-left">
            <span>Tap to watch memory ♡</span>
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// ReelsGallery Main Component — Instagram-Inspired 3-Column Mixed Grid
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

        // Authoritative active liked reels from server
        setInternalLikedIds(incomingIds);
        try {
          localStorage.setItem('for_ekta_liked_reels_v1', JSON.stringify(incomingIds));
        } catch {}
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [propLikedReelIds]);

  const activeLikedIds = propLikedReelIds ?? internalLikedIds;

  // Toggle Like Handler with Instagram-style like & unlike toggle
  const handleToggleLike = (reel: ReelItem) => {
    if (propOnToggleLike) {
      propOnToggleLike(reel);
      return;
    }

    const reelId = reel.id;
    const isCurrentlyLiked = activeLikedIds.includes(reelId);
    const nextIsLiked = !isCurrentlyLiked;

    // Trigger delicate, tactile haptic response on mobile
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        if (nextIsLiked) {
          navigator.vibrate([14, 35, 18]);
        } else {
          navigator.vibrate(10);
        }
      } catch {}
    }

    const updated = nextIsLiked
      ? Array.from(new Set([...activeLikedIds, reelId]))
      : activeLikedIds.filter((id) => id !== reelId);

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
        reelTitle: reel.title,
        likedAt: new Date().toISOString(),
        action: nextIsLiked ? 'like' : 'unlike',
        liked: nextIsLiked,
      }),
    }).catch((err) => {
      console.warn('Silent reel like sync:', err);
    });
  };

  const handleOpenReel = (reel: ReelItem) => {
    setActiveReel(reel);
    if (onReelSelect) {
      onReelSelect(reel);
    }
  };

  const formatReelNumber = (id: number) => `REEL ${String(id).padStart(2, '0')}`;

  // Unique Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    reelsData.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return ['All', ...Array.from(set), 'Liked ♡'];
  }, []);

  // Filtered Reels based on Search & Category
  const filteredReels = useMemo(() => {
    return reelsData.filter((reel) => {
      if (selectedCategory === 'Liked ♡') {
        if (!activeLikedIds.includes(reel.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (reel.category !== selectedCategory) return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const paddedStr = String(reel.id).padStart(2, '0');
      const matchesNum =
        q === String(reel.id) ||
        q === paddedStr ||
        q.includes(`reel ${reel.id}`) ||
        q.includes(`reel ${paddedStr}`) ||
        `reel ${paddedStr}`.toLowerCase().includes(q);

      const matchesTitle = reel.title.toLowerCase().includes(q);
      const matchesCaption = reel.caption ? reel.caption.toLowerCase().includes(q) : false;
      const matchesCategory = reel.category ? reel.category.toLowerCase().includes(q) : false;

      return matchesNum || matchesTitle || matchesCaption || matchesCategory;
    });
  }, [searchQuery, selectedCategory, activeLikedIds]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* =================================================================== */}
      {/* SECTION HEADER & ROMANTIC SCRAPBOOK EMBLEM                         */}
      {/* =================================================================== */}
      <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#F8DCE5] to-[#FFF5F8] border border-[#E2A9B8] shadow-2xs mb-3 text-[#A64D68]">
          <Film className="w-6 h-6 text-[#A64D68]" />
        </div>

        <h2 className="font-heading font-serif text-2xl sm:text-3xl md:text-4xl text-[#5A3545] font-semibold mb-2 tracking-tight">
          Moments in Motion ♡
        </h2>
        <p className="font-handwriting text-lg sm:text-xl md:text-2xl text-[#A64D68] leading-relaxed max-w-xl mx-auto">
          Little videos, lovely memories, and moments worth keeping.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-[#A64D68] mt-2.5 flex-wrap">
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
      {/* SEARCH AND CATEGORY FILTERS                                         */}
      {/* =================================================================== */}
      <div className="w-full max-w-3xl mx-auto mb-6 space-y-3.5">
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto">
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
      {/* 3-COLUMN MIXED-SIZE INSTAGRAM-INSPIRED DISCOVERY GRID               */}
      {/* Exactly 3 columns on Mobile, Tablet, PC & TV                        */}
      {/* =================================================================== */}
      <div className="w-full max-w-4xl mx-auto">
        {filteredReels.length > 0 ? (
          <div
            className="w-full grid grid-cols-3 grid-flow-dense auto-rows-[115px] xs:auto-rows-[135px] sm:auto-rows-[170px] md:auto-rows-[210px] lg:auto-rows-[240px] gap-2 xs:gap-2.5 sm:gap-3.5 md:gap-4 justify-center"
            aria-label="Mixed-size video reels discovery feed"
          >
            {filteredReels.map((reel, index) => (
              <ReelExploreTile
                key={reel.id}
                reel={reel}
                index={index}
                isLiked={activeLikedIds.includes(reel.id)}
                onOpen={handleOpenReel}
                onToggleLike={handleToggleLike}
                formatReelNumber={formatReelNumber}
              />
            ))}
          </div>
        ) : (
          /* Empty State when Search or Filter Yields No Results */
          <div className="py-12 px-4 text-center max-w-sm mx-auto space-y-3 bg-[#FFFDF9] rounded-2xl border border-[#F8DCE5] shadow-xs animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-[#FFF5F8] text-[#A64D68] border border-[#F8DCE5] flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-[#A64D68]/60" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-serif text-base text-[#5A3545] font-semibold">
                No memories found
              </h4>
              <p className="font-letter text-xs text-[#9A817B] italic">
                “{searchQuery || selectedCategory}” didn't match any saved reels.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-1.5 rounded-full bg-[#A64D68] text-white text-xs font-medium hover:bg-[#8E3E56] transition-all cursor-pointer shadow-xs"
            >
              Show all memories ♡
            </button>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="mt-6 text-center text-xs font-letter italic text-[#9A817B]">
        Tap any memory to watch ♡
      </div>

      {/* =================================================================== */}
      {/* VINTAGE CHAMPAGNE-GOLD REEL MODAL VIEWER                            */}
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
