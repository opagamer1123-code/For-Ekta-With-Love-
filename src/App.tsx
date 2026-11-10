/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingPetals } from './components/FloatingPetals';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { OpeningEnvelope } from './components/OpeningEnvelope';
import { LoveLetter } from './components/LoveLetter';
import { NotesSection } from './components/NotesSection';
import { LittleThingsSection } from './components/LittleThingsSection';
import { ProposalSection } from './components/ProposalSection';
import { NoOneElseSection } from './components/NoOneElseSection';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { MobileChapterBar } from './components/MobileChapterBar';
import { DiaryNote } from './types/notes';
import { loadNotesFromStorage, saveNotesToStorage } from './services/notesStorage';
import { romanticAudio } from './services/soundtrack';
import { Heart } from 'lucide-react';

export type AppPage =
  | 'home'
  | 'letter'
  | 'notes'
  | 'little-things'
  | 'no-one-else'
  | 'questions';

const pageMetadata: Record<AppPage, { index: number; title: string; subtitle: string }> = {
  'home': { index: 1, title: 'Home', subtitle: 'The Beginning of His Story' },
  'letter': { index: 2, title: 'My Letter', subtitle: 'It Has Always Been Her' },
  'notes': { index: 3, title: 'Moments in Motion ♡', subtitle: 'Little videos, lovely memories, and moments worth keeping.' },
  'little-things': { index: 4, title: 'Little Things', subtitle: 'Memories I Admire' },
  'no-one-else': { index: 5, title: "There's No One Else in My Heart", subtitle: 'Some feelings are too deep for words...' },
  'questions': { index: 6, title: 'Questions', subtitle: 'Her Answer' },
};

export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'letter' || hash === 'letter-section') return 'letter';
      if (hash === 'notes' || hash === 'notes-section' || hash === 'notes-shared' || hash === 'notes-private') return 'notes';
      if (hash === 'little-things' || hash === 'little-things-section') return 'little-things';
      if (hash === 'no-one-else' || hash === 'no-one-else-section' || hash === 'theres-no-one-else') return 'no-one-else';
      if (hash === 'questions' || hash === 'proposal' || hash === 'proposal-section') return 'questions';
    }
    return 'home';
  });

  const [notes, setNotes] = useState<DiaryNote[]>([]);
  const isOwnerMode = false; // Pure visitor presentation experience for Ekta
  const [notesTab, setNotesTab] = useState<'shared' | 'private'>('shared');
  const [isPrivacyNoticeOpen, setIsPrivacyNoticeOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Initialize notes from browser localStorage and setup background audio listener
  useEffect(() => {
    const { notes: loadedNotes, error } = loadNotesFromStorage();
    setNotes(loadedNotes);
    if (error) {
      setStorageError(error);
    }
    // Discreet owner access via query string (?owner=true or ?admin=true)
    if (typeof window !== 'undefined' && (window.location.search.includes('owner=') || window.location.search.includes('admin='))) {
      setIsOwnerDashboardOpen(true);
    }
  }, []);

  // Listen for browser back / forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'letter' || hash === 'letter-section') setCurrentPage('letter');
      else if (hash === 'notes' || hash === 'notes-section' || hash === 'notes-shared') {
        setCurrentPage('notes');
        setNotesTab('shared');
      } else if (hash === 'notes-private') {
        setCurrentPage('notes');
        setNotesTab('private');
      } else if (hash === 'little-things' || hash === 'little-things-section') setCurrentPage('little-things');
      else if (hash === 'no-one-else' || hash === 'no-one-else-section' || hash === 'theres-no-one-else') setCurrentPage('no-one-else');
      else if (hash === 'questions' || hash === 'proposal' || hash === 'proposal-section') setCurrentPage('questions');
      else if (hash === 'home' || hash === 'envelope-section' || hash === '') setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When Ekta arrives at Chapter 6 ("Questions"), play Dil Se Dil at 15% volume
  useEffect(() => {
    if (currentPage === 'questions') {
      romanticAudio.playForChapter6().catch(() => {});
    }
  }, [currentPage]);

  // Global Keyboard Navigation for PC and TV remote number keys (1 to 6)
  // + Secret Developer Shortcut: Ctrl + Shift + D (or Cmd + Shift + D)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Secret owner dashboard toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsOwnerDashboardOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      if (e.key === '1') navigateToPage('home');
      else if (e.key === '2') navigateToPage('letter');
      else if (e.key === '3') navigateToPage('notes', 'shared');
      else if (e.key === '4') navigateToPage('little-things');
      else if (e.key === '5') navigateToPage('no-one-else');
      else if (e.key === '6') navigateToPage('questions');
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Update notes in state and persist to localStorage
  const handleUpdateNotes = (newNotes: DiaryNote[]) => {
    setNotes(newNotes);
    const { success, error } = saveNotesToStorage(newNotes);
    if (!success && error) {
      setStorageError(error);
    } else {
      setStorageError(null);
    }
  };

  // Dedicated Page Switcher
  const navigateToPage = (target: AppPage | string, targetNotesTab?: 'shared' | 'private') => {
    let resolvedPage: AppPage = 'home';

    if (target === 'envelope-section' || target === 'home') resolvedPage = 'home';
    else if (target === 'letter-section' || target === 'letter') resolvedPage = 'letter';
    else if (target === 'notes-section' || target === 'notes' || target === 'notes-shared' || target === 'notes-private') resolvedPage = 'notes';
    else if (target === 'little-things-section' || target === 'little-things') resolvedPage = 'little-things';
    else if (target === 'no-one-else-section' || target === 'no-one-else' || target === 'theres-no-one-else') resolvedPage = 'no-one-else';
    else if (target === 'proposal-section' || target === 'questions' || target === 'proposal') resolvedPage = 'questions';

    setCurrentPage(resolvedPage);

    if (targetNotesTab) {
      setNotesTab(targetNotesTab);
    } else if (target === 'notes-private') {
      setNotesTab('private');
    } else if (target === 'notes-shared') {
      setNotesTab('shared');
    }

    // Update URL hash for clean bookmarking & browser back/forward history
    const targetHash = resolvedPage === 'home' ? '' : resolvedPage;
    if (window.location.hash.replace('#', '') !== targetHash) {
      window.history.pushState(null, '', targetHash ? `#${targetHash}` : window.location.pathname);
    }

    // Always scroll smoothly to the top of the newly displayed dedicated page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED] text-[#5A3545] relative flex flex-col font-sans selection:bg-[#F8DCE5] selection:text-[#5A3545]">
      {/* Floating Petals and Romantic Sparkles */}
      <FloatingPetals />

      {/* Romantic Custom Cursor Heart Trail */}
      <HeartCursorTrail />

      {/* Storage Warning Banner if localStorage is inaccessible */}
      {storageError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 text-center">
          {storageError}
        </div>
      )}

      {/* Floating Mobile Chapter Navigation Bar */}
      <MobileChapterBar
        currentPage={currentPage}
        onNavigate={navigateToPage}
      />

      {/* Main Experience Content: Render ONLY the Dedicated Page */}
      <main
        className="flex-1 animate-in fade-in duration-300 will-change-transform"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {/* DEDICATED PAGE 1: Home */}
        {currentPage === 'home' && (
          <OpeningEnvelope
            isOpen={isEnvelopeOpen}
            onOpen={() => setIsEnvelopeOpen(true)}
            onLetterRevealed={() => navigateToPage('letter')}
          />
        )}

        {/* DEDICATED PAGE 2: My Letter */}
        {currentPage === 'letter' && (
          <LoveLetter
            onContinueStory={() => navigateToPage('notes', 'shared')}
            onPrevSection={() => navigateToPage('home')}
          />
        )}

        {/* DEDICATED PAGE 3: Moments in Motion ♡ */}
        {currentPage === 'notes' && (
          <NotesSection
            notes={notes}
            isOwnerMode={isOwnerMode}
            onUpdateNotes={handleUpdateNotes}
            activeTab={notesTab}
            onTabChange={(tab) => setNotesTab(tab)}
            onSwitchToOwnerMode={() => {}}
            onNextPage={() => navigateToPage('little-things')}
            onPrevPage={() => navigateToPage('letter')}
          />
        )}

        {/* DEDICATED PAGE 4: Little Things */}
        {currentPage === 'little-things' && (
          <LittleThingsSection
            isOwnerMode={isOwnerMode}
            onContinueToQuestion={() => navigateToPage('no-one-else')}
            onPrevPage={() => navigateToPage('notes', 'shared')}
          />
        )}

        {/* DEDICATED PAGE 5: There's No One Else in My Heart ♡ */}
        {currentPage === 'no-one-else' && (
          <NoOneElseSection
            onNextPage={() => navigateToPage('questions')}
            onPrevPage={() => navigateToPage('little-things')}
          />
        )}

        {/* DEDICATED PAGE 6: Questions */}
        {currentPage === 'questions' && (
          <ProposalSection
            onBackToLetter={() => navigateToPage('letter')}
            onPrevPage={() => navigateToPage('no-one-else')}
            onGoHome={() => navigateToPage('home')}
          />
        )}
      </main>

      {/* Romantic Footer */}
      <footer className="border-t border-[#F8DCE5] py-8 px-4 text-center text-xs text-[#9A817B] relative z-20 bg-[#FFFDF9]/80">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="font-handwriting text-xl text-[#A64D68]">
            For Ekta, With All My Heart ♡
          </p>
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#9A817B] flex-wrap">
            {(['home', 'letter', 'notes', 'little-things', 'no-one-else', 'questions'] as AppPage[]).map((pKey, i) => (
              <React.Fragment key={pKey}>
                <button
                  type="button"
                  onClick={() => navigateToPage(pKey)}
                  className={`hover:text-[#A64D68] transition-colors cursor-pointer ${
                    currentPage === pKey ? 'font-semibold text-[#A64D68] underline decoration-[#A64D68]/40' : ''
                  }`}
                >
                  {pageMetadata[pKey].title}
                </button>
                {i < 5 && <span aria-hidden="true" className="opacity-40">·</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[11px] text-[#9A817B]/80 font-letter italic">
            Made with all my love, always and forever ♡
          </p>
        </div>
      </footer>

      {/* Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={isPrivacyNoticeOpen}
        onClose={() => setIsPrivacyNoticeOpen(false)}
      />

      {/* Owner's Dashboard Modal */}
      <OwnerDashboardModal
        isOpen={isOwnerDashboardOpen}
        onClose={() => setIsOwnerDashboardOpen(false)}
      />
    </div>
  );
}
