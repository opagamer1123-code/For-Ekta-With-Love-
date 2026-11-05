import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';

interface LoveShowerOverlayProps {
  isActive: boolean;
}

interface FallingHeart {
  id: number;
  left: number; // 0 to 100 percentage across screen
  size: number; // small: 8px to 18px
  duration: number; // 5.5s to 12s for a gentle, dreamy descent
  delay: number; // negative delay so hearts immediately fill screen
  swayX: number; // horizontal drift in px (-50px to +50px)
  rotation: number; // natural flutter rotation (-60deg to +60deg)
  opacity: number; // 0.22 to 0.65 semi-transparent
  color: string; // delicate shades of pink
  scale: number;
  hasSparkle: boolean; // Random sparkle on reaching bottom
  sparkleColor: string;
  sparkleSize: number;
}

// Curated romantic semi-transparent pink palette for falling hearts
const SHOWER_PINK_PALETTE = [
  '#F8BBD0', // Soft Pastel Blush
  '#F48FB1', // Blossom Pink
  '#FFB6C1', // Light Rose Pink
  '#FF80AB', // Candy Rose Pink
  '#FFCCD8', // Petal Pink
  '#FCE4EC', // Whisper Pink
  '#F06292', // Vibrant Rose Pink
  '#EDA4B8', // Dusty Rose Blush
  '#FFC1D3', // Cotton Candy Pink
  '#E57373', // Soft Coral Rose
];

// Luminous golden, starlight, and rose hues for bottom popping sparkles
const SPARKLE_PALETTE = [
  '#FFE082', // Warm Champagne Gold
  '#FFF9C4', // Radiant Starlight
  '#FFD54F', // Amber Gold Twinkle
  '#FFF3E0', // Ivory Glow
  '#F8BBD0', // Rose Quartz Shimmer
  '#FCE4EC', // Pastel Sparkle
];

export const LoveShowerOverlay: React.FC<LoveShowerOverlayProps> = ({ isActive }) => {
  // Generate hundreds of small, semi-transparent pink hearts with bottom sparkle flourish
  const hearts: FallingHeart[] = useMemo(() => {
    const list: FallingHeart[] = [];
    const count = 220; // Hundreds of delicate falling hearts

    for (let i = 0; i < count; i++) {
      // Uniform spread across viewport with natural organic randomness
      const left = (i / count) * 100 + (Math.random() * 3 - 1.5);
      const size = Math.floor(Math.random() * 11) + 8; // Small hearts: 8px to 18px
      const duration = Math.random() * 6.5 + 5.5; // 5.5s to 12s for gentle falling
      const delay = -(Math.random() * 12); // Negative delay immediately distributes hearts across the entire screen
      const swayX = (Math.random() - 0.5) * 90; // Natural horizontal drift
      const rotation = (Math.random() - 0.5) * 120; // Gentle tilt
      const opacity = Math.random() * 0.42 + 0.22; // Semi-transparent: 0.22 to 0.64
      const color = SHOWER_PINK_PALETTE[i % SHOWER_PINK_PALETTE.length];
      const scale = Math.random() * 0.35 + 0.8;

      // Randomly assign sparkle flourish to ~68% of hearts as they reach bottom
      const hasSparkle = (i % 3 !== 0) || Math.random() > 0.4;
      const sparkleColor = SPARKLE_PALETTE[i % SPARKLE_PALETTE.length];
      const sparkleSize = Math.floor(Math.random() * 8) + 14; // 14px to 21px

      list.push({
        id: i,
        left: Math.max(0.5, Math.min(99.5, left)),
        size,
        duration,
        delay,
        swayX,
        rotation,
        opacity,
        color,
        scale,
        hasSparkle,
        sparkleColor,
        sparkleSize,
      });
    }

    return list;
  }, []);

  if (!isActive) return null;

  const content = (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
      aria-hidden="true"
    >
      <style>{`
        /* Smooth vertical descent with natural sway from top of viewport to bottom */
        @keyframes loveShowerFall {
          0% {
            transform: translate3d(0, -50px, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(calc(var(--sway-x, 20px) * 0.6), 50vh, 0) rotate(calc(var(--rot-z, 30deg) * 0.5));
          }
          91% {
            transform: translate3d(calc(var(--sway-x, 20px) * 0.93), 93vh, 0) rotate(var(--rot-z, 30deg));
          }
          100% {
            transform: translate3d(var(--sway-x, 20px), 103vh, 0) rotate(var(--rot-z, 30deg));
          }
        }

        /* Heart opacity and popping expansion flourish right as it reaches the bottom */
        @keyframes heartFadeAndPop {
          0% {
            opacity: 0;
            transform: scale(var(--heart-scale, 1));
          }
          8% {
            opacity: var(--heart-opacity, 0.45);
          }
          87% {
            opacity: var(--heart-opacity, 0.45);
            transform: scale(var(--heart-scale, 1));
          }
          91% {
            opacity: calc(var(--heart-opacity, 0.45) * 1.35);
            transform: scale(calc(var(--heart-scale, 1) * 1.4));
          }
          94% {
            opacity: 0;
            transform: scale(calc(var(--heart-scale, 1) * 0.2));
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }

        /* Twinkling sparkle star bursting outward at the bottom of the fall */
        @keyframes sparklePopTwinkle {
          0%, 88% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          91% {
            opacity: 0.95;
            transform: scale(0.6) rotate(15deg);
          }
          94% {
            opacity: 1;
            transform: scale(1.4) rotate(45deg);
          }
          97% {
            opacity: 0.65;
            transform: scale(0.85) rotate(75deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.1) rotate(90deg);
          }
        }
      `}</style>

      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute top-0 will-change-transform pointer-events-none"
          style={
            {
              left: `${h.left}%`,
              width: `${h.size}px`,
              height: `${h.size}px`,
              animationName: 'loveShowerFall',
              animationDuration: `${h.duration}s`,
              animationTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
              animationIterationCount: 'infinite',
              animationDelay: `${h.delay}s`,
              '--sway-x': `${h.swayX}px`,
              '--rot-z': `${h.rotation}deg`,
            } as React.CSSProperties
          }
        >
          {/* Falling Heart SVG with gentle pop burst at the bottom */}
          <div
            className="w-full h-full will-change-transform"
            style={
              {
                color: h.color,
                animationName: 'heartFadeAndPop',
                animationDuration: `${h.duration}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${h.delay}s`,
                '--heart-opacity': h.opacity,
                '--heart-scale': h.scale,
              } as React.CSSProperties
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full drop-shadow-[0_1px_4px_rgba(244,143,177,0.35)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Twinkling Sparkle Pop Star Flourish triggered at the bottom */}
          {h.hasSparkle && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none"
              style={{
                width: `${h.sparkleSize}px`,
                height: `${h.sparkleSize}px`,
                color: h.sparkleColor,
                animationName: 'sparklePopTwinkle',
                animationDuration: `${h.duration}s`,
                animationTimingFunction: 'ease-out',
                animationIterationCount: 'infinite',
                animationDelay: `${h.delay}s`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-[0_0_6px_rgba(255,235,170,0.9)]"
              >
                {/* 4-point diamond star */}
                <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
                {/* Tiny peripheral twinkling specks */}
                <circle cx="4" cy="4" r="1.2" opacity="0.85" />
                <circle cx="20" cy="4" r="1.2" opacity="0.85" />
                <circle cx="4" cy="20" r="1.2" opacity="0.85" />
                <circle cx="20" cy="20" r="1.2" opacity="0.85" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};
