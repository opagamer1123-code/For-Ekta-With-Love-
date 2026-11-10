import React, { useState, useEffect } from 'react';
import { Feather, Volume2, VolumeX, Printer, Scroll, Clock } from 'lucide-react';
import { letterStoryPages } from '../config/ektaStoryConfig';
import { PageTurnBook, BookChapterData } from './PageTurnBook';
import { paperFlipAudio } from '../services/paperSound';
import { PrintableLoveLetterModal } from './PrintableLoveLetterModal';

interface LoveLetterProps {
  onContinueStory: () => void;
  onPrevSection?: () => void;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ onContinueStory, onPrevSection }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => !paperFlipAudio.getIsMuted());
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [readingSeconds, setReadingSeconds] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ekta_letter_reading_seconds');
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setReadingSeconds((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem('ekta_letter_reading_seconds', next.toString());
        } catch {}
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatReadingTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins === 0) {
      return `${remainingSecs}s`;
    }
    return `${mins}m ${remainingSecs.toString().padStart(2, '0')}s`;
  };

  useEffect(() => {
    return paperFlipAudio.subscribe((muted) => {
      setIsSoundEnabled(!muted);
    });
  }, []);

  const mappedPages: BookChapterData[] = letterStoryPages.map((page) => ({
    id: page.pageNumber,
    chapterNumber: page.pageNumber,
    totalChapters: page.totalPages,
    title: page.title,
    subtitle: page.subtitle,
    paragraphs: page.paragraphs,
  }));

  const toggleSound = () => {
    paperFlipAudio.toggleMute();
  };

  const handleCompleteLetter = () => {
    // Send email with total time taken to read the letter
    if (readingSeconds >= 5) {
      try {
        fetch('/api/reading-time/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'Chapter 2: My Letter for Ekta',
            seconds: readingSeconds,
            formattedDuration: formatReadingTime(readingSeconds),
          }),
        }).catch(() => {});
      } catch {}
    }
    onContinueStory();
  };

  return (
    <section
      id="letter-section"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-20 scroll-mt-20 will-change-transform"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-label="My Letter for Ekta"
    >
      {/* Decorative floral ribbon header */}
      <div className="flex items-center justify-center gap-3 mb-2.5">
        <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#A64D68]/40" />
        <span className="flex items-center gap-2 font-handwriting text-2xl sm:text-3xl text-[#A64D68]">
          <Feather className="w-5 h-5 text-[#A64D68]" />
          My Letter for Ekta ♡
        </span>
        <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#A64D68]/40" />
      </div>

      {/* Live Reading Time Count (No limit, measuring how much time she takes to read) */}
      <div className="flex items-center justify-center mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif text-[#8E5265] bg-[#FFF5F8]/90 border border-[#F8DCE5] shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#A64D68]" />
          <span>Reading time: {formatReadingTime(readingSeconds)} ♡</span>
        </span>
      </div>

      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl text-[#5A3545] font-semibold">
          Words from the Bottom of My Heart
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#9A817B] font-letter italic">
          Turn through the pages at your own pace with each authentic flip.
        </p>

        {/* Sensory immersion audio badge & Printable PDF Button */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={toggleSound}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#A64D68] bg-[#F8DCE5]/50 hover:bg-[#F8DCE5] border border-[#F8DCE5] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A64D68]/40 cursor-pointer"
            title={isSoundEnabled ? 'Paper flip audio effect enabled (click to mute)' : 'Paper flip audio effect muted (click to enable)'}
            aria-label={isSoundEnabled ? 'Paper flip sound effect is on' : 'Paper flip sound effect is muted'}
          >
            {isSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{isSoundEnabled ? 'Paper Flip: On' : 'Paper Flip: Muted'}</span>
          </button>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#5A3545] bg-[#FFFDF8] hover:bg-[#FFF5F8] border border-[#C7A66A]/60 hover:border-[#C7A66A] shadow-2xs hover:shadow-xs transition-all hover:scale-102 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A64D68]/40"
            title="Open and print or save the complete letter as a vintage parchment PDF"
            aria-label="Open printable PDF vintage parchment letter"
          >
            <Printer className="w-3.5 h-3.5 text-[#C7A66A]" aria-hidden="true" />
            <span>Printable Letter (PDF)</span>
          </button>
        </div>
      </div>

      {/* 3D Physical Page Turn Book for My Letter with synced paper flip sound */}
      <PageTurnBook
        chapters={mappedPages}
        initialChapterIndex={0}
        sectionTitle="Page"
        badgeLabel="Personal Letter"
        completeButtonText="Next: Moments in Motion ♡"
        onComplete={handleCompleteLetter}
        onReturnHome={onPrevSection}
      />

      {/* Bottom Sub-CTA & Secondary Print Trigger */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center">
        <button
          type="button"
          onClick={() => setIsPrintModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-serif font-medium text-[#5A3545] bg-[#FFFDF8] hover:bg-[#FFF5F8] border border-[#C7A66A]/80 shadow-2xs hover:shadow-sm transition-all hover:scale-102 active:scale-95 cursor-pointer"
        >
          <Scroll className="w-4 h-4 text-[#C7A66A]" />
          <span>Save &amp; Print Letter as Keepsake PDF ♡</span>
        </button>

        <p className="text-xs text-[#9A817B] font-letter italic">
          A personal confession preserved across 5 pages · Take your time reading each one
        </p>
      </div>

      {/* Printable Vintage Parchment Love Letter Modal */}
      <PrintableLoveLetterModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </section>
  );
};
