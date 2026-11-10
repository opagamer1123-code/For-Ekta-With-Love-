import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Sparkles, Music, Volume2, VolumeX, BookOpen, X } from 'lucide-react';
import { AppPage } from '../App';
import { romanticAudio } from '../services/soundtrack';

interface MobileChapterBarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

const CHAPTER_CONFIG: Array<{ key: AppPage; index: number; title: string; subtitle: string }> = [
  { key: 'home', index: 1, title: 'A Story for Ekta', subtitle: 'The 10-Year Confession' },
  { key: 'letter', index: 2, title: 'My Letter', subtitle: 'Words from the Heart' },
  { key: 'notes', index: 3, title: 'Moments in Motion ♡', subtitle: 'Video Memories' },
  { key: 'little-things', index: 4, title: 'Little Things', subtitle: 'Memories I Admire' },
  { key: 'no-one-else', index: 5, title: 'No One Else ♡', subtitle: 'Deepest Feelings' },
  { key: 'questions', index: 6, title: 'Questions', subtitle: 'Her Answer' },
];

export const MobileChapterBar: React.FC<MobileChapterBarProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(() => romanticAudio.getIsPlaying());

  // Listen to soundtrack playback state
  React.useEffect(() => {
    return romanticAudio.subscribe((playing) => {
      setIsPlayingAudio(playing);
    });
  }, []);

  const currentIndex = CHAPTER_CONFIG.findIndex((c) => c.key === currentPage);
  const currentChapter = CHAPTER_CONFIG[currentIndex] || CHAPTER_CONFIG[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onNavigate(CHAPTER_CONFIG[currentIndex - 1].key);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < CHAPTER_CONFIG.length - 1) {
      onNavigate(CHAPTER_CONFIG[currentIndex + 1].key);
    }
  };

  const handleSelectChapter = (page: AppPage) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.toggle();
  };

  return (
    <>
      {/* Sticky Mobile Floating Navigation Pill (Visible on screens < 1024px) */}
      <header
        className="lg:hidden sticky top-0 z-40 w-full px-3 py-2 pointer-events-none transition-all duration-300"
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))' }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-1.5 p-1 rounded-full bg-[#FFFDF9]/92 backdrop-blur-md border border-[#F8DCE5] shadow-[0_4px_20px_rgba(90,53,69,0.08)] pointer-events-auto">
          {/* Previous Chapter Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed text-[#9A817B]'
                : 'text-[#5A3545] hover:text-[#A64D68] hover:bg-[#F8DCE5]/40 active:scale-95 cursor-pointer'
            }`}
            aria-label="Previous chapter"
            title="Previous chapter"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Center: Tap to open Chapter Quick Menu */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded-full text-center hover:bg-[#F8DCE5]/30 transition-colors cursor-pointer min-w-0"
            aria-label="Open chapter navigation menu"
            title="Jump to another chapter"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#A64D68] animate-pulse shrink-0" />
            <div className="truncate text-left leading-tight">
              <span className="block text-[10px] uppercase font-serif tracking-wider font-semibold text-[#A64D68]">
                Chapter {currentChapter.index} of 6
              </span>
              <span className="block text-xs font-serif font-medium text-[#4A1D2B] truncate">
                {currentChapter.title}
              </span>
            </div>
            <BookOpen className="w-3.5 h-3.5 text-[#C7A66A] shrink-0 ml-0.5" />
          </button>

          {/* Music Toggle */}
          <button
            type="button"
            onClick={toggleMusic}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isPlayingAudio
                ? 'text-[#A64D68] bg-[#F8DCE5]/60 hover:bg-[#F8DCE5]'
                : 'text-[#9A817B] hover:text-[#5A3545] hover:bg-[#F8DCE5]/30'
            }`}
            aria-label={isPlayingAudio ? 'Pause background song (Dil Se Dil)' : 'Play background song (Dil Se Dil)'}
            title={isPlayingAudio ? 'Pause background song' : 'Play background song'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-70" />
            )}
          </button>

          {/* Next Chapter Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === CHAPTER_CONFIG.length - 1}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              currentIndex === CHAPTER_CONFIG.length - 1
                ? 'opacity-30 cursor-not-allowed text-[#9A817B]'
                : 'text-[#5A3545] hover:text-[#A64D68] hover:bg-[#F8DCE5]/40 active:scale-95 cursor-pointer'
            }`}
            aria-label="Next chapter"
            title="Next chapter"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chapter Drawer Modal (BottomSheet) */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chapter Menu"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end p-0 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl border border-[#F8DCE5] shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85dvh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F8DCE5]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-[#A64D68] text-[#A64D68]" />
                <h3 className="font-heading font-serif text-base font-semibold text-[#5A3545]">
                  Chapters Written for Ekta
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A817B] hover:text-[#5A3545] hover:bg-[#F8DCE5]/40 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chapter List */}
            <div className="space-y-2">
              {CHAPTER_CONFIG.map((chap) => {
                const isSelected = chap.key === currentPage;
                return (
                  <button
                    key={chap.key}
                    type="button"
                    onClick={() => handleSelectChapter(chap.key)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#F8DCE5]/90 to-[#FFF0F4] border border-[#E2A9B8] shadow-xs'
                        : 'bg-[#FFF8ED]/50 hover:bg-[#F8DCE5]/30 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                          isSelected
                            ? 'bg-[#A64D68] text-white shadow-2xs'
                            : 'bg-[#F8DCE5] text-[#A64D68]'
                        }`}
                      >
                        {chap.index}
                      </span>
                      <div className="truncate">
                        <span
                          className={`block font-serif text-sm ${
                            isSelected ? 'font-bold text-[#A64D68]' : 'font-medium text-[#5A3545]'
                          }`}
                        >
                          {chap.title}
                        </span>
                        <span className="block text-[11px] text-[#9A817B] font-letter italic truncate">
                          {chap.subtitle}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[11px] font-serif font-medium text-[#A64D68] shrink-0 bg-white/80 px-2 py-0.5 rounded-full border border-[#E2A9B8]">
                        Current ♡
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Audio Soundtrack Info in Drawer */}
            <div className="pt-2 border-t border-[#F8DCE5]/80 flex items-center justify-between text-xs text-[#9A817B]">
              <div className="flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-[#A64D68]" />
                <span className="font-letter italic">Dil Se Dil · Sita Ramam</span>
              </div>
              <button
                type="button"
                onClick={toggleMusic}
                className="font-medium text-[#A64D68] hover:underline cursor-pointer"
              >
                {isPlayingAudio ? 'Pause Music' : 'Play Music'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
