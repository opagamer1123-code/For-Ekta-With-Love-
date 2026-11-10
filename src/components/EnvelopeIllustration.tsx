import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export type EnvelopeAnimationPhase =
  | 'closed'
  | 'seal-press'
  | 'seal-break'
  | 'flap-opening'
  | 'letter-sliding'
  | 'letter-reveal'
  | 'revealed';

interface EnvelopeIllustrationProps {
  phase: EnvelopeAnimationPhase;
  onSealClick: () => void;
  disabled?: boolean;
}

export const EnvelopeIllustration: React.FC<EnvelopeIllustrationProps> = ({
  phase,
  onSealClick,
  disabled = false,
}) => {
  const [flapFoldedBack, setFlapFoldedBack] = React.useState(false);

  React.useEffect(() => {
    if (phase === 'flap-opening') {
      // Flap rotates 180deg over 800ms. After ~380ms it passes 90deg and folds behind the back wall.
      const timer = setTimeout(() => {
        setFlapFoldedBack(true);
      }, 380);
      return () => clearTimeout(timer);
    } else if (
      phase === 'letter-sliding' ||
      phase === 'letter-reveal' ||
      phase === 'revealed'
    ) {
      setFlapFoldedBack(true);
    } else {
      setFlapFoldedBack(false);
    }
  }, [phase]);

  const isFlapOpened =
    phase === 'flap-opening' ||
    phase === 'letter-sliding' ||
    phase === 'letter-reveal' ||
    phase === 'revealed';

  const isLetterSliding = phase === 'letter-sliding';
  const isLetterRevealed = phase === 'letter-reveal' || phase === 'revealed';

  const isSealPressed = phase === 'seal-press';
  const isSealBreaking = phase === 'seal-break';
  const isSealGone =
    phase === 'flap-opening' ||
    phase === 'letter-sliding' ||
    phase === 'letter-reveal' ||
    phase === 'revealed';

  return (
    <div
      className="relative w-full max-w-[min(340px,calc(100vw-2rem))] sm:max-w-[400px] md:max-w-[430px] h-[220px] xs:h-[235px] sm:h-[260px] md:h-[275px] mx-auto select-none my-4 sm:my-8"
      style={{ perspective: '1400px' }}
      aria-label="Realistic 3D physical envelope for Ekta"
    >
      {/* 1. Ambient Warm Desk Reflection Glow underneath */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-[#F8DCE5]/60 via-[#FFF0F4]/40 to-[#FFF8ED]/70 rounded-[32px] blur-2xl -z-10 transform scale-110 pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Rose Petals bursting as the envelope flap opens and letter emerges */}
      {(phase === 'flap-opening' || phase === 'letter-sliding') && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-visible" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-5 opacity-90 animate-[cinematicPetalDrift_2.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
              style={{
                left: `${18 + i * 9}%`,
                top: `${35 - (i % 4) * 8}%`,
                animationDelay: `${i * 90}ms`,
              }}
            >
              <svg viewBox="0 0 24 32" fill="none" className="w-full h-full">
                <path
                  d="M12 0C18 8 24 18 20 28C16 34 8 32 4 28C0 22 6 8 12 0Z"
                  fill="#F8DCE5"
                  stroke="#E2A9B8"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 2. Main Physical Envelope Assembly */}
      <div className="relative w-full h-full overflow-visible">

        {/* ========================================================================= */}
        {/* LAYER A: BACK PLATE (z-index: 4) - Inside back wall of the envelope        */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 bg-[#FFFDF9] rounded-2xl border border-[rgba(166,77,104,0.22)] shadow-[0_18px_40px_rgba(90,53,69,0.15)] z-[4] overflow-hidden">
          {/* Subtle interior watermark on the back wall */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#F9E5EC]/45 via-[#FFF8ED]/35 to-[#FFFDF9]"
            aria-hidden="true"
          />
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-20 opacity-15 text-[#A64D68] pointer-events-none"
            aria-hidden="true"
          >
            <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M50 5 Q35 30 10 35 Q30 40 50 20 Q70 40 90 35 Q65 30 50 5 Z" fill="#F8DCE5" />
              <circle cx="50" cy="18" r="4" fill="#A64D68" />
            </svg>
          </div>
          {/* Faint botanical bottom border inside back plate */}
          <div className="absolute bottom-2 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#A64D68]/20 to-transparent" />
        </div>

        {/* ========================================================================= */}
        {/* LAYER B: THE 3D ROTATING TRIANGULAR TOP FLAP                              */}
        {/* - Rotates backwards around top hinge from 0deg to 180deg                  */}
        {/* - Stays in front (z: 30) while swinging 0-90deg, then drops behind (z: 2) */}
        {/*   when folded back >90deg so it rests naturally behind the back plate     */}
        {/* ========================================================================= */}
        <div
          className="absolute top-0 left-0 right-0 h-[142px]"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 0%',
            transform: isFlapOpened ? 'rotateX(180deg)' : 'rotateX(0deg)',
            transition: 'transform 800ms cubic-bezier(0.35, 0, 0.25, 1)',
            zIndex: flapFoldedBack ? 2 : 30,
          }}
          aria-hidden="true"
        >
          {/* FACE 1: OUTER FLAP (Facing front when closed) */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(0deg)',
            }}
          >
            <svg
              className="w-full h-full drop-shadow-[0_4px_10px_rgba(90,53,69,0.12)]"
              viewBox="0 0 420 142"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flapOuterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFDF9" />
                  <stop offset="70%" stopColor="#FFF2F6" />
                  <stop offset="100%" stopColor="#FAE6EE" />
                </linearGradient>
                <filter id="flapEdgeGlow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#A64D68" floodOpacity="0.15" />
                </filter>
              </defs>
              {/* Outer triangular fold */}
              <path
                d="M0,0 L210,140 L420,0 Z"
                fill="url(#flapOuterGrad)"
                stroke="rgba(166, 77, 104, 0.28)"
                strokeWidth="1.2"
                filter="url(#flapEdgeGlow)"
              />
              {/* Decorative inner stitched rule on flap */}
              <path
                d="M24,8 L210,130 L396,8"
                stroke="rgba(166, 77, 104, 0.16)"
                strokeWidth="1"
                strokeDasharray="4 3"
                fill="none"
              />
            </svg>
          </div>

          {/* FACE 2: INNER FLAP LINING (Becomes visible when folded 180° backwards) */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <svg
              className="w-full h-full drop-shadow-[0_-4px_12px_rgba(90,53,69,0.08)]"
              viewBox="0 0 420 142"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flapInnerGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FFF8ED" />
                  <stop offset="60%" stopColor="#FFF1F5" />
                  <stop offset="100%" stopColor="#FAEDF2" />
                </linearGradient>
              </defs>
              {/* Inverted triangular shape pointing upwards when viewed backwards */}
              <path
                d="M0,142 L210,2 L420,142 Z"
                fill="url(#flapInnerGrad)"
                stroke="rgba(166, 77, 104, 0.24)"
                strokeWidth="1.2"
              />
              {/* Fold hinge crease shadow line */}
              <line
                x1="0"
                y1="141"
                x2="420"
                y2="141"
                stroke="rgba(90, 53, 69, 0.15)"
                strokeWidth="2"
              />
              {/* Delicate inner floral accent */}
              <path
                d="M200,60 Q210,48 220,60 Q210,72 200,60 Z"
                fill="#F8DCE5"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER C: THE LETTER SHEET (z-index: 10)                                   */}
        {/* - Stays INSIDE the envelope pocket (z: 10) beneath front pocket (z: 20)   */}
        {/* - Slides upwards gracefully out of the opening with bottom still tucked   */}
        {/* ========================================================================= */}
        <div
          className={`absolute left-4 sm:left-6 right-4 sm:right-6 h-[225px] sm:h-[245px] md:h-[260px] bg-[#FFFDF8] rounded-t-xl border border-[rgba(166,77,104,0.24)] p-4 sm:p-5 z-[10] select-none transition-all duration-700 ease-out ${
            isLetterRevealed
              ? '-translate-y-[190px] sm:-translate-y-[220px] md:-translate-y-[245px] scale-[1.02] shadow-[0_22px_45px_rgba(90,53,69,0.22)] ring-1 ring-[#F8DCE5]/70 opacity-100'
              : isLetterSliding
              ? 'animate-[letterPhysicalSlide_0.9s_cubic-bezier(0.25,1,0.5,1)_forwards] shadow-[0_12px_28px_rgba(90,53,69,0.18)]'
              : 'top-7 sm:top-8 translate-y-0 opacity-95 shadow-[0_-2px_10px_rgba(90,53,69,0.06)]'
          }`}
          style={{
            transformStyle: 'preserve-3d',
          }}
          aria-hidden="true"
        >
          {/* Authentic vintage ruled paper background & edge depth */}
          <div className="absolute inset-0 rounded-t-xl bg-gradient-to-b from-[#FFFDF8] to-[#FFF9F2] opacity-90 pointer-events-none" />

          {/* Letter Stationery Header */}
          <div className="relative border-b border-dashed border-[rgba(166,77,104,0.25)] pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A64D68]/40" />
              <span className="font-handwriting text-[#A64D68] text-xl sm:text-2xl font-semibold tracking-wide">
                For Ekta ♡
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#F8DCE5]/80 flex items-center justify-center border border-[#E2A9B8]/60 shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-[#A64D68] fill-[#A64D68]" />
            </div>
          </div>

          {/* Letter preview content: handwritten lines peeking out */}
          <div className="relative mt-3 space-y-2">
            <p className="font-handwriting text-[#5A3545] text-sm sm:text-base leading-snug italic">
              Hey Ekta, I have a little story to tell you...
            </p>
            <div className="space-y-2 opacity-50 pt-1">
              <div className="h-1.5 bg-[#A64D68]/25 rounded-full w-4/5" />
              <div className="h-1.5 bg-[#A64D68]/20 rounded-full w-full" />
              <div className="h-1.5 bg-[#A64D68]/20 rounded-full w-3/4" />
              <div className="h-1.5 bg-[#A64D68]/15 rounded-full w-5/6" />
            </div>
          </div>

          {/* Subtle pressed flower seal watermark at bottom corner */}
          <div className="absolute bottom-3 right-4 opacity-30 text-[#A64D68] pointer-events-none">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="20" cy="20" r="10" strokeDasharray="2 2" />
              <path d="M20 10 C15 15 15 25 20 30 C25 25 25 15 20 10 Z" fill="#F8DCE5" />
            </svg>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER D: ENVELOPE FRONT POCKET (z-index: 20)                              */}
        {/* Overlaps front of the letter sheet, creating realistic pocket containment */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none z-[20]">
          <svg
            className="w-full h-full"
            viewBox="0 0 420 270"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="envLeftFoldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF8ED" />
                <stop offset="85%" stopColor="#FFF0F5" />
                <stop offset="100%" stopColor="#FDE6EE" />
              </linearGradient>
              <linearGradient id="envRightFoldGrad" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF8ED" />
                <stop offset="85%" stopColor="#FFF0F5" />
                <stop offset="100%" stopColor="#FDE6EE" />
              </linearGradient>
              <linearGradient id="envBottomFoldGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#FFFDF9" />
                <stop offset="70%" stopColor="#FAF1F5" />
                <stop offset="100%" stopColor="#F6E2EB" />
              </linearGradient>
              <filter id="envFoldSoftShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="-2" stdDeviation="3" floodColor="#5A3545" floodOpacity="0.09" />
              </filter>
            </defs>

            {/* Left triangular front fold */}
            <path
              d="M0,0 L210,140 L0,270 Z"
              fill="url(#envLeftFoldGrad)"
              stroke="rgba(166, 77, 104, 0.2)"
              strokeWidth="1.2"
            />

            {/* Right triangular front fold */}
            <path
              d="M420,0 L210,140 L420,270 Z"
              fill="url(#envRightFoldGrad)"
              stroke="rgba(166, 77, 104, 0.2)"
              strokeWidth="1.2"
            />

            {/* Bottom triangular fold (overlapping left and right) */}
            <path
              d="M0,270 L210,128 L420,270 Z"
              fill="url(#envBottomFoldGrad)"
              stroke="rgba(166, 77, 104, 0.24)"
              strokeWidth="1.2"
              filter="url(#envFoldSoftShadow)"
            />

            {/* Subtle botanical corner flourish lines */}
            <g stroke="#A64D68" strokeWidth="0.8" fill="none" opacity="0.35">
              <path d="M14,256 Q26,251 32,241" />
              <circle cx="32" cy="241" r="1.5" fill="#A64D68" />
              <path d="M406,256 Q394,251 388,241" />
              <circle cx="388" cy="241" r="1.5" fill="#A64D68" />
            </g>
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* LAYER E: 3D REALISTIC BREAKING WAX SEAL (z-index: 30)                     */}
        {/* Responds with subtle press (0.4s), then splits into 3 physical fragments   */}
        {/* with hairline fissures, crumbs, and delicate sparkles                     */}
        {/* ========================================================================= */}
        {!isSealGone && (
          <div
            className={`absolute left-1/2 top-[138px] -translate-x-1/2 -translate-y-1/2 z-[30] transition-opacity duration-400 ${
              isSealBreaking ? 'pointer-events-none' : ''
            }`}
          >
            <button
              onClick={onSealClick}
              disabled={disabled || phase !== 'closed'}
              type="button"
              className={`group cursor-pointer focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-[#A64D68]/60 rounded-full disabled:cursor-not-allowed relative p-2 flex items-center justify-center transition-all duration-300 ${
                isSealPressed
                  ? 'scale-90 translate-y-1 brightness-95'
                  : 'hover:scale-105 active:scale-95'
              }`}
              aria-label="Tap wax seal to open letter for Ekta"
              title="Tap heart seal to open letter"
            >
              {/* Outer gentle breathing pulse halo around seal when closed */}
              {phase === 'closed' && (
                <div
                  className="absolute inset-1 rounded-full bg-[#A64D68]/20 animate-ping opacity-35 pointer-events-none"
                  aria-hidden="true"
                />
              )}

              {/* Sparkle burst during wax breaking */}
              {isSealBreaking && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <div className="absolute -top-3 -left-3 animate-[sparkleFlash_0.5s_ease-out_forwards]">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                  </div>
                  <div className="absolute -top-2 right-1 animate-[sparkleFlash_0.55s_ease-out_50ms_forwards]">
                    <Sparkles className="w-4 h-4 text-pink-200" />
                  </div>
                  <div className="absolute -bottom-3 left-2 animate-[sparkleFlash_0.5s_ease-out_80ms_forwards]">
                    <Sparkles className="w-4 h-4 text-amber-100" />
                  </div>
                </div>
              )}

              {/* A. INTACT SEAL / SEAL-PRESS STATE */}
              {!isSealBreaking ? (
                <div
                  className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#7B2E44] via-[#A64D68] to-[#C96B85] shadow-[0_6px_20px_rgba(90,53,69,0.38)] flex items-center justify-center transition-all duration-300 ${
                    isSealPressed
                      ? 'shadow-[0_2px_8px_rgba(90,53,69,0.5)] ring-2 ring-[#FFF0F4]/60'
                      : 'group-hover:shadow-[0_10px_26px_rgba(90,53,69,0.48)]'
                  }`}
                >
                  {/* Outer organic scalloped wax rim */}
                  <div className="absolute inset-1 rounded-full border border-[rgba(255,255,255,0.28)] pointer-events-none" />

                  {/* Debossed inner wax bed */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8E3E56] shadow-inner flex items-center justify-center border border-[#6B283A]/40 relative overflow-hidden">
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-white/95 fill-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
                        isSealPressed ? 'scale-90' : 'group-hover:scale-115'
                      }`}
                    />

                    {/* Hairline Fracture Cracks appearing on Press */}
                    {isSealPressed && (
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none animate-[crackGlow_0.35s_ease-out_forwards]"
                        viewBox="0 0 40 40"
                      >
                        <path
                          d="M18,4 L20,16 L14,24 L10,36"
                          stroke="rgba(255, 235, 245, 0.95)"
                          strokeWidth="1.2"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <path
                          d="M20,16 L28,22 L34,26"
                          stroke="rgba(255, 235, 245, 0.95)"
                          strokeWidth="1.2"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Subtle caption below seal when closed */}
                  {phase === 'closed' && (
                    <span className="absolute -bottom-6 font-handwriting text-xs sm:text-sm text-[#A64D68] font-semibold whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-2xs">
                      Tap seal ♡
                    </span>
                  )}
                </div>
              ) : (
                /* B. BREAKING SEAL: SPLITS INTO 3 NATURAL ORGANIC WAX FRAGMENTS */
                <div className="relative w-15 h-15 sm:w-16 sm:h-16">
                  {/* Fragment 1: Top-Left Shard (drifts up-left & rotates) */}
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-full bg-gradient-to-br from-[#7B2E44] to-[#A64D68] shadow-md border-t border-l border-white/30 animate-[shardTopLeft_0.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards] flex items-center justify-center overflow-hidden">
                    <span className="text-[10px] text-white/80 font-bold ml-1 mt-1">♡</span>
                  </div>

                  {/* Fragment 2: Bottom-Left Shard (drifts down-left & rotates) */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-full bg-gradient-to-tr from-[#6B283A] to-[#8E3E56] shadow-md border-b border-l border-white/25 animate-[shardBottomLeft_0.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards]" />

                  {/* Fragment 3: Right Shard (drifts right & rotates) */}
                  <div className="absolute top-0 right-0 w-8 h-15 rounded-r-full bg-gradient-to-l from-[#C96B85] to-[#A64D68] shadow-md border-r border-white/30 animate-[shardRight_0.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  </div>

                  {/* Wax crumbs / flecks scattering */}
                  <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#8E3E56] animate-[crumbScatter1_0.45s_ease-out_forwards]" />
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#C96B85] animate-[crumbScatter2_0.45s_ease-out_forwards]" />
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Physics-accurate Keyframe Animations */}
      <style>{`
        /* Cinematic Petal drift on flap opening */
        @keyframes cinematicPetalDrift {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate(75px, -130px) rotate(240deg) scale(1.15);
            opacity: 0;
          }
        }

        /* Crack lines appearing on press */
        @keyframes crackGlow {
          0% {
            opacity: 0;
            stroke-dasharray: 40;
            stroke-dashoffset: 40;
          }
          100% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }

        /* Wax Seal Fragment physics animations */
        @keyframes shardTopLeft {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-16px, -14px) rotate(-18deg) scale(0.94);
            opacity: 0;
          }
        }

        @keyframes shardBottomLeft {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-14px, 16px) rotate(-12deg) scale(0.94);
            opacity: 0;
          }
        }

        @keyframes shardRight {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(18px, 4px) rotate(20deg) scale(0.94);
            opacity: 0;
          }
        }

        @keyframes crumbScatter1 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-24px, 22px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes crumbScatter2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(22px, -18px) scale(0.4);
            opacity: 0;
          }
        }

        @keyframes sparkleFlash {
          0% {
            transform: scale(0.2) rotate(0deg);
            opacity: 0;
          }
          40% {
            transform: scale(1.3) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: scale(0.5) rotate(90deg);
            opacity: 0;
          }
        }

        /* Letter sliding smoothly out of the envelope pocket with gentle natural easing */
        @keyframes letterPhysicalSlide {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.95;
          }
          40% {
            transform: translateY(-75px) scale(1.005);
            opacity: 1;
          }
          55% {
            transform: translateY(-78px) scale(1.01);
            opacity: 1;
          }
          100% {
            transform: translateY(-190px) scale(1.02);
            opacity: 1;
          }
        }

        @media (min-width: 640px) {
          @keyframes letterPhysicalSlide {
            0% {
              transform: translateY(0px) scale(1);
              opacity: 0.95;
            }
            40% {
              transform: translateY(-90px) scale(1.005);
              opacity: 1;
            }
            55% {
              transform: translateY(-93px) scale(1.01);
              opacity: 1;
            }
            100% {
              transform: translateY(-220px) scale(1.02);
              opacity: 1;
            }
          }
        }

        @media (min-width: 768px) {
          @keyframes letterPhysicalSlide {
            0% {
              transform: translateY(0px) scale(1);
              opacity: 0.95;
            }
            40% {
              transform: translateY(-100px) scale(1.005);
              opacity: 1;
            }
            55% {
              transform: translateY(-104px) scale(1.01);
              opacity: 1;
            }
            100% {
              transform: translateY(-245px) scale(1.02);
              opacity: 1;
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes letterPhysicalSlide {
            0% {
              transform: translateY(0px);
            }
            100% {
              transform: translateY(-140px);
            }
          }
          .animate-[cinematicPetalDrift_2.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards],
          .animate-[shardTopLeft_0.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards],
          .animate-[shardBottomLeft_0.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards],
          .animate-[shardRight_0.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards] {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
