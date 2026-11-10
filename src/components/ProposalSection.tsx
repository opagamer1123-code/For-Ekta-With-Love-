import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Clock,
  Smile,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Loader2,
  Send,
  Feather,
} from 'lucide-react';
import { proposalConfig } from '../config/proposalConfig';
import { HeartConfettiCelebration } from './HeartConfettiCelebration';
import { fireProposalConfetti, fireDiaryCompletionConfetti } from '../services/confetti';

type ProposalAnswer = 'yes' | 'time' | 'friend' | null;

interface ProposalSectionProps {
  onBackToLetter: () => void;
  onPrevPage?: () => void;
  onGoHome?: () => void;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({
  onBackToLetter,
  onPrevPage,
  onGoHome,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<ProposalAnswer>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    saved: boolean;
    message: string | null;
    error: string | null;
  }>({
    saved: false,
    message: null,
    error: null,
  });

  // State for the follow-up marriage / universe question (on YES)
  const [marriageAnswer, setMarriageAnswer] = useState('');
  const [isSendingMarriage, setIsSendingMarriage] = useState(false);
  const [marriageSuccess, setMarriageSuccess] = useState(false);
  const [marriageError, setMarriageError] = useState<string | null>(null);
  const [submittedAnswerText, setSubmittedAnswerText] = useState('');

  // Particle-based confetti effect triggered only once upon reaching the very end
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const hasTriggeredCompletionConfetti = useRef<boolean>(false);
  const [showCompletionReward, setShowCompletionReward] = useState(false);

  useEffect(() => {
    // Check if completion has already been celebrated in this session
    try {
      if (sessionStorage.getItem('for_ekta_diary_completed_celebrated') === 'true') {
        hasTriggeredCompletionConfetti.current = true;
        setShowCompletionReward(true);
        return;
      }
    } catch {}

    const el = bottomSentinelRef.current;
    if (!el) return;

    const triggerCompletionReward = () => {
      if (hasTriggeredCompletionConfetti.current) return;
      hasTriggeredCompletionConfetti.current = true;
      try {
        sessionStorage.setItem('for_ekta_diary_completed_celebrated', 'true');
      } catch {}

      fireDiaryCompletionConfetti();
      setShowCompletionReward(true);
    };

    if (!('IntersectionObserver' in window)) {
      const timer = setTimeout(triggerCompletionReward, 1200);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          triggerCompletionReward();
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getReadingDurationSummary = (): string | undefined => {
    try {
      const storySecs = parseInt(localStorage.getItem('ekta_story_reading_seconds') || '0', 10);
      const letterSecs = parseInt(localStorage.getItem('ekta_letter_reading_seconds') || '0', 10);
      const total = storySecs + letterSecs;
      if (total <= 0) return undefined;
      const mins = Math.floor(total / 60);
      const secs = total % 60;
      if (mins === 0) return `${secs} seconds`;
      return `${mins} minute${mins > 1 ? 's' : ''}${secs > 0 ? ` and ${secs} second${secs > 1 ? 's' : ''}` : ''}`;
    } catch {
      return undefined;
    }
  };

  const handleSelectAnswer = async (ans: ProposalAnswer) => {
    if (!ans) return;
    if (isSubmitting) return;

    setSelectedAnswer(ans);
    setSubmissionStatus({
      saved: false,
      message: null,
      error: null,
    });

    if (ans === 'yes') {
      // For YES: Launch celebration confetti, show the universe/marriage question with text box
      setShowCelebration(true);
      fireProposalConfetti();
      return;
    }

    // For TIME or FRIEND: Record directly in Firestore & email notification
    setShowCelebration(false);
    setIsSubmitting(true);
    const answerLabel = proposalConfig.proposal.options[ans].label;
    const readingDuration = getReadingDurationSummary();

    try {
      const response = await fetch('/api/proposal/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalChoice: answerLabel,
          readingDuration,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmissionStatus({
          saved: true,
          message: 'Your response has been saved with love ♡',
          error: null,
        });
      } else {
        setSubmissionStatus({
          saved: false,
          message: null,
          error:
            result.error ||
            'Unable to process response at this moment. Please click retry below.',
        });
      }
    } catch {
      setSubmissionStatus({
        saved: false,
        message: null,
        error:
          'A connection error occurred while sending your response. Please click retry below.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMarriageAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingMarriage) return;

    setMarriageError(null);
    const trimmed = marriageAnswer.trim();

    if (!trimmed) {
      setMarriageError('Please write a little note or answer from your heart before sending. ♡');
      return;
    }

    setIsSendingMarriage(true);

    try {
      const response = await fetch('/api/proposal/submit-marriage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalChoice: proposalConfig.proposal.options.yes.label,
          marriageAnswer: trimmed,
          readingDuration: getReadingDurationSummary(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMarriageSuccess(true);
        setSubmittedAnswerText(trimmed);
        setShowCelebration(true);
        fireProposalConfetti();
      } else {
        setMarriageError(
          result.error || 'Unable to send your answer at this moment. Please try again. ♡'
        );
      }
    } catch {
      setMarriageError(
        'A connection error occurred while sending your answer. Please check your connection and retry. ♡'
      );
    } finally {
      setIsSendingMarriage(false);
    }
  };

  const handleResetAnswer = () => {
    setSelectedAnswer(null);
    setShowCelebration(false);
    setSubmissionStatus({
      saved: false,
      message: null,
      error: null,
    });
    setMarriageSuccess(false);
    setMarriageError(null);
  };

  return (
    <section
      id="proposal-section"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto relative z-20 will-change-transform"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      aria-label="The Final Proposal for Ekta"
    >
      {/* Confetti Explosion Celebration Overlay — Strictly ONLY for YES selection */}
      {showCelebration && selectedAnswer === 'yes' && (
        <HeartConfettiCelebration
          onDismiss={() => setShowCelebration(false)}
          title="She Said Yes! ♡"
          subtitle="A shower of love for Ekta ✨"
        />
      )}

      {/* Soft Rose-to-Cream Glow and Central Heart Illustration */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#F8DCE5] to-[#FFF5F8] border border-[#E2A9B8] shadow-md shadow-[#F8DCE5]/50 mb-5 relative group">
          <Heart className="w-10 h-10 text-[#A64D68] fill-[#A64D68] animate-pulse" />
          <span className="absolute inset-0 rounded-full bg-[#A64D68]/15 blur-lg -z-10 animate-ping" />
        </div>

        <p className="font-handwriting text-2xl sm:text-3xl text-[#A64D68] mb-2 tracking-wide">
          {proposalConfig.proposal.leadIn}
        </p>
      </div>

      {/* Proposal Card */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 md:p-12 border border-[#F8DCE5] shadow-2xl relative overflow-hidden paper-pattern">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#F8DCE5]/50 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 text-center">
          {/* Main Question for Ekta (Shown before selecting an option) */}
          {!selectedAnswer && (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#5A3545] font-semibold leading-relaxed sm:leading-relaxed mb-8">
                "{proposalConfig.proposal.question}"
              </h2>

              {/* Three Clearly Visible, Accessible Buttons */}
              <div className="space-y-3.5 max-w-md mx-auto">
                {/* Option 1: Yes */}
                <button
                  onClick={() => handleSelectAnswer('yes')}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#A64D68] to-[#8E3E56] hover:from-[#8E3E56] hover:to-[#5A3545] text-white font-medium text-base sm:text-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 group focus-visible:ring-3 focus-visible:ring-[#A64D68]/40 focus-visible:outline-hidden disabled:opacity-60 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-[#F8DCE5]" />
                  <span>{proposalConfig.proposal.options.yes.label}</span>
                  <Heart className="w-5 h-5 text-white fill-white/80 group-hover:scale-110 transition-transform" />
                </button>

                {/* Option 2: Need Time */}
                <button
                  onClick={() => handleSelectAnswer('time')}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#FFF8ED] hover:bg-[#F8DCE5]/50 border border-[#F8DCE5] text-[#5A3545] font-medium text-base shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-2.5 focus-visible:ring-3 focus-visible:ring-[#A64D68]/40 focus-visible:outline-hidden disabled:opacity-60 cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-[#A64D68]" />
                  <span>{proposalConfig.proposal.options.time.label}</span>
                </button>

                {/* Option 3: Friendship */}
                <button
                  onClick={() => handleSelectAnswer('friend')}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#FFF8ED] hover:bg-[#F8DCE5]/50 border border-[#F8DCE5] text-[#5A3545] font-medium text-base shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-2.5 focus-visible:ring-3 focus-visible:ring-[#A64D68]/40 focus-visible:outline-hidden disabled:opacity-60 cursor-pointer"
                >
                  <Smile className="w-4 h-4 text-[#A64D68]" />
                  <span>{proposalConfig.proposal.options.friend.label}</span>
                </button>
              </div>
            </>
          )}

          {/* =================================================================== */}
          {/* AFTER TAPPING YES: Display the Heartfelt Question + Textbox + Email */}
          {/* =================================================================== */}
          {selectedAnswer === 'yes' && (
            <div className="py-2 animate-in fade-in zoom-in-95 duration-500 text-left">
              {/* Badge */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#E2A9B8] text-[#A64D68] text-xs font-serif shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#C7A66A]" />
                  <span>You said Yes · A Question Across Every Universe ♡</span>
                </div>
              </div>

              {/* The Dedicated Universe Question */}
              <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FFF5F8] p-6 sm:p-8 rounded-2xl border border-[#F8DCE5] shadow-xs space-y-4 mb-6">
                <p className="font-letter text-base sm:text-lg text-[#5A3545] leading-relaxed">
                  Ekta, if the universe gave me a thousand different lives, I would still hope to find you in every one of them. In every universe, every multiverse, and every lifetime, I would want my story to lead back to you.
                </p>

                <p className="font-letter text-base sm:text-lg text-[#5A3545] leading-relaxed">
                  So, if our souls found each other in a million different worlds, would you still choose me? Would you let me be the person who stands beside you, loves you, and grows with you in every life?
                </p>

                <div className="pt-2 border-t border-[#F8DCE5]/70">
                  <p className="font-heading font-serif text-lg sm:text-xl md:text-2xl text-[#A64D68] font-bold text-center leading-snug">
                    Will you marry me, Ekta — in this universe, and in every universe that may ever exist? ♡
                  </p>
                </div>
              </div>

              {/* If answer has not been sent yet: Show Textbox and Send Button */}
              {!marriageSuccess ? (
                <form onSubmit={handleSendMarriageAnswer} className="space-y-4 max-w-xl mx-auto">
                  <div>
                    <label
                      htmlFor="ekta-marriage-answer"
                      className="block text-xs font-serif font-medium text-[#7A5B64] mb-2 text-center"
                    >
                      ♡ Your words, your thoughts, your heart:
                    </label>
                    <textarea
                      id="ekta-marriage-answer"
                      value={marriageAnswer}
                      onChange={(e) => setMarriageAnswer(e.target.value)}
                      placeholder="Write your answer here, from the bottom of your heart... ♡"
                      rows={5}
                      disabled={isSendingMarriage}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#E2A9B8] focus:border-[#A64D68] focus:ring-3 focus:ring-[#A64D68]/20 focus:outline-hidden text-base text-[#4A1D2B] placeholder:text-[#B3929C] transition-all resize-y shadow-inner font-sans leading-relaxed"
                    />
                  </div>

                  {/* Validation or API Error Banner */}
                  {marriageError && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{marriageError}</span>
                    </div>
                  )}

                  {/* Send Answer Button */}
                  <div className="pt-2 text-center space-y-3">
                    <button
                      type="submit"
                      disabled={isSendingMarriage}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-3 rounded-full bg-gradient-to-r from-[#A64D68] via-[#8E3E56] to-[#752E43] hover:from-[#933D56] hover:to-[#5A2335] text-white font-medium text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer focus-visible:ring-3 focus-visible:ring-[#A64D68]/40 focus-visible:outline-hidden"
                    >
                      {isSendingMarriage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Sending your answer with all my love...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#F8DCE5]" />
                          <span>Send My Answer to You ♡</span>
                          <Sparkles className="w-4 h-4 text-[#F8DCE5]" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-[#9A817B] font-letter italic">
                      Your answer will be sealed and kept safely in your story's memories forever ♡
                    </p>
                  </div>
                </form>
              ) : (
                /* Success Confirmation & Keepsake Card */
                <div className="space-y-5 animate-in fade-in duration-500 max-w-xl mx-auto">
                  <div className="p-4 rounded-2xl bg-[#FFF8ED] border border-[#F8DCE5] text-center shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="font-heading font-serif text-lg text-[#5A3545] font-semibold">
                      Your answer has been preserved with love ♡
                    </h4>
                    <p className="text-xs text-[#7A5B64] font-letter mt-1">
                      Your heartfelt words have been sealed and kept close to his heart forever.
                    </p>
                  </div>

                  {/* Display What She Wrote */}
                  <div className="bg-[#FFFDF9] p-5 rounded-2xl border-2 border-dashed border-[#E2A9B8] relative">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A64D68] block mb-2 font-serif">
                      Your Message to Him:
                    </span>
                    <blockquote className="font-letter text-base sm:text-lg text-[#4A1D2B] italic leading-relaxed whitespace-pre-wrap">
                      "{submittedAnswerText}"
                    </blockquote>
                  </div>

                  {/* Shower Hearts Again Trigger */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCelebration(true);
                        fireProposalConfetti();
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A64D68] hover:bg-[#8E3E56] text-white text-xs sm:text-sm font-medium shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#F8DCE5]" aria-hidden="true" />
                      <span>Shower Hearts Again ♡</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Return to options */}
              <div className="mt-8 pt-4 border-t border-[#F8DCE5]/70 text-center">
                <button
                  type="button"
                  onClick={handleResetAnswer}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-[#A64D68] bg-[#FFF8ED] border border-[#F8DCE5] hover:bg-[#F8DCE5]/50 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>← Return to initial question</span>
                </button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* RESPONSES FOR TIME OR FRIENDSHIP                                    */}
          {/* =================================================================== */}
          {selectedAnswer && selectedAnswer !== 'yes' && (
            <div className="py-4 animate-in fade-in zoom-in-95 duration-500">
              {/* Submission Progress / Status Feedback Banner */}
              <div className="mb-6 max-w-md mx-auto">
                {isSubmitting ? (
                  <div className="p-3.5 rounded-2xl bg-[#FFF0F4] border border-[#F8DCE5] text-xs text-[#A64D68] flex items-center justify-center gap-2 shadow-2xs">
                    <Loader2 className="w-4 h-4 animate-spin text-[#A64D68]" />
                    <span className="font-medium">Recording your answer with love...</span>
                  </div>
                ) : submissionStatus.saved ? (
                  <div className="p-3.5 rounded-2xl bg-[#FFF8ED] border border-[#F8DCE5] text-xs text-[#5A3545] flex items-center justify-center gap-2 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-emerald-800">
                      {submissionStatus.message || 'Your response is safely recorded with love ♡'}
                    </span>
                  </div>
                ) : submissionStatus.error ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{submissionStatus.error}</span>
                    </div>
                    <button
                      onClick={() => handleSelectAnswer(selectedAnswer)}
                      disabled={isSubmitting}
                      className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold cursor-pointer shrink-0 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Response for TIME */}
              {selectedAnswer === 'time' && (
                <div className="bg-[#FFF8ED] p-6 sm:p-8 rounded-2xl border border-[#F8DCE5] space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#F8DCE5] text-[#A64D68] flex items-center justify-center mx-auto shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#5A3545] font-bold">
                    {proposalConfig.proposal.options.time.responseTitle}
                  </h3>
                  <p className="font-letter text-lg sm:text-xl text-[#5A3545] leading-relaxed max-w-lg mx-auto">
                    {proposalConfig.proposal.options.time.responseMessage}
                  </p>
                </div>
              )}

              {/* Response for FRIENDSHIP */}
              {selectedAnswer === 'friend' && (
                <div className="bg-[#FFF8ED] p-6 sm:p-8 rounded-2xl border border-[#F8DCE5] space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#F8DCE5] text-[#A64D68] flex items-center justify-center mx-auto shadow-sm">
                    <Smile className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#5A3545] font-bold">
                    {proposalConfig.proposal.options.friend.responseTitle}
                  </h3>
                  <p className="font-letter text-lg sm:text-xl text-[#5A3545] leading-relaxed max-w-lg mx-auto">
                    {proposalConfig.proposal.options.friend.responseMessage}
                  </p>
                </div>
              )}

              {/* Back to options button */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={handleResetAnswer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#A64D68] bg-[#FFF8ED] border border-[#F8DCE5] hover:bg-[#F8DCE5]/50 shadow-2xs transition-all cursor-pointer"
                  aria-label="Return to options"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>← Return to options</span>
                </button>
              </div>
            </div>
          )}

          {/* Gentle Romantic Footer Whisper (No mention of email) */}
          <div className="mt-8 pt-5 border-t border-[#F8DCE5]/70 flex items-center justify-center gap-2 text-xs text-[#9A817B] text-center max-w-lg mx-auto leading-relaxed font-letter italic">
            <Heart className="w-3.5 h-3.5 text-[#A64D68] fill-[#F8DCE5] shrink-0" />
            <span>
              A little story written for you, held with care and devotion always ♡
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Page Navigation */}
      <div className="mt-12 pt-8 border-t border-[#F8DCE5]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {onPrevPage ? (
          <button
            onClick={onPrevPage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#A64D68]/40 hover:border-[#A64D68] text-[#A64D68] hover:bg-[#F8DCE5]/30 text-sm font-medium transition-all cursor-pointer"
            aria-label="Return to There's No One Else in My Heart page"
          >
            <span>← Previous: There's No One Else in My Heart</span>
          </button>
        ) : (
          <div className="invisible sm:block w-28" aria-hidden="true" />
        )}

        <div className="flex items-center gap-3">
          <div className="text-xs text-[#9A817B] font-letter italic">
            Dedicated Page 6 of 6 · Questions ♡
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLetter}
            className="text-xs text-[#A64D68] hover:text-[#5A3545] underline font-sans cursor-pointer"
          >
            Re-read My Letter
          </button>
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#A64D68] to-[#8E3E56] text-white text-xs font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Return Home ♡</span>
            </button>
          )}
        </div>
      </div>

      {/* Joyful reward badge for completing the diary */}
      {showCompletionReward && (
        <div className="mt-8 mb-2 max-w-md mx-auto text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFF8ED] via-[#FFF5F8] to-[#FFF8ED] border border-[#C7A66A]/80 text-[#5A3545] shadow-xs text-xs font-serif">
            <Sparkles className="w-4 h-4 text-[#C7A66A] fill-current animate-pulse shrink-0" />
            <span className="font-semibold text-[#A64D68]">Diary Completed ♡</span>
            <span className="text-[#9A817B]">· Thank you for reading every word</span>
          </div>
        </div>
      )}

      {/* Sentinel for detecting the very end of the proposal section */}
      <div
        ref={bottomSentinelRef}
        id="diary-completion-sentinel"
        className="w-full h-8 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
};
