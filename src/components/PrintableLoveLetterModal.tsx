import React, { useEffect, useRef } from 'react';
import { Printer, X, Download, Heart, Feather, Sparkles, Scroll } from 'lucide-react';
import { letterStoryPages } from '../config/ektaStoryConfig';

interface PrintableLoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableLoveLetterModal: React.FC<PrintableLoveLetterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock body scroll while modal preview is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    // Delicately trigger native browser print which opens the Print & Save as PDF dialog
    window.print();
  };

  return (
    <div
      id="printable-love-letter-backdrop"
      ref={modalRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex flex-col items-center justify-start py-6 px-3 sm:px-6 print:p-0 print:bg-transparent"
      role="dialog"
      aria-modal="true"
      aria-label="Printable Love Letter for Ekta"
    >
      {/* Non-printing Control Toolbar */}
      <aside
        aria-label="Letter Print Controls"
        className="no-print sticky top-2 z-60 w-full max-w-3xl mb-6 bg-[#FFFDF8]/95 backdrop-blur-md border border-[#C7A66A]/60 shadow-lg rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#5A3545] transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#F8DCE5] text-[#A64D68] flex items-center justify-center shrink-0 shadow-2xs border border-[#C7A66A]/40">
            <Scroll className="w-5 h-5 text-[#A64D68]" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#5A3545] leading-tight flex items-center gap-1.5">
              <span>Keepsake Love Letter</span>
              <span className="text-[#A64D68] text-xs">♡</span>
              <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F8DCE5]/70 text-[#A64D68] border border-[#D99AA5]/40">
                Printable PDF
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-[#9A817B] font-letter italic">
              Choose “Save as PDF” in the destination menu to save a permanent file.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleTriggerPrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#A64D68] to-[#8C3A54] hover:from-[#943F59] hover:to-[#7B2F46] shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#A64D68]/40"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFF8ED] hover:bg-[#F8DCE5] text-[#5A3545] hover:text-[#A64D68] border border-[#D99AA5]/50 flex items-center justify-center transition-all shadow-2xs active:scale-90 cursor-pointer"
            title="Close Preview"
            aria-label="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Printable Parchment Document Container */}
      <div
        id="printable-love-letter-document"
        className="w-full max-w-3xl space-y-8 print:space-y-0 print:max-w-none print:w-full"
      >
        {letterStoryPages.map((page, index) => {
          const isFirstPage = index === 0;
          const isLastPage = index === letterStoryPages.length - 1;

          return (
            <article
              key={page.pageNumber}
              className="print-page-sheet relative bg-[#FFFDF8] border-2 border-[#E8D8C4] rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10 md:p-12 overflow-hidden print:border print:border-[#D1B894] print:rounded-none print:shadow-none print:m-0 print:p-8"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 10% 12%, rgba(215, 185, 150, 0.08) 0%, transparent 40%),
                  radial-gradient(circle at 90% 88%, rgba(166, 77, 104, 0.05) 0%, transparent 45%),
                  linear-gradient(to bottom, #FFFDF8, #FFFBF2)
                `,
              }}
            >
              {/* Vintage Double Border / Gold Framing */}
              <div className="absolute inset-2 sm:inset-3 border border-[#C7A66A]/45 rounded-xl sm:rounded-2xl pointer-events-none print:inset-2" />
              <div className="absolute inset-3 sm:inset-4 border border-[#D99AA5]/35 rounded-lg sm:rounded-xl pointer-events-none print:inset-3" />

              {/* Four Delicate Corner Floral Ornaments */}
              <div className="absolute top-4 left-4 text-[#C7A66A] opacity-70 text-sm select-none pointer-events-none">
                ❦
              </div>
              <div className="absolute top-4 right-4 text-[#C7A66A] opacity-70 text-sm select-none pointer-events-none">
                ❧
              </div>
              <div className="absolute bottom-4 left-4 text-[#C7A66A] opacity-70 text-sm select-none pointer-events-none">
                ❧
              </div>
              <div className="absolute bottom-4 right-4 text-[#C7A66A] opacity-70 text-sm select-none pointer-events-none">
                ❦
              </div>

              {/* Watermark Heart Motif */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
                <Heart className="w-80 h-80 text-[#A64D68]" />
              </div>

              {/* Content Wrapper */}
              <div className="relative z-10">
                {/* Vintage Letterhead on First Page */}
                {isFirstPage && (
                  <header className="text-center pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-[#C7A66A]/30">
                    <div className="flex items-center justify-center gap-2 text-[#A64D68] mb-2">
                      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C7A66A]" />
                      <Feather className="w-4 h-4 text-[#A64D68]" />
                      <span className="font-handwriting text-xl sm:text-2xl tracking-wide">
                        For Ekta, With Love
                      </span>
                      <Feather className="w-4 h-4 text-[#A64D68] -scale-x-100" />
                      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C7A66A]" />
                    </div>

                    <h1 className="font-heading text-2xl sm:text-3xl text-[#5A3545] font-semibold tracking-tight">
                      Words from the Bottom of My Heart
                    </h1>

                    <p className="mt-1 text-xs sm:text-sm text-[#9A817B] font-letter italic">
                      A personal keepsake preserved across five parchment pages
                    </p>
                  </header>
                )}

                {/* Page Number & Chapter Subtitle Badge */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-[#F8DCE5]/60 text-xs text-[#9A817B]">
                  <span className="font-serif uppercase tracking-widest text-[10px] sm:text-xs text-[#A64D68] font-bold">
                    Page {page.pageNumber} of {page.totalPages}
                  </span>
                  <span className="font-letter italic text-[11px] sm:text-xs">
                    {page.subtitle}
                  </span>
                </div>

                {/* Page Title */}
                <h2 className="font-heading text-xl sm:text-2xl text-[#5A3545] font-medium mb-4 sm:mb-6">
                  {page.title}
                </h2>

                {/* Paragraphs in Ruled Ink Aesthetic */}
                <div className="space-y-4 sm:space-y-5 text-[#2B1D24] font-letter text-sm sm:text-base leading-relaxed sm:leading-loose">
                  {page.paragraphs.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-justify indent-4 sm:indent-6 selection:bg-[#F8DCE5]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Wax Seal & Romantic Sign-Off on Last Page */}
                {isLastPage && (
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#C7A66A]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                      <p className="font-handwriting text-xl sm:text-2xl text-[#A64D68] leading-tight">
                        Always &amp; forever yours,
                      </p>
                      <p className="font-serif text-sm sm:text-base font-semibold text-[#5A3545] mt-1">
                        The Boy Who Has Loved You For 10 Years ♡
                      </p>
                      <p className="font-letter text-xs text-[#9A817B] italic mt-0.5">
                        Saved in timeless parchment · For Ekta
                      </p>
                    </div>

                    {/* Pressed Wax Seal Motif */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#A64D68] via-[#8C3A54] to-[#6E2A3E] text-[#FFF8ED] shadow-md border-2 border-[#C7A66A] flex flex-col items-center justify-center text-center p-2 transform rotate-[-4deg] select-none print:shadow-none">
                        <div className="absolute inset-1 rounded-full border border-[#FFF8ED]/30" />
                        <Heart className="w-5 h-5 fill-current text-[#FFF8ED] mb-0.5" />
                        <span className="text-[7.5px] font-serif uppercase tracking-widest font-bold text-[#FFF8ED]">
                          FOR EKTA
                        </span>
                        <span className="text-[6.5px] font-sans tracking-wider text-[#F8DCE5] opacity-90">
                          FOREVER
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Small Page Footer */}
                <div className="mt-8 pt-3 border-t border-[#F8DCE5]/50 flex items-center justify-between text-[10px] text-[#9A817B] font-letter italic">
                  <span>For Ekta, With Love ♡</span>
                  <span>Page {page.pageNumber}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom Floating Print Button for Convenience */}
      <div className="no-print mt-6 mb-8 text-center">
        <button
          type="button"
          onClick={handleTriggerPrint}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#A64D68] hover:bg-[#8C3A54] shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print or Save All 5 Pages as PDF</span>
        </button>
      </div>
    </div>
  );
};
