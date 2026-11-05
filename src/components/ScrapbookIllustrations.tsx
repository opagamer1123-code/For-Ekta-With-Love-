import React from 'react';

interface IllustrationProps {
  className?: string;
}

/**
 * Card 01 — Your Eyes ♡
 * Beautiful artistic brown-eye illustration.
 * Delicate sparkling details, warm brown, blush, and champagne-gold tones.
 */
export const EyesIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40 sm:h-44' }) => (
  <svg
    viewBox="0 0 340 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      {/* Soft glowing radial gradient for warm brown irises */}
      <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#C7A66A" stopOpacity="0.95" />
        <stop offset="35%" stopColor="#8B5A2B" />
        <stop offset="75%" stopColor="#4A2E1B" />
        <stop offset="100%" stopColor="#25140B" />
      </radialGradient>
      {/* Golden catchlight glow */}
      <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF9E6" stopOpacity="1" />
        <stop offset="60%" stopColor="#E6CA85" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#C7A66A" stopOpacity="0" />
      </radialGradient>
      {/* Dreamy ambient background */}
      <radialGradient id="softAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F8DCE5" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#FDEAE4" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient soft glow */}
    <ellipse cx="170" cy="95" rx="150" ry="75" fill="url(#softAura)" />

    {/* Elegant Arched Floral Wreath Framing the Eyes */}
    <g stroke="#C7A66A" strokeWidth="1" strokeLinecap="round" opacity="0.85">
      {/* Top botanical arch */}
      <path d="M 45 90 C 85 40, 255 40, 295 90" fill="none" />
      {/* Bottom botanical arch */}
      <path d="M 55 100 C 95 150, 245 150, 285 100" fill="none" strokeDasharray="2 3" opacity="0.6" />

      {/* Delicate floral buds and leaves around wreath */}
      <path d="M 65 75 C 60 65, 73 61, 77 70 C 75 77, 68 80, 65 75 Z" fill="#F8DCE5" stroke="#C7A66A" strokeWidth="0.8" />
      <path d="M 90 55 C 85 45, 97 41, 102 50 C 100 57, 93 60, 90 55 Z" fill="#D99AA5" fillOpacity="0.6" stroke="#C7A66A" strokeWidth="0.8" />
      <circle cx="110" cy="46" r="2.5" fill="#E6CA85" />
      <circle cx="120" cy="42" r="1.5" fill="#C77D91" />

      {/* Center top rosebud blossom */}
      <g transform="translate(170, 40)">
        <path d="M -8 5 C -12 -5, -4 -10, 0 -6 C 4 -10, 12 -5, 8 5 Z" fill="#D99AA5" stroke="#C7A66A" strokeWidth="0.8" />
        <circle cx="0" cy="-2" r="2.5" fill="#FFF5F8" />
        <circle cx="-12" cy="2" r="1.5" fill="#C7A66A" />
        <circle cx="12" cy="2" r="1.5" fill="#C7A66A" />
      </g>

      <path d="M 250 55 C 255 45, 243 41, 238 50 C 240 57, 247 60, 250 55 Z" fill="#D99AA5" fillOpacity="0.6" stroke="#C7A66A" strokeWidth="0.8" />
      <path d="M 275 75 C 280 65, 267 61, 263 70 C 265 77, 272 80, 275 75 Z" fill="#F8DCE5" stroke="#C7A66A" strokeWidth="0.8" />
      <circle cx="230" cy="46" r="2.5" fill="#E6CA85" />
      <circle cx="220" cy="42" r="1.5" fill="#C77D91" />
    </g>

    {/* LEFT EYE */}
    <g transform="translate(112, 95)">
      {/* Sclera / eye contour */}
      <path
        d="M -46 0 C -26 -22, 26 -22, 46 0 C 26 18, -26 18, -46 0 Z"
        fill="#FFFDFB"
        stroke="#4A1D2B"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Delicate upper lid crease */}
      <path d="M -38 -15 C -18 -26, 18 -26, 38 -15" stroke="#C7A66A" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />

      {/* Warm Brown Iris */}
      <circle cx="0" cy="0" r="17" fill="url(#irisGrad)" stroke="#3B1E10" strokeWidth="1" />
      <circle cx="0" cy="0" r="13.5" stroke="#C7A66A" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.65" />
      {/* Pupil */}
      <circle cx="0" cy="0" r="7.5" fill="#140A06" />
      {/* Catchlight & Sparkle */}
      <circle cx="-4.5" cy="-4.5" r="3.4" fill="#FFFFFF" />
      <circle cx="4.5" cy="3" r="1.6" fill="#FFF9E6" />
      <circle cx="-2" cy="4" r="1" fill="#FFFFFF" opacity="0.85" />

      {/* Eyelashes */}
      <path d="M -34 -13 C -36 -19, -40 -22, -42 -24" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M -22 -18 C -23 -25, -26 -28, -27 -30" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M -8 -20 C -8 -28, -10 -31, -10 -33" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M 8 -20 C 9 -28, 12 -31, 13 -33" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M 22 -17 C 24 -24, 28 -27, 30 -29" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M 34 -11 C 37 -17, 42 -19, 44 -20" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
    </g>

    {/* RIGHT EYE */}
    <g transform="translate(228, 95)">
      {/* Sclera / eye contour */}
      <path
        d="M -46 0 C -26 -22, 26 -22, 46 0 C 26 18, -26 18, -46 0 Z"
        fill="#FFFDFB"
        stroke="#4A1D2B"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Delicate upper lid crease */}
      <path d="M -38 -15 C -18 -26, 18 -26, 38 -15" stroke="#C7A66A" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />

      {/* Warm Brown Iris */}
      <circle cx="0" cy="0" r="17" fill="url(#irisGrad)" stroke="#3B1E10" strokeWidth="1" />
      <circle cx="0" cy="0" r="13.5" stroke="#C7A66A" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.65" />
      {/* Pupil */}
      <circle cx="0" cy="0" r="7.5" fill="#140A06" />
      {/* Catchlight & Sparkle */}
      <circle cx="-4.5" cy="-4.5" r="3.4" fill="#FFFFFF" />
      <circle cx="4.5" cy="3" r="1.6" fill="#FFF9E6" />
      <circle cx="-2" cy="4" r="1" fill="#FFFFFF" opacity="0.85" />

      {/* Eyelashes */}
      <path d="M -34 -11 C -37 -17, -42 -19, -44 -20" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M -22 -17 C -24 -24, -28 -27, -30 -29" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M -8 -20 C -9 -28, -12 -31, -13 -33" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M 8 -20 C 8 -28, 10 -31, 10 -33" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M 22 -18 C 23 -25, 26 -28, 27 -30" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
      <path d="M 34 -13 C 36 -19, 40 -22, 42 -24" stroke="#4A1D2B" strokeWidth="1" strokeLinecap="round" />
    </g>

    {/* Tiny Stars & Sparkling Details */}
    <g transform="translate(170, 95)">
      <path d="M 0 -7 Q 0 0, 7 0 Q 0 0, 0 7 Q 0 0, -7 0 Q 0 0, 0 -7" fill="#C7A66A" />
      <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
    </g>
    <g transform="translate(52, 115)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#E6CA85" />
    </g>
    <g transform="translate(288, 115)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#E6CA85" />
    </g>
    <circle cx="150" cy="76" r="1.5" fill="#C7A66A" />
    <circle cx="190" cy="76" r="1.5" fill="#C7A66A" />
    <circle cx="92" cy="125" r="1.3" fill="#D99AA5" />
    <circle cx="248" cy="125" r="1.3" fill="#D99AA5" />
  </svg>
);

/**
 * Card 02 — Your Hair ♡
 * Beautiful flowing hair illustration.
 * Delicate individual strands, a small pink ribbon, and subtle floral details.
 */
export const HairIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40 sm:h-44' }) => (
  <svg
    viewBox="0 0 340 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="hairGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A2E1B" />
        <stop offset="40%" stopColor="#6F4426" />
        <stop offset="70%" stopColor="#8B5A2B" />
        <stop offset="100%" stopColor="#4A2E1B" />
      </linearGradient>
      <linearGradient id="hairGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5A2B" />
        <stop offset="50%" stopColor="#C7A66A" />
        <stop offset="100%" stopColor="#6F4426" />
      </linearGradient>
      <radialGradient id="hairAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDECE8" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#FFFDF8" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Soft peach/rose ambient background */}
    <ellipse cx="170" cy="95" rx="135" ry="75" fill="url(#hairAura)" />

    {/* Cascading Flowing Hair Waves */}
    <g strokeLinecap="round" fill="none">
      {/* Broad flowing locks background */}
      <path
        d="M 130 30 C 95 62, 85 115, 115 158 C 138 185, 180 180, 195 152 C 218 115, 235 72, 190 35"
        stroke="url(#hairGrad1)"
        strokeWidth="6"
        opacity="0.25"
      />

      {/* Main flowing wave 1 */}
      <path
        d="M 140 25 C 105 58, 100 110, 132 148 C 152 168, 190 162, 205 135 C 225 98, 220 56, 182 30"
        stroke="url(#hairGrad1)"
        strokeWidth="3.5"
      />

      {/* Fine inner strand highlights */}
      <path
        d="M 150 28 C 122 60, 118 105, 142 138 C 158 155, 185 152, 198 130 C 216 98, 210 64, 178 34"
        stroke="url(#hairGrad2)"
        strokeWidth="1.8"
      />
      <path
        d="M 158 35 C 135 68, 132 100, 152 132 C 166 145, 184 142, 192 124"
        stroke="#FFF8ED"
        strokeWidth="1.2"
        opacity="0.8"
      />

      {/* Left tendril */}
      <path
        d="M 122 48 C 85 80, 80 122, 96 154 C 105 170, 122 175, 130 158"
        stroke="#6F4426"
        strokeWidth="2"
      />
      <path
        d="M 126 55 C 94 85, 90 118, 104 146"
        stroke="#C7A66A"
        strokeWidth="1"
      />

      {/* Right sweeping curl */}
      <path
        d="M 200 42 C 242 74, 252 122, 230 156 C 218 174, 192 174, 182 156 C 172 136, 178 104, 188 82"
        stroke="#4A2E1B"
        strokeWidth="2.5"
      />
      <path
        d="M 195 50 C 232 78, 240 115, 222 145 C 212 160, 194 158, 186 145"
        stroke="url(#hairGrad2)"
        strokeWidth="1.4"
      />
    </g>

    {/* =================================================================== */}
    {/* SMALL PINK RIBBON TIED DELICATELY IN THE HAIR */}
    {/* =================================================================== */}
    <g transform="translate(170, 78)">
      {/* Ribbon Knot */}
      <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="#A64D68" stroke="#D99AA5" strokeWidth="1" />
      {/* Ribbon Left Bow Loop */}
      <path
        d="M -3 -1 C -14 -12, -22 -2, -6 2 Z"
        fill="#F8DCE5"
        stroke="#A64D68"
        strokeWidth="1.2"
      />
      {/* Ribbon Right Bow Loop */}
      <path
        d="M 3 -1 C 14 -12, 22 -2, 6 2 Z"
        fill="#F8DCE5"
        stroke="#A64D68"
        strokeWidth="1.2"
      />
      {/* Ribbon Tails flowing downward */}
      <path
        d="M -2 2 C -8 14, -14 22, -18 28"
        stroke="#A64D68"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 2 2 C 8 14, 12 24, 16 30"
        stroke="#A64D68"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Golden center highlight on bow */}
      <circle cx="0" cy="0" r="1.5" fill="#E6CA85" />
    </g>

    {/* Subtle floral blossoms woven into the hair */}
    {/* Rosebud 1 */}
    <g transform="translate(138, 80)">
      <circle cx="0" cy="0" r="7" fill="#F8DCE5" stroke="#D99AA5" strokeWidth="1" />
      <path d="M -3 0 C -3 -3, 3 -3, 3 0 C 3 3, -3 3, -3 0 Z" fill="#A64D68" />
      <circle cx="-6" cy="7" r="2.5" fill="#C7A66A" opacity="0.8" />
      <path d="M 5 5 C 10 3, 14 8, 12 12 C 8 13, 5 9, 5 5 Z" fill="#D99AA5" opacity="0.6" />
    </g>

    {/* Rosebud 2 */}
    <g transform="translate(208, 105)">
      <circle cx="0" cy="0" r="8" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <path d="M -4 -1 C -4 -4, 4 -4, 4 -1 C 4 3, -4 3, -4 -1 Z" fill="#D99AA5" />
      <circle cx="0" cy="-1" r="2" fill="#A64D68" />
      <path d="M -8 5 C -12 7, -15 3, -12 0 C -9 0, -7 3, -8 5 Z" fill="#E6CA85" opacity="0.7" />
    </g>

    {/* Sparkles and floating golden dust */}
    <path d="M 250 62 Q 250 67, 255 67 Q 250 67, 250 72 Q 250 67, 245 67 Q 250 67, 250 62" fill="#C7A66A" />
    <path d="M 90 98 Q 90 102, 94 102 Q 90 102, 90 106 Q 90 102, 86 102 Q 90 102, 90 98" fill="#E6CA85" />
    <circle cx="170" cy="48" r="1.5" fill="#C7A66A" />
    <circle cx="128" cy="120" r="1.3" fill="#D99AA5" />
    <circle cx="225" cy="140" r="1.3" fill="#C7A66A" />
  </svg>
);

/**
 * Card 03 — Your Beautiful Smile ♡
 * Elegant smile-inspired illustration with soft blush flowers, tiny hearts, and warm joyful appearance.
 */
export const SmileIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40 sm:h-44' }) => (
  <svg
    viewBox="0 0 340 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="smileSunburst" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF4D6" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#F8DCE5" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="smileCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D99AA5" />
        <stop offset="50%" stopColor="#A64D68" />
        <stop offset="100%" stopColor="#D99AA5" />
      </linearGradient>
    </defs>

    {/* Radiant Warm Sunset Glow */}
    <ellipse cx="170" cy="100" rx="140" ry="75" fill="url(#smileSunburst)" />

    {/* Subtle Sunray Lines */}
    <g stroke="#C7A66A" strokeWidth="0.8" opacity="0.35" strokeDasharray="3 3">
      <line x1="170" y1="38" x2="170" y2="16" />
      <line x1="132" y1="48" x2="116" y2="30" />
      <line x1="208" y1="48" x2="224" y2="30" />
      <line x1="100" y1="75" x2="80" y2="64" />
      <line x1="240" y1="75" x2="260" y2="64" />
    </g>

    {/* Joyful Gentle Smile Contour */}
    <g transform="translate(170, 100)">
      {/* Upper lip curve */}
      <path
        d="M -52 -6 C -28 4, -9 0, 0 3 C 9 0, 28 4, 52 -6"
        stroke="#A64D68"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
      {/* Warm gentle crescent smile */}
      <path
        d="M -52 -6 C -34 28, 34 28, 52 -6 C 32 20, -32 20, -52 -6 Z"
        fill="#FFF9FA"
        stroke="url(#smileCurveGrad)"
        strokeWidth="2"
      />
      {/* Delicate dimple curves */}
      <path d="M -58 -10 C -57 -4, -54 0, -50 2" stroke="#D99AA5" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M 58 -10 C 57 -4, 54 0, 50 2" stroke="#D99AA5" strokeWidth="1.3" strokeLinecap="round" />
    </g>

    {/* Surrounding Blush-Pink Flowers & Botanical Accents */}
    {/* Left Blooming Flower */}
    <g transform="translate(90, 100)">
      <circle cx="0" cy="0" r="15" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <circle cx="-8" cy="-5" r="6.5" fill="#F8DCE5" fillOpacity="0.75" />
      <circle cx="8" cy="-5" r="6.5" fill="#F8DCE5" fillOpacity="0.75" />
      <circle cx="0" cy="8" r="6.5" fill="#F8DCE5" fillOpacity="0.75" />
      <circle cx="0" cy="0" r="4.5" fill="#C7A66A" />
      <path d="M -13 11 C -19 17, -15 25, -7 21 Z" fill="#D99AA5" opacity="0.5" />
    </g>

    {/* Right Blooming Flower */}
    <g transform="translate(250, 100)">
      <circle cx="0" cy="0" r="15" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <circle cx="-8" cy="-5" r="6.5" fill="#F8DCE5" fillOpacity="0.75" />
      <circle cx="8" cy="-5" r="6.5" fill="#F8DCE5" fillOpacity="0.75" />
      <circle cx="0" cy="8" r="6.5" fill="#F8DCE5" fillOpacity="0.75" />
      <circle cx="0" cy="0" r="4.5" fill="#C7A66A" />
      <path d="M 13 11 C 19 17, 15 25, 7 21 Z" fill="#D99AA5" opacity="0.5" />
    </g>

    {/* Tiny floating hearts & sparkling warmth */}
    <path
      d="M 132 58 C 129 53, 123 53, 121 57 C 119 53, 113 53, 110 57 C 107 61, 110 67, 121 73 C 132 67, 135 61, 132 58 Z"
      fill="#A64D68"
      opacity="0.85"
    />
    <path
      d="M 228 58 C 225 53, 219 53, 217 57 C 215 53, 209 53, 206 57 C 203 61, 206 67, 217 73 C 228 67, 231 61, 228 58 Z"
      fill="#A64D68"
      opacity="0.85"
    />
    <path
      d="M 173 44 C 171 40, 167 40, 165 43 C 163 40, 159 40, 157 43 C 155 46, 157 51, 165 56 C 173 51, 175 46, 173 44 Z"
      fill="#D99AA5"
      opacity="0.9"
    />

    {/* Golden sparkles */}
    <g transform="translate(170, 72)">
      <path d="M 0 -6 Q 0 0, 6 0 Q 0 0, 0 6 Q 0 0, -6 0 Q 0 0, 0 -6" fill="#C7A66A" />
    </g>
    <circle cx="106" cy="145" r="2" fill="#E6CA85" />
    <circle cx="234" cy="145" r="2" fill="#E6CA85" />
    <circle cx="170" cy="150" r="1.6" fill="#D99AA5" />
  </svg>
);

/**
 * Card 04 — The Way You Talk ♡
 * Handwritten speech bubbles with subtle flourishes.
 */
export const TalkIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="160" cy="90" rx="110" ry="60" fill="#FFF8FA" opacity="0.7" />

    {/* Main Speech Bubble */}
    <g transform="translate(110, 75)">
      <rect x="-60" y="-35" width="120" height="60" rx="18" fill="#FFFDF8" stroke="#D99AA5" strokeWidth="1.5" />
      <path d="M 20 25 L 35 45 L 5 25 Z" fill="#FFFDF8" stroke="#D99AA5" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="6" y="23" width="15" height="3" fill="#FFFDF8" />
      <path d="M -40 -12 C -20 -15, 0 -10, 35 -12" stroke="#5A3545" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M -40 2 C -15 -1, 10 5, 40 2" stroke="#5A3545" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M -40 16 C -25 18, -10 14, 15 16" stroke="#C7A66A" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="36" cy="15" r="2" fill="#A64D68" />
    </g>

    {/* Response Speech Bubble */}
    <g transform="translate(210, 110)">
      <rect x="-45" y="-25" width="90" height="46" rx="14" fill="#F8DCE5" fillOpacity="0.8" stroke="#C7A66A" strokeWidth="1.2" />
      <path d="M -15 21 L -25 35 L -3 21 Z" fill="#F8DCE5" stroke="#C7A66A" strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="-14" y="19" width="12" height="3" fill="#F8DCE5" />
      <path d="M -30 -6 C -10 -10, 10 -2, 25 -6" stroke="#A64D68" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M -30 6 C -15 8, 5 4, 20 6" stroke="#A64D68" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* Melodic & Sparkle accents */}
    <g transform="translate(65, 55)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#C7A66A" />
    </g>
    <g transform="translate(265, 65)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#E6CA85" />
    </g>
    <circle cx="160" cy="40" r="2" fill="#D99AA5" />
  </svg>
);

/**
 * Card 05 — Your Kind Heart ♡
 * Heart held gently in two hands, surrounded by soft flower petals and warm light.
 */
export const KindHeartIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="handsAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#F8DCE5" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
      </radialGradient>
    </defs>

    <ellipse cx="160" cy="90" rx="115" ry="65" fill="url(#handsAura)" />

    {/* Radiant glowing heart floating between hands */}
    <g transform="translate(160, 72)">
      {/* Outer Heart Halo */}
      <path
        d="M 0 32 C -28 14, -48 -8, -32 -30 C -16 -46, 0 -30, 0 -18 C 0 -30, 16 -46, 32 -30 C 48 -8, 28 14, 0 32 Z"
        fill="#F8DCE5"
        stroke="#C7A66A"
        strokeWidth="1.2"
      />
      {/* Inner Pink Heart */}
      <path
        d="M 0 24 C -22 10, -38 -6, -25 -22 C -12 -34, 0 -22, 0 -12 C 0 -22, 12 -34, 25 -22 C 38 -6, 22 10, 0 24 Z"
        fill="#A64D68"
      />
      {/* Highlight catchlight */}
      <circle cx="-6" cy="-14" r="3" fill="#FFFFFF" opacity="0.8" />
    </g>

    {/* TWO DELICATE HANDS CUPPING THE HEART */}
    {/* Left Gentle Hand */}
    <g transform="translate(118, 120)">
      {/* Palm & Wrist */}
      <path
        d="M -30 25 C -15 20, 0 15, 15 5 C 28 -5, 38 -15, 42 -25 C 44 -28, 42 -32, 38 -30 C 32 -26, 22 -16, 12 -8 C 2 -2, -12 8, -25 15 Z"
        fill="#FFFDFB"
        stroke="#D99AA5"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Fingers cupping upward */}
      <path
        d="M 15 5 C 25 -2, 36 -12, 40 -20"
        stroke="#A64D68"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 8 10 C 18 3, 28 -6, 32 -14"
        stroke="#C7A66A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>

    {/* Right Gentle Hand */}
    <g transform="translate(202, 120)">
      {/* Palm & Wrist */}
      <path
        d="M 30 25 C 15 20, 0 15, -15 5 C -28 -5, -38 -15, -42 -25 C -44 -28, -42 -32, -38 -30 C -32 -26, -22 -16, -12 -8 C -2 -2, 12 8, 25 15 Z"
        fill="#FFFDFB"
        stroke="#D99AA5"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Fingers cupping upward */}
      <path
        d="M -15 5 C -25 -2, -36 -12, -40 -20"
        stroke="#A64D68"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M -8 10 C -18 3, -28 -6, -32 -14"
        stroke="#C7A66A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>

    {/* Floating rose petals and golden sparkles */}
    <g transform="translate(90, 60)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#C7A66A" />
    </g>
    <g transform="translate(230, 60)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#E6CA85" />
    </g>
    <circle cx="160" cy="148" r="2" fill="#D99AA5" />
    <circle cx="130" cy="45" r="1.5" fill="#E6CA85" />
    <circle cx="190" cy="45" r="1.5" fill="#E6CA85" />
  </svg>
);

/**
 * Card 06 — Your Personality ♡
 * Delicate floral arrangement with wild blossoms and golden details.
 */
export const PersonalityIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="160" cy="90" rx="100" ry="55" fill="#FFFDF8" stroke="#F8DCE5" strokeWidth="1" />

    {/* Center Wildflower Bouquet */}
    <g transform="translate(160, 95)">
      <path d="M 0 50 C -5 20, -15 0, -20 -20" stroke="#C7A66A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 0 50 C 0 20, 0 0, 0 -35" stroke="#C7A66A" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 0 50 C 5 20, 15 0, 22 -18" stroke="#C7A66A" strokeWidth="1.2" strokeLinecap="round" />

      {/* Stem Ribbon Tie */}
      <path d="M -10 32 C 0 35, 0 35, 10 32" stroke="#A64D68" strokeWidth="2" strokeLinecap="round" />
      <circle cx="0" cy="33" r="3" fill="#D99AA5" />

      {/* Main Center Blossom */}
      <g transform="translate(0, -35)">
        <circle cx="0" cy="0" r="14" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
        <path d="M 0 -14 C -6 -20, 6 -20, 0 -14 Z" fill="#F8DCE5" />
        <path d="M 14 0 C 20 -6, 20 6, 14 0 Z" fill="#F8DCE5" />
        <path d="M 0 14 C -6 20, 6 20, 0 14 Z" fill="#F8DCE5" />
        <path d="M -14 0 C -20 -6, -20 6, -14 0 Z" fill="#F8DCE5" />
        <circle cx="0" cy="0" r="5" fill="#C7A66A" />
      </g>

      <g transform="translate(-22, -20)">
        <circle cx="0" cy="0" r="10" fill="#F8DCE5" stroke="#D99AA5" strokeWidth="1" />
        <circle cx="0" cy="0" r="3.5" fill="#A64D68" />
      </g>

      <g transform="translate(24, -18)">
        <circle cx="0" cy="0" r="11" fill="#FFF9E6" stroke="#C7A66A" strokeWidth="1" />
        <circle cx="0" cy="0" r="4" fill="#D99AA5" />
      </g>
    </g>

    <g transform="translate(100, 50)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#C7A66A" />
    </g>
    <g transform="translate(220, 50)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#E6CA85" />
    </g>
    <circle cx="160" cy="30" r="1.5" fill="#A64D68" />
  </svg>
);

/**
 * Card 07 — Your Little Habits ♡
 * Charming teacup and little everyday details (teacup with heart steam & ribbon bookmark).
 */
export const HabitsIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="160" cy="90" rx="100" ry="55" fill="#FFFDF8" opacity="0.6" />

    {/* Vintage Teacup and Saucer */}
    <g transform="translate(138, 105)">
      {/* Saucer */}
      <ellipse cx="0" cy="18" rx="38" ry="6" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1.2" />
      <ellipse cx="0" cy="17" rx="26" ry="3.5" stroke="#C7A66A" strokeWidth="0.8" opacity="0.6" />

      {/* Cup Body */}
      <path
        d="M -24 -6 C -24 14, 24 14, 24 -6 Z"
        fill="#FFFDFB"
        stroke="#D99AA5"
        strokeWidth="1.5"
      />
      {/* Cup Rim */}
      <ellipse cx="0" cy="-6" rx="24" ry="4" fill="#F8DCE5" stroke="#D99AA5" strokeWidth="1.2" />
      <ellipse cx="0" cy="-6" rx="20" ry="2.8" fill="#8B5A2B" fillOpacity="0.75" />

      {/* Cup Handle */}
      <path
        d="M 22 -3 C 34 -3, 34 10, 20 10"
        stroke="#D99AA5"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rising Steam forming a Heart */}
      <path
        d="M -4 -16 C -8 -26, -14 -32, -8 -40 C -4 -45, 0 -38, 0 -30 C 0 -38, 4 -45, 8 -40 C 14 -32, 8 -26, 4 -16"
        stroke="#C7A66A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="2 2"
        opacity="0.85"
      />
    </g>

    {/* Miniature Pocket Watch & Bookmark Ribbon */}
    <g transform="translate(206, 112)">
      <path d="M 0 -15 L 0 15 L 6 9 L 12 15 L 12 -15 Z" fill="#D99AA5" stroke="#C7A66A" strokeWidth="0.8" />
      <circle cx="-12" cy="5" r="9" fill="#FFFDF8" stroke="#C7A66A" strokeWidth="1.2" />
      <circle cx="-12" cy="5" r="1.5" fill="#5A3545" />
      <line x1="-12" y1="5" x2="-12" y2="1" stroke="#5A3545" strokeWidth="1" strokeLinecap="round" />
      <line x1="-12" y1="5" x2="-9" y2="5" stroke="#5A3545" strokeWidth="1" strokeLinecap="round" />
    </g>

    <g transform="translate(100, 60)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#C7A66A" />
    </g>
    <circle cx="230" cy="70" r="1.8" fill="#E6CA85" />
  </svg>
);

/**
 * Card 08 — Your Laughter ♡
 * Sparkling stars and radiant bursts of joy.
 */
export const LaughterIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="laughGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#F8DCE5" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
      </radialGradient>
    </defs>

    <ellipse cx="160" cy="90" rx="120" ry="65" fill="url(#laughGlow)" />

    {/* Radiant Starburst in Center */}
    <g transform="translate(160, 90)">
      <path
        d="M 0 -35 Q 0 0, 35 0 Q 0 0, 0 35 Q 0 0, -35 0 Q 0 0, 0 -35"
        fill="#C7A66A"
      />
      <circle cx="0" cy="0" r="7" fill="#FFFFFF" />

      <path
        d="M -18 -18 Q 0 0, 18 18 M -18 18 Q 0 0, 18 -18"
        stroke="#E6CA85"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="0" cy="0" r="22" stroke="#D99AA5" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
    </g>

    <g transform="translate(100, 60)">
      <path d="M 0 -8 Q 0 0, 8 0 Q 0 0, 0 8 Q 0 0, -8 0 Q 0 0, 0 -8" fill="#E6CA85" />
    </g>
    <g transform="translate(220, 60)">
      <path d="M 0 -8 Q 0 0, 8 0 Q 0 0, 0 8 Q 0 0, -8 0 Q 0 0, 0 -8" fill="#E6CA85" />
    </g>
    <g transform="translate(80, 120)">
      <path d="M 0 -6 Q 0 0, 6 0 Q 0 0, 0 6 Q 0 0, -6 0 Q 0 0, 0 -6" fill="#D99AA5" />
    </g>
    <g transform="translate(240, 120)">
      <path d="M 0 -6 Q 0 0, 6 0 Q 0 0, 0 6 Q 0 0, -6 0 Q 0 0, 0 -6" fill="#D99AA5" />
    </g>
    <circle cx="160" cy="40" r="2" fill="#A64D68" />
    <circle cx="160" cy="140" r="2" fill="#A64D68" />
  </svg>
);

/**
 * Card 09 — Your Strength ♡
 * Blooming flowers: resilient wild rose on an upright stem with morning dew.
 */
export const StrengthIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="160" cy="90" rx="105" ry="60" fill="#FFFDF8" opacity="0.6" />

    {/* Resilient Wild Rose in full bloom */}
    <g transform="translate(160, 95)">
      <path
        d="M 0 55 C 2 30, -4 5, 0 -20"
        stroke="#5A3545"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M 0 35 C 10 32, 14 26, 12 24 C 6 24, 2 28, 0 35 Z" fill="#D99AA5" stroke="#C7A66A" strokeWidth="0.8" />
      <path d="M 0 10 C -12 7, -16 1, -14 -1 C -8 -1, -3 4, 0 10 Z" fill="#D99AA5" stroke="#C7A66A" strokeWidth="0.8" />

      <g transform="translate(0, -22)">
        <path
          d="M -18 0 C -22 -14, -10 -22, 0 -16 C 10 -22, 22 -14, 18 0 C 14 14, -14 14, -18 0 Z"
          fill="#F8DCE5"
          stroke="#D99AA5"
          strokeWidth="1.2"
        />
        <circle cx="0" cy="-2" r="9" fill="#FFF5F8" stroke="#A64D68" strokeWidth="1" />
        <path d="M -4 -3 C -2 -7, 2 -7, 4 -3 C 2 1, -2 1, -4 -3 Z" fill="#A64D68" />
        <circle cx="7" cy="-7" r="2" fill="#E6CA85" />
      </g>
    </g>

    <path d="M 100 130 C 95 65, 225 65, 220 130" stroke="#C7A66A" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" fill="none" />
    <g transform="translate(160, 50)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#C7A66A" />
    </g>
  </svg>
);

/**
 * Card 10 — Your Dreams ♡
 * Moon, stars, and soft clouds.
 */
export const DreamsIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF6DF" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#F8DCE5" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
      </radialGradient>
    </defs>

    <ellipse cx="160" cy="90" rx="120" ry="65" fill="url(#moonGlow)" />

    {/* Slender Golden Crescent Moon */}
    <g transform="translate(150, 75)">
      <path
        d="M 15 -35 C -15 -30, -30 5, -10 35 C -3 43, 6 45, 12 43 C -10 25, -6 -15, 15 -35 Z"
        fill="#E6CA85"
        stroke="#C7A66A"
        strokeWidth="1.2"
      />
      <line x1="12" y1="-30" x2="16" y2="-15" stroke="#C7A66A" strokeWidth="0.8" strokeDasharray="1 2" />
      <path d="M 16 -18 Q 16 -15, 19 -15 Q 16 -15, 16 -12 Q 16 -15, 13 -15 Q 16 -15, 16 -18" fill="#A64D68" />
    </g>

    {/* Soft Dreamy Clouds */}
    <g transform="translate(160, 115)">
      <ellipse cx="-25" cy="0" rx="30" ry="14" fill="#FFFDF8" stroke="#D99AA5" strokeWidth="1" />
      <ellipse cx="25" cy="0" rx="32" ry="14" fill="#FFFDF8" stroke="#D99AA5" strokeWidth="1" />
      <ellipse cx="0" cy="-6" rx="24" ry="16" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <ellipse cx="0" cy="0" rx="22" ry="12" fill="#FFF5F8" />
    </g>

    <g transform="translate(85, 65)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#C7A66A" />
    </g>
    <g transform="translate(235, 65)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#C7A66A" />
    </g>
    <circle cx="110" cy="100" r="1.5" fill="#E6CA85" />
    <circle cx="215" cy="100" r="1.5" fill="#E6CA85" />
  </svg>
);

/**
 * Card 11 — Your Playful Side ♡
 * Delicate butterflies with lighthearted flight paths.
 */
export const PlayfulIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="160" cy="90" rx="100" ry="55" fill="#FFF8FA" opacity="0.6" />

    {/* Dotted Whimsical Flight Spiral */}
    <path
      d="M 90 120 C 110 80, 130 140, 160 90 C 180 55, 210 115, 230 75"
      stroke="#C7A66A"
      strokeWidth="1.2"
      strokeDasharray="2 3"
      fill="none"
    />

    {/* Butterfly 1 */}
    <g transform="translate(135, 90) rotate(-15)">
      <path d="M 0 0 C -12 -18, -25 -10, -15 2 C -24 6, -16 16, 0 2 Z" fill="#F8DCE5" stroke="#D99AA5" strokeWidth="1" />
      <path d="M 0 0 C 12 -18, 25 -10, 15 2 C 24 6, 16 16, 0 2 Z" fill="#F8DCE5" stroke="#D99AA5" strokeWidth="1" />
      <circle cx="-10" cy="-6" r="2.5" fill="#C7A66A" />
      <circle cx="10" cy="-6" r="2.5" fill="#C7A66A" />
      <line x1="0" y1="-8" x2="0" y2="8" stroke="#5A3545" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="0" cy="-9" r="1.5" fill="#5A3545" />
    </g>

    {/* Butterfly 2 */}
    <g transform="translate(225, 70) rotate(20)">
      <path d="M 0 0 C -9 -14, -20 -8, -12 1 C -18 4, -12 12, 0 2 Z" fill="#FFF5F8" stroke="#C7A66A" strokeWidth="1" />
      <path d="M 0 0 C 9 -14, 20 -8, 12 1 C 18 4, 12 12, 0 2 Z" fill="#FFF5F8" stroke="#C7A66A" strokeWidth="1" />
      <circle cx="-6" cy="-4" r="1.8" fill="#A64D68" />
      <circle cx="6" cy="-4" r="1.8" fill="#A64D68" />
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#5A3545" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    <path d="M 185 70 C 183 67, 180 67, 178 69 C 176 67, 173 67, 171 69 C 170 71, 171 75, 178 79 C 185 75, 186 71, 185 70 Z" fill="#A64D68" />
    <path d="M 105 105 C 104 103, 102 103, 101 104 C 100 103, 98 103, 97 104 C 96 105, 97 108, 101 111 C 105 108, 106 105, 105 105 Z" fill="#D99AA5" />

    <g transform="translate(75, 80)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#C7A66A" />
    </g>
    <circle cx="260" cy="110" r="2" fill="#E6CA85" />
  </svg>
);

/**
 * Card 12 — The Way You Care ♡
 * Soft pink flowers gently blossoming towards each other in care.
 */
export const CareIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="160" cy="90" rx="100" ry="55" fill="#FFFDF8" opacity="0.6" />

    {/* Two Intertwining Delicate Soft Pink Flowers */}
    <g transform="translate(160, 95)">
      <path
        d="M -20 50 C -20 20, 0 10, -4 -15"
        stroke="#C7A66A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 20 50 C 20 20, 0 10, 4 -15"
        stroke="#C7A66A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path d="M -8 18 C -2 12, 10 14, 8 22 C 2 26, -6 24, -8 18 Z" fill="#F8DCE5" stroke="#D99AA5" strokeWidth="0.8" />
      <path d="M 8 10 C 2 4, -10 6, -8 14 C -2 18, 6 16, 8 10 Z" fill="#F8DCE5" stroke="#D99AA5" strokeWidth="0.8" />

      {/* Flower 1 (Soft Pink Rosebud) */}
      <g transform="translate(-6, -18)">
        <circle cx="0" cy="0" r="12" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
        <circle cx="0" cy="0" r="4.5" fill="#A64D68" />
      </g>

      {/* Flower 2 (Soft Pink Rosebud) */}
      <g transform="translate(6, -18)">
        <circle cx="0" cy="0" r="12" fill="#F8DCE5" stroke="#C7A66A" strokeWidth="1" />
        <circle cx="0" cy="0" r="4.5" fill="#D99AA5" />
      </g>
    </g>

    <circle cx="160" cy="77" r="28" stroke="#C7A66A" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

    <g transform="translate(90, 75)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#E6CA85" />
    </g>
    <g transform="translate(230, 75)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#E6CA85" />
    </g>
    <circle cx="160" cy="38" r="2" fill="#D99AA5" />
  </svg>
);

/**
 * Card 13 — Your Beautiful Mind ♡
 * Books, glasses, and flowers.
 */
export const MindIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-36' }) => (
  <svg
    viewBox="0 0 320 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <ellipse cx="160" cy="90" rx="110" ry="60" fill="#FFFDF8" opacity="0.6" />

    {/* Vintage Open Book */}
    <g transform="translate(160, 115)">
      <path d="M -48 15 Q 0 20, 48 15" stroke="#5A3545" strokeWidth="2.5" strokeLinecap="round" />

      {/* Left Page */}
      <path
        d="M 0 10 Q -24 6, -48 10 L -48 -20 Q -24 -24, 0 -18 Z"
        fill="#FFFDFB"
        stroke="#D99AA5"
        strokeWidth="1.2"
      />
      {/* Right Page */}
      <path
        d="M 0 10 Q 24 6, 48 10 L 48 -20 Q 24 -24, 0 -18 Z"
        fill="#FFFDFB"
        stroke="#D99AA5"
        strokeWidth="1.2"
      />
      <line x1="0" y1="-18" x2="0" y2="10" stroke="#C7A66A" strokeWidth="1.2" />

      {/* Script Lines on Pages */}
      <line x1="-38" y1="-12" x2="-8" y2="-10" stroke="#5A3545" strokeWidth="0.8" opacity="0.6" />
      <line x1="-38" y1="-4" x2="-8" y2="-2" stroke="#5A3545" strokeWidth="0.8" opacity="0.6" />
      <line x1="-38" y1="4" x2="-14" y2="6" stroke="#5A3545" strokeWidth="0.8" opacity="0.6" />

      <line x1="8" y1="-10" x2="38" y2="-12" stroke="#5A3545" strokeWidth="0.8" opacity="0.6" />
      <line x1="8" y1="-2" x2="38" y2="-4" stroke="#5A3545" strokeWidth="0.8" opacity="0.6" />
      <line x1="14" y1="6" x2="38" y2="4" stroke="#5A3545" strokeWidth="0.8" opacity="0.6" />
    </g>

    {/* =================================================================== */}
    {/* VINTAGE WIRE-RIMMED READING GLASSES RESTING ON THE BOOK */}
    {/* =================================================================== */}
    <g transform="translate(160, 110)">
      {/* Bridge connecting rims */}
      <path d="M -7 -4 Q 0 -8, 7 -4" stroke="#C7A66A" strokeWidth="1.4" fill="none" />
      {/* Left Lens Rim */}
      <circle cx="-16" cy="-2" r="11" stroke="#C7A66A" strokeWidth="1.4" fill="#FFFFFF" fillOpacity="0.4" />
      {/* Right Lens Rim */}
      <circle cx="16" cy="-2" r="11" stroke="#C7A66A" strokeWidth="1.4" fill="#FFFFFF" fillOpacity="0.4" />
      {/* Left Temple folding back */}
      <path d="M -27 -4 L -38 -12" stroke="#C7A66A" strokeWidth="1.2" strokeLinecap="round" />
      {/* Right Temple folding back */}
      <path d="M 27 -4 L 38 -12" stroke="#C7A66A" strokeWidth="1.2" strokeLinecap="round" />
      {/* Lens reflection glint */}
      <line x1="-20" y1="-7" x2="-12" y2="3" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
      <line x1="12" y1="-7" x2="20" y2="3" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
    </g>

    {/* Blossoming Flowers and Starlight Emerging Upward */}
    <g transform="translate(160, 65)">
      {/* Center Botanical Branch */}
      <path d="M 0 25 C -2 5, -5 -12, 0 -30" stroke="#C7A66A" strokeWidth="1.2" strokeLinecap="round" />
      {/* Top Rose Petals */}
      <circle cx="0" cy="-30" r="7" fill="#F8DCE5" stroke="#A64D68" strokeWidth="0.8" />
      <circle cx="0" cy="-30" r="2.5" fill="#A64D68" />

      {/* Left Sprout */}
      <path d="M 0 25 C -15 8, -25 -2, -28 -18" stroke="#C7A66A" strokeWidth="1" strokeLinecap="round" />
      <circle cx="-28" cy="-18" r="4" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="0.8" />
      <circle cx="-28" cy="-18" r="1.5" fill="#E6CA85" />

      {/* Right Sprout */}
      <path d="M 0 25 C 15 8, 25 -2, 28 -18" stroke="#C7A66A" strokeWidth="1" strokeLinecap="round" />
      <circle cx="28" cy="-18" r="4" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="0.8" />
      <circle cx="28" cy="-18" r="1.5" fill="#E6CA85" />
    </g>

    {/* Starlight constellation above the open book */}
    <g transform="translate(160, 24)">
      <path d="M 0 -6 Q 0 0, 6 0 Q 0 0, 0 6 Q 0 0, -6 0 Q 0 0, 0 -6" fill="#C7A66A" />
      <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
    </g>
    <g transform="translate(95, 42)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#E6CA85" />
    </g>
    <g transform="translate(225, 42)">
      <path d="M 0 -4 Q 0 0, 4 0 Q 0 0, 0 4 Q 0 0, -4 0 Q 0 0, 0 -4" fill="#E6CA85" />
    </g>
  </svg>
);

/**
 * Card 14 — Simply Ekta ♡ (Grand Finale Centerpiece)
 * Special larger scrapbook card illustration with elegant rose-and-ribbon composition,
 * delicate floral frame, champagne-gold heart illustration, and radiant aura.
 */
export const SimplyEktaIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-48 sm:h-56' }) => (
  <svg
    viewBox="0 0 420 210"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto select-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="heartCenterGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#F8DCE5" stopOpacity="0.8" />
        <stop offset="75%" stopColor="#D99AA5" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#FFFDF8" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C7A66A" />
        <stop offset="50%" stopColor="#E6CA85" />
        <stop offset="100%" stopColor="#C7A66A" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A64D68" />
        <stop offset="50%" stopColor="#D99AA5" />
        <stop offset="100%" stopColor="#8E3E56" />
      </linearGradient>
    </defs>

    {/* Radiant Center Glow */}
    <ellipse cx="210" cy="105" rx="170" ry="90" fill="url(#heartCenterGlow)" />

    {/* DELICATE ORNATE FLORAL FRAME & CORNER FILIGREE */}
    <g stroke="url(#goldFiligree)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.85">
      <path d="M 95 42 C 150 22, 270 22, 325 42" />
      <path d="M 95 168 C 150 188, 270 188, 325 168" />
      <path d="M 65 74 C 48 105, 48 105, 65 136" />
      <path d="M 355 74 C 372 105, 372 105, 355 136" />

      {/* Corner scrollwork */}
      <path d="M 80 50 C 70 44, 65 54, 73 58" />
      <path d="M 340 50 C 350 44, 355 54, 347 58" />
      <path d="M 80 160 C 70 166, 65 156, 73 152" />
      <path d="M 340 160 C 350 166, 355 156, 347 152" />
    </g>

    {/* ROSES AND SATIN RIBBON COMPOSITION AROUND FRAME */}
    {/* Top Left Rose + Ribbon Bow */}
    <g transform="translate(85, 44)">
      <circle cx="0" cy="0" r="11" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <circle cx="0" cy="0" r="4.5" fill="#A64D68" />
      <path d="M -7 7 C -14 12, -16 6, -9 4 Z" fill="#D99AA5" opacity="0.6" />
      {/* Flowing Ribbon Loop */}
      <path d="M 6 -2 C 16 -10, 24 -2, 12 4 Z" fill="url(#ribbonGrad)" opacity="0.75" />
    </g>

    {/* Top Right Rose + Ribbon Bow */}
    <g transform="translate(335, 44)">
      <circle cx="0" cy="0" r="11" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <circle cx="0" cy="0" r="4.5" fill="#A64D68" />
      <path d="M 7 7 C 14 12, 16 6, 9 4 Z" fill="#D99AA5" opacity="0.6" />
      <path d="M -6 -2 C -16 -10, -24 -2, -12 4 Z" fill="url(#ribbonGrad)" opacity="0.75" />
    </g>

    {/* Bottom Left Rose */}
    <g transform="translate(85, 166)">
      <circle cx="0" cy="0" r="11" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <circle cx="0" cy="0" r="4.5" fill="#A64D68" />
      <path d="M -7 -7 C -14 -12, -16 -6, -9 -4 Z" fill="#D99AA5" opacity="0.6" />
      {/* Ribbon streamer */}
      <path d="M 4 4 C 12 12, 18 20, 24 16" stroke="#A64D68" strokeWidth="1.4" strokeLinecap="round" />
    </g>

    {/* Bottom Right Rose */}
    <g transform="translate(335, 166)">
      <circle cx="0" cy="0" r="11" fill="#FFF5F8" stroke="#D99AA5" strokeWidth="1" />
      <circle cx="0" cy="0" r="4.5" fill="#A64D68" />
      <path d="M 7 -7 C 14 -12, 16 -6, 9 -4 Z" fill="#D99AA5" opacity="0.6" />
      {/* Ribbon streamer */}
      <path d="M -4 4 C -12 12, -18 20, -24 16" stroke="#A64D68" strokeWidth="1.4" strokeLinecap="round" />
    </g>

    {/* =================================================================== */}
    {/* CHAMPAGNE-GOLD AND RADIANT BURGUNDY HEART ILLUSTRATION */}
    {/* =================================================================== */}
    <g transform="translate(210, 102)">
      {/* Outer Champagne-Gold Filigree Heart Halo */}
      <path
        d="M 0 50 C -48 22, -82 -14, -55 -48 C -27 -74, 0 -48, 0 -27 C 0 -48, 27 -74, 55 -48 C 82 -14, 48 22, 0 50 Z"
        fill="#F8DCE5"
        stroke="#C7A66A"
        strokeWidth="1.8"
      />

      {/* Radiant Inner Heart */}
      <path
        d="M 0 40 C -40 18, -68 -10, -46 -38 C -23 -60, 0 -38, 0 -22 C 0 -38, 23 -60, 46 -38 C 68 -10, 40 18, 0 40 Z"
        fill="#4A1D2B"
      />

      {/* Golden Heart Core Detail */}
      <path
        d="M 0 26 C -25 10, -42 -6, -28 -24 C -14 -38, 0 -24, 0 -14 C 0 -24, 14 -38, 28 -24 C 42 -6, 25 10, 0 26 Z"
        fill="#C77D91"
        stroke="#E6CA85"
        strokeWidth="1.2"
      />

      {/* Sparkling catchlight */}
      <circle cx="-11" cy="-22" r="4.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="7" cy="-15" r="2.2" fill="#FFF9E6" />
    </g>

    {/* Golden Stars & Floating Stardust */}
    <g transform="translate(210, 32)">
      <path d="M 0 -9 Q 0 0, 9 0 Q 0 0, 0 9 Q 0 0, -9 0 Q 0 0, 0 -9" fill="#C7A66A" />
      <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
    </g>
    <g transform="translate(140, 102)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#E6CA85" />
    </g>
    <g transform="translate(280, 102)">
      <path d="M 0 -5 Q 0 0, 5 0 Q 0 0, 0 5 Q 0 0, -5 0 Q 0 0, 0 -5" fill="#E6CA85" />
    </g>
    <circle cx="175" cy="52" r="1.8" fill="#D99AA5" />
    <circle cx="245" cy="52" r="1.8" fill="#D99AA5" />
    <circle cx="175" cy="152" r="1.8" fill="#D99AA5" />
    <circle cx="245" cy="152" r="1.8" fill="#D99AA5" />
  </svg>
);

/**
 * Helper to render illustration by iconType or fallback
 */
export const renderScrapbookIllustration = (iconType: string, className?: string) => {
  switch (iconType) {
    case 'eyes':
      return <EyesIllustration className={className} />;
    case 'hair':
      return <HairIllustration className={className} />;
    case 'smile':
      return <SmileIllustration className={className} />;
    case 'speech':
      return <TalkIllustration className={className} />;
    case 'kindness':
      return <KindHeartIllustration className={className} />;
    case 'personality':
      return <PersonalityIllustration className={className} />;
    case 'habits':
      return <HabitsIllustration className={className} />;
    case 'laughter':
      return <LaughterIllustration className={className} />;
    case 'strength':
      return <StrengthIllustration className={className} />;
    case 'dreams':
      return <DreamsIllustration className={className} />;
    case 'playful':
      return <PlayfulIllustration className={className} />;
    case 'care':
      return <CareIllustration className={className} />;
    case 'mind':
      return <MindIllustration className={className} />;
    case 'simply-ekta':
      return <SimplyEktaIllustration className={className} />;
    default:
      return <KindHeartIllustration className={className} />;
  }
};
