import React, { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  age: number;
  type: 'heart' | 'sparkle' | 'heart_bubble' | 'pop_sparkle';
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  bubbleStyle: 'sphere_heart' | 'heart_bubble';
}

const ROMANTIC_PALETTE = [
  '#A64D68', // Deep rose
  '#C96B85', // Warm blush
  '#E28FA4', // Soft rose pink
  '#F2A8BA', // Light baby blush
  '#E6957B', // Soft peach
  '#D4A373', // Champagne gold
  '#B8405E', // Rich crimson rose
];

const BUBBLE_IRIDESCENT_TINTS = [
  { border: 'rgba(255, 200, 220, 0.75)', fill1: 'rgba(255, 245, 250, 0.45)', fill2: 'rgba(250, 195, 215, 0.18)' },
  { border: 'rgba(245, 190, 235, 0.75)', fill1: 'rgba(255, 248, 253, 0.45)', fill2: 'rgba(235, 185, 245, 0.18)' },
  { border: 'rgba(255, 215, 195, 0.75)', fill1: 'rgba(255, 250, 245, 0.45)', fill2: 'rgba(255, 205, 180, 0.18)' },
  { border: 'rgba(230, 210, 255, 0.75)', fill1: 'rgba(253, 250, 255, 0.45)', fill2: 'rgba(215, 195, 255, 0.18)' },
];

export const HeartCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const isPointerInsideRef = useRef<boolean>(false);
  const lastMoveTimeRef = useRef<number>(0);
  const isStationaryRef = useRef<boolean>(false);
  const lastBubbleSpawnTimeRef = useRef<number>(0);
  const nextBubbleIntervalRef = useRef<number>(320);
  const animFrameIdRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const particleIdCounterRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    // Only run cursor trail on devices with fine pointer (mouse) and hover capability (PC/desktop/laptop)
    // On phones, touchscreens, and TV remotes, skip canvas animation to eliminate touch-scroll overhead and save GPU/CPU
    const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    if (!isFinePointer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays for crisp rendering
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Heart shape drawing utility centered at (0, 0)
    const drawHeartPath = (context: CanvasRenderingContext2D, size: number) => {
      const scale = size / 20;
      context.beginPath();
      context.moveTo(0, -4 * scale);
      context.bezierCurveTo(-5.5 * scale, -13 * scale, -15 * scale, -7 * scale, -15 * scale, 2 * scale);
      context.bezierCurveTo(-15 * scale, 9 * scale, -7 * scale, 15 * scale, 0, 19 * scale);
      context.bezierCurveTo(7 * scale, 15 * scale, 15 * scale, 9 * scale, 15 * scale, 2 * scale);
      context.bezierCurveTo(15 * scale, -7 * scale, 5.5 * scale, -13 * scale, 0, -4 * scale);
      context.closePath();
    };

    const drawHeartShape = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = Math.max(0, Math.min(1, alpha));
      context.fillStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 4;

      drawHeartPath(context, size);
      context.fill();
      context.restore();
    };

    const drawSparkleShape = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = Math.max(0, Math.min(1, alpha * 0.9));
      context.fillStyle = color;
      context.shadowColor = '#FFECC7';
      context.shadowBlur = 6;

      const r = size * 0.6;
      context.beginPath();
      for (let i = 0; i < 4; i++) {
        context.lineTo(Math.cos((i * Math.PI) / 2) * r, Math.sin((i * Math.PI) / 2) * r);
        context.lineTo(
          Math.cos(((i * 2 + 1) * Math.PI) / 4) * (r * 0.28),
          Math.sin(((i * 2 + 1) * Math.PI) / 4) * (r * 0.28)
        );
      }
      context.closePath();
      context.fill();
      context.restore();
    };

    // Draw glossy floating Heart Bubble (either iridescent sphere with heart inside or heart-shaped bubble)
    const drawHeartBubble = (
      context: CanvasRenderingContext2D,
      p: Particle,
      currentScale: number,
      currentAlpha: number
    ) => {
      const radius = Math.max(2, (p.size * currentScale) / 2);
      const tint = BUBBLE_IRIDESCENT_TINTS[p.id % BUBBLE_IRIDESCENT_TINTS.length];

      context.save();
      context.translate(p.x, p.y);
      context.rotate(p.rotation);

      if (p.bubbleStyle === 'sphere_heart') {
        // --- Translucent Glassy Soap Bubble with Heart Floating Inside ---
        // 1. Soft bubble glow & translucent body
        const grad = context.createRadialGradient(
          -radius * 0.35,
          -radius * 0.35,
          radius * 0.1,
          0,
          0,
          radius
        );
        grad.addColorStop(0, tint.fill1);
        grad.addColorStop(0.7, tint.fill2);
        grad.addColorStop(1, tint.border);

        context.globalAlpha = currentAlpha * 0.7;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fillStyle = grad;
        context.fill();

        // 2. Iridescent delicate soap bubble rim
        context.globalAlpha = currentAlpha * 0.85;
        context.lineWidth = Math.max(1, radius * 0.08);
        context.strokeStyle = tint.border;
        context.stroke();

        // 3. Curved specular highlight on top-left (soap bubble shine)
        context.globalAlpha = currentAlpha * 0.95;
        context.beginPath();
        context.arc(0, 0, radius * 0.78, -Math.PI * 0.75, -Math.PI * 0.25);
        context.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        context.lineWidth = Math.max(1.2, radius * 0.12);
        context.lineCap = 'round';
        context.stroke();

        // Secondary subtle bottom reflection glint
        context.beginPath();
        context.arc(0, 0, radius * 0.78, Math.PI * 0.35, Math.PI * 0.55);
        context.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        context.lineWidth = Math.max(0.8, radius * 0.08);
        context.stroke();

        // 4. Romantic inner floating heart
        const heartSize = radius * 0.95;
        context.globalAlpha = currentAlpha * 0.92;
        context.fillStyle = p.color;
        context.shadowColor = p.color;
        context.shadowBlur = 4;
        drawHeartPath(context, heartSize);
        context.fill();
      } else {
        // --- Heart-Shaped Iridescent Soap Bubble ---
        const heartScale = (radius * 1.6) / 20;

        // 1. Shimmering translucent heart body
        context.save();
        context.globalAlpha = currentAlpha * 0.35;
        context.fillStyle = tint.fill1;
        drawHeartPath(context, radius * 1.6);
        context.fill();

        // 2. Iridescent edge stroke
        context.globalAlpha = currentAlpha * 0.85;
        context.lineWidth = Math.max(1.2, radius * 0.09);
        context.strokeStyle = tint.border;
        context.shadowColor = p.color;
        context.shadowBlur = 5;
        context.stroke();

        // 3. Delicate inner heart accent
        context.globalAlpha = currentAlpha * 0.75;
        context.fillStyle = p.color;
        drawHeartPath(context, radius * 1.1);
        context.fill();

        // 4. Specular glass glint on left heart curve
        context.globalAlpha = currentAlpha * 0.9;
        context.beginPath();
        context.ellipse(-4 * heartScale, -7 * heartScale, 3 * heartScale, 1.2 * heartScale, -0.4, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.fill();
        context.restore();
      }

      context.restore();
    };

    // Draw tiny micro-sparkles when a bubble reaches its end and pops
    const spawnBubblePopMicroSparkles = (x: number, y: number, color: string) => {
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2 * i) / 4 + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 1.2 + 0.8;
        particleIdCounterRef.current += 1;
        particlesRef.current.push({
          id: particleIdCounterRef.current,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.2,
          size: Math.random() * 3 + 3,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.1,
          color,
          alpha: 0.9,
          maxLife: 16,
          life: 16,
          age: 0,
          type: 'pop_sparkle',
          wobblePhase: 0,
          wobbleSpeed: 0,
          wobbleAmp: 0,
          bubbleStyle: 'sphere_heart',
        });
      }
    };

    // Draw gentle breathing cursor halo when stationary
    const drawStationaryCursorAura = (context: CanvasRenderingContext2D, x: number, y: number, now: number) => {
      const pulse = Math.sin(now * 0.005) * 0.5 + 0.5; // 0 to 1
      const auraRadius = 10 + pulse * 6; // 10 to 16px
      const auraAlpha = 0.25 + pulse * 0.25;

      context.save();
      context.beginPath();
      context.arc(x, y, auraRadius, 0, Math.PI * 2);
      const auraGrad = context.createRadialGradient(x, y, 2, x, y, auraRadius);
      auraGrad.addColorStop(0, `rgba(242, 168, 186, ${auraAlpha * 0.7})`);
      auraGrad.addColorStop(0.6, `rgba(201, 107, 133, ${auraAlpha * 0.3})`);
      auraGrad.addColorStop(1, 'rgba(255, 210, 225, 0)');
      context.fillStyle = auraGrad;
      context.fill();

      // Delicate outer ring shimmer
      context.beginPath();
      context.arc(x, y, auraRadius * 0.85, 0, Math.PI * 2);
      context.strokeStyle = `rgba(255, 230, 240, ${auraAlpha * 0.6})`;
      context.lineWidth = 1;
      context.stroke();
      context.restore();
    };

    // Spawn heart bubbles that pop out from stationary cursor
    const spawnHeartBubble = (x: number, y: number) => {
      if (particlesRef.current.length > 70) {
        particlesRef.current.shift();
      }

      particleIdCounterRef.current += 1;
      const isSphere = Math.random() < 0.6;
      // Gentle initial pop out velocity with slight randomized spread
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const speed = Math.random() * 0.6 + 0.4;
      const maxLife = Math.floor(Math.random() * 55 + 65); // 65-120 frames (approx 1.2s - 2s life)

      particlesRef.current.push({
        id: particleIdCounterRef.current,
        // Start near pointer tip with small natural offset
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 6 - 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4, // upward buoyancy
        size: Math.random() * 8 + 18, // 18-26px bubble diameter
        rotation: (Math.random() - 0.5) * 0.2,
        vRot: (Math.random() - 0.5) * 0.02,
        color: ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
        alpha: 0.95,
        maxLife,
        life: maxLife,
        age: 0,
        type: 'heart_bubble',
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.04,
        wobbleAmp: Math.random() * 0.7 + 0.4,
        bubbleStyle: isSphere ? 'sphere_heart' : 'heart_bubble',
      });

      startAnimation();
    };

    // Standard trail particles when moving
    const spawnMovementParticles = (x: number, y: number, count = 1, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        if (particlesRef.current.length > 70) {
          particlesRef.current.shift();
        }

        particleIdCounterRef.current += 1;
        const isSparkle = !isBurst && Math.random() < 0.22;
        const speedMultiplier = isBurst ? 2.2 : 1.0;
        const angle = isBurst
          ? Math.random() * Math.PI * 2
          : -Math.PI / 2 + (Math.random() - 0.5) * 1.4;

        const speed = (Math.random() * 0.8 + 0.4) * speedMultiplier;
        const maxLife = isBurst ? 45 + Math.random() * 25 : 35 + Math.random() * 20;

        particlesRef.current.push({
          id: particleIdCounterRef.current,
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
          vy: Math.sin(angle) * speed - 0.4,
          size: isSparkle ? Math.random() * 5 + 6 : Math.random() * 6 + 8,
          rotation: (Math.random() - 0.5) * 0.6,
          vRot: (Math.random() - 0.5) * 0.05,
          color: ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
          alpha: 0.95,
          maxLife,
          life: maxLife,
          age: 0,
          type: isSparkle ? 'sparkle' : 'heart',
          wobblePhase: 0,
          wobbleSpeed: 0,
          wobbleAmp: 0,
          bubbleStyle: 'sphere_heart',
        });
      }

      startAnimation();
    };

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const now = performance.now();

      // Check if cursor is not moving (stationary)
      if (pointerPosRef.current && isPointerInsideRef.current) {
        const timeSinceMove = now - lastMoveTimeRef.current;

        // If stationary for more than 200ms
        if (timeSinceMove > 200) {
          isStationaryRef.current = true;

          // Draw gentle pulsing cursor aura
          drawStationaryCursorAura(ctx, pointerPosRef.current.x, pointerPosRef.current.y, now);

          // Pop out heart bubbles periodically while stationary
          if (now - lastBubbleSpawnTimeRef.current > nextBubbleIntervalRef.current) {
            spawnHeartBubble(pointerPosRef.current.x, pointerPosRef.current.y);
            lastBubbleSpawnTimeRef.current = now;
            // Slight organic jitter between 300ms and 450ms for natural pop cadence
            nextBubbleIntervalRef.current = 300 + Math.random() * 160;
          }
        }
      }

      const activeParticles: Particle[] = [];

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life -= 1;
        p.age += 1;

        if (p.life > 0) {
          if (p.type === 'heart_bubble') {
            // Heart Bubble physics: gentle upward floating buoyancy with sinusoidal soap-bubble sway
            p.wobblePhase += p.wobbleSpeed;
            p.x += p.vx + Math.sin(p.wobblePhase) * p.wobbleAmp;
            p.y += p.vy;

            // Decelerate horizontal speed, accelerate gentle buoyant lift
            p.vx *= 0.985;
            p.vy -= 0.012; // buoyancy
            p.rotation += p.vRot;

            // Pop-out spring expansion during first 10 frames of birth
            let scale = 1.0;
            if (p.age < 10) {
              const progress = p.age / 10;
              // Bounce overshoot: expands up to 1.15 then settles to 1.0
              scale = Math.sin(progress * Math.PI * 0.75) * 1.15;
            } else {
              // Gentle breathing pulse as it floats up
              scale = 1.0 + Math.sin(p.age * 0.08) * 0.05;
            }

            // Alpha curve: fades in quickly, stays vivid, gently fades before pop
            let currentAlpha = 0.95;
            if (p.age < 8) {
              currentAlpha = (p.age / 8) * 0.95;
            } else if (p.life < 15) {
              currentAlpha = (p.life / 15) * 0.95;
            }

            drawHeartBubble(ctx, p, scale, currentAlpha);
          } else if (p.type === 'pop_sparkle') {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.92;
            p.vy *= 0.92;
            const progress = p.life / p.maxLife;
            drawSparkleShape(ctx, p.x, p.y, p.size * progress, p.rotation, p.color, p.alpha * progress);
          } else {
            // Standard trail heart or sparkle
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy -= 0.015;
            p.rotation += p.vRot;

            const progress = p.life / p.maxLife;
            const currentAlpha = Math.sin(progress * Math.PI * 0.5) * 0.95;
            const currentSize = p.size * (0.35 + 0.65 * progress);

            if (p.type === 'heart') {
              drawHeartShape(ctx, p.x, p.y, currentSize, p.rotation, p.color, currentAlpha);
            } else {
              drawSparkleShape(ctx, p.x, p.y, currentSize, p.rotation, p.color, currentAlpha);
            }
          }

          activeParticles.push(p);
        } else if (p.type === 'heart_bubble') {
          // Bubble reached the end of its flight and pops with micro sparkles
          spawnBubblePopMicroSparkles(p.x, p.y, p.color);
        }
      }

      particlesRef.current = activeParticles;

      // Keep animation running if there are active particles OR cursor is inside and stationary
      const shouldKeepRunning =
        particlesRef.current.length > 0 ||
        (isPointerInsideRef.current && pointerPosRef.current !== null);

      if (shouldKeepRunning) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        isRunningRef.current = false;
        animFrameIdRef.current = null;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const startAnimation = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const curX = e.clientX;
      const curY = e.clientY;
      const now = performance.now();

      pointerPosRef.current = { x: curX, y: curY };
      isPointerInsideRef.current = true;
      lastMoveTimeRef.current = now;
      isStationaryRef.current = false;

      if (!lastPosRef.current) {
        lastPosRef.current = { x: curX, y: curY };
        spawnMovementParticles(curX, curY, 1);
        startAnimation();
        return;
      }

      const dx = curX - lastPosRef.current.x;
      const dy = curY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Spawn every 16px of travel distance to create an unbroken, smooth trail of hearts
      if (dist >= 16) {
        const steps = Math.min(Math.floor(dist / 16), 3);
        for (let s = 1; s <= steps; s++) {
          const ratio = s / steps;
          const interpX = lastPosRef.current.x + dx * ratio;
          const interpY = lastPosRef.current.y + dy * ratio;
          spawnMovementParticles(interpX, interpY, 1);
        }
        lastPosRef.current = { x: curX, y: curY };
      }

      startAnimation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerMove(touch as unknown as MouseEvent);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        pointerPosRef.current = { x: touch.clientX, y: touch.clientY };
        isPointerInsideRef.current = true;
        lastMoveTimeRef.current = performance.now();
        // Spawn immediate heart bubble on touch start
        spawnHeartBubble(touch.clientX, touch.clientY);
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      // Romantic burst of 4 delicate hearts & 1 heart bubble on click
      spawnMovementParticles(clientX, clientY, 4, true);
      spawnHeartBubble(clientX, clientY);
    };

    const handlePointerLeave = () => {
      isPointerInsideRef.current = false;
      isStationaryRef.current = false;
      lastPosRef.current = null;
    };

    const handlePointerEnter = (e: PointerEvent) => {
      isPointerInsideRef.current = true;
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
      lastMoveTimeRef.current = performance.now();
      startAnimation();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handlePointerLeave, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown as EventListener, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerenter', handlePointerEnter);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown as EventListener);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] select-none"
      aria-hidden="true"
    />
  );
};
