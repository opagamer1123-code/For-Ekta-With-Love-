import React from 'react';
import { ReelsGallery } from './ReelsGallery';
import { VintageReelModal } from './VintageReelModal';
import { DiaryNote } from '../types/notes';

// Backward compatibility export of VideoViewerOverlay
export const VideoViewerOverlay = VintageReelModal;

interface NotesSectionProps {
  notes?: DiaryNote[];
  isOwnerMode?: boolean;
  onUpdateNotes?: (notes: DiaryNote[]) => void;
  activeTab?: 'shared' | 'private';
  onTabChange?: (tab: 'shared' | 'private') => void;
  onSwitchToOwnerMode?: () => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  onNextPage,
  onPrevPage,
}) => {
  return (
    <section
      id="notes-section"
      className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative z-20 animate-in fade-in duration-300 will-change-transform"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-label="Chapter 3: Moments in Motion ♡ - Video Memories"
    >
      {/* Pure Reels Only Discovery Feed */}
      <ReelsGallery />

      {/* Bottom Dedicated Page Navigation */}
      <div className="mt-14 pt-8 border-t border-[#F8DCE5]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {onPrevPage ? (
          <button
            onClick={onPrevPage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#A64D68]/40 hover:border-[#A64D68] text-[#A64D68] hover:bg-[#F8DCE5]/30 text-sm font-medium transition-all cursor-pointer"
            aria-label="Return to My Letter page"
          >
            <span>← Previous: My Letter</span>
          </button>
        ) : (
          <div className="invisible sm:block w-28" aria-hidden="true" />
        )}

        <div className="text-xs text-[#9A817B] font-letter italic">
          Dedicated Page 3 of 6 · Moments in Motion ♡
        </div>

        {onNextPage && (
          <button
            onClick={onNextPage}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A64D68] to-[#8E3E56] hover:from-[#933D56] hover:to-[#5A3545] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
            aria-label="Go to Little Things page"
          >
            <span>Next: Little Things ♡</span>
          </button>
        )}
      </div>
    </section>
  );
};
