import confetti from 'canvas-confetti';

const ROMANTIC_COLORS = [
  '#A64D68', // Deep Rose
  '#C96B85', // Soft Rose Pink
  '#F8DCE5', // Blush Pink
  '#D1496D', // Crimson Rose
  '#E6A055', // Shimmer Gold
  '#F3C68F', // Champagne Gold
  '#FFF8ED', // Warm Cream
  '#FFCCD8', // Light Blush
  '#8E3E56', // Raspberry
];

/**
 * Triggers a multi-stage celebratory fireworks & heart confetti blast
 * across the viewport for Ekta when she clicks 'Yes' or sends her proposal response.
 */
export function fireProposalConfetti() {
  const heartPath =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  let heartShape: any = 'circle';
  try {
    if (typeof (confetti as any).shapeFromPath === 'function') {
      heartShape = (confetti as any).shapeFromPath({ path: heartPath });
    }
  } catch {
    heartShape = 'circle';
  }

  // Stage 1: Immediate Center Burst Explosion
  confetti({
    particleCount: 90,
    spread: 110,
    origin: { y: 0.55, x: 0.5 },
    colors: ROMANTIC_COLORS,
    shapes: [heartShape, 'circle'],
    scalar: 1.4,
    ticks: 240,
    gravity: 0.85,
  });

  // Stage 2: Synchronized Left & Right celebratory cannons
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 75,
      origin: { x: 0.05, y: 0.75 },
      colors: ROMANTIC_COLORS,
      shapes: [heartShape, 'circle'],
      scalar: 1.25,
      ticks: 240,
      gravity: 0.8,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 75,
      origin: { x: 0.95, y: 0.75 },
      colors: ROMANTIC_COLORS,
      shapes: [heartShape, 'circle'],
      scalar: 1.25,
      ticks: 240,
      gravity: 0.8,
    });
  }, 220);

  // Stage 3: Gentle romantic raining shimmer for 3 seconds
  const end = Date.now() + 3000;
  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 16,
      startVelocity: 25,
      spread: 360,
      ticks: 180,
      origin: {
        x: Math.random() * 0.8 + 0.1,
        y: Math.random() * 0.4 + 0.1,
      },
      colors: ROMANTIC_COLORS,
      shapes: [heartShape, 'circle'],
      scalar: 1.15,
      gravity: 0.6,
    });
  }, 220);
}

/**
 * Triggers a particle-based celebratory confetti effect when the reader
 * reaches the very end of the proposal section as a joyful reward for completing the diary.
 */
export function fireDiaryCompletionConfetti() {
  const heartPath =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  let heartShape: any = 'circle';
  try {
    if (typeof (confetti as any).shapeFromPath === 'function') {
      heartShape = (confetti as any).shapeFromPath({ path: heartPath });
    }
  } catch {
    heartShape = 'circle';
  }

  // Stage 1: Left and Right angled corner fountains
  confetti({
    particleCount: 45,
    angle: 60,
    spread: 65,
    origin: { x: 0.08, y: 0.88 },
    colors: ROMANTIC_COLORS,
    shapes: [heartShape, 'circle'],
    scalar: 1.25,
    ticks: 240,
    gravity: 0.8,
  });

  confetti({
    particleCount: 45,
    angle: 120,
    spread: 65,
    origin: { x: 0.92, y: 0.88 },
    colors: ROMANTIC_COLORS,
    shapes: [heartShape, 'circle'],
    scalar: 1.25,
    ticks: 240,
    gravity: 0.8,
  });

  // Stage 2: Central golden star and rose shimmer bloom
  setTimeout(() => {
    confetti({
      particleCount: 65,
      spread: 95,
      origin: { x: 0.5, y: 0.65 },
      colors: ['#F3C68F', '#E6A055', '#FFF8ED', '#C96B85', '#A64D68'],
      shapes: [heartShape, 'circle'],
      scalar: 1.35,
      ticks: 240,
      gravity: 0.8,
    });
  }, 220);

  // Stage 3: Gentle romantic floating cascade
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 120,
      origin: { x: 0.5, y: 0.35 },
      colors: ROMANTIC_COLORS,
      shapes: [heartShape, 'circle'],
      scalar: 1.1,
      ticks: 220,
      gravity: 0.65,
    });
  }, 500);
}
