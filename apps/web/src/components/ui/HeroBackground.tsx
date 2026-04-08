import { useEffect, useRef } from 'react';
import '../../styles/hero-background.css';

type SpherePoint = {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  phase: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function createSpherePoints(count: number): SpherePoint[] {
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * index;

    return {
      baseX: Math.cos(theta) * radius,
      baseY: y,
      baseZ: Math.sin(theta) * radius,
      size: 1.1 + Math.random() * 2.1,
      phase: Math.random() * Math.PI * 2,
    };
  });
}

function createParticles(width: number, height: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    size: 0.8 + Math.random() * 2.2,
    alpha: 0.12 + Math.random() * 0.25,
  }));
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let sphereRadius = 0;
    let centerX = 0;
    let centerY = 0;
    let spherePoints = createSpherePoints(72);
    let particles = createParticles(window.innerWidth, window.innerHeight, 28);
    let sparkles = createParticles(window.innerWidth, window.innerHeight, 14);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.8);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const shortestSide = Math.min(width, height);
      sphereRadius = shortestSide * (width < 768 ? 0.14 : 0.18);
      centerX = width * (width < 900 ? 0.5 : 0.68);
      centerY = height * (width < 900 ? 0.34 : 0.42);

      spherePoints = createSpherePoints(width < 768 ? 48 : 72);
      particles = createParticles(width, height, width < 768 ? 18 : 28);
      sparkles = createParticles(width, height, width < 768 ? 10 : 14);
    };

    const render = (time: number) => {
      const t = time * 0.00045;
      context.clearRect(0, 0, width, height);

      const projected = spherePoints.map((point) => {
        const wobble = Math.sin(t * 2.1 + point.phase) * 0.04;
        const x1 = point.baseX * Math.cos(t * 0.9) - point.baseZ * Math.sin(t * 0.9);
        const z1 = point.baseX * Math.sin(t * 0.9) + point.baseZ * Math.cos(t * 0.9);
        const y1 = point.baseY * Math.cos(t * 0.55) - z1 * Math.sin(t * 0.55);
        const z2 = point.baseY * Math.sin(t * 0.55) + z1 * Math.cos(t * 0.55) + wobble;
        const perspective = 1.65 / (2.5 - z2);

        return {
          x: centerX + x1 * sphereRadius * perspective,
          y: centerY + y1 * sphereRadius * perspective,
          z: z2,
          perspective,
          size: point.size * perspective,
        };
      });

      for (let i = 0; i < projected.length; i += 1) {
        for (let j = i + 1; j < projected.length; j += 1) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > sphereRadius * 0.35) continue;

          const depth = (a.z + b.z + 2) / 4;
          const alpha = Math.max(0.02, 0.18 - distance / (sphereRadius * 3.4)) * (0.35 + depth);
          const blend = Math.min(1, Math.max(0, (a.z + b.z + 2) / 4));
          const r = Math.round(lerp(99, 34, blend));
          const g = Math.round(lerp(102, 211, blend));
          const bColor = Math.round(lerp(241, 238, blend));

          context.strokeStyle = `rgba(${r}, ${g}, ${bColor}, ${alpha})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      projected
        .sort((a, b) => a.z - b.z)
        .forEach((point) => {
          const blend = Math.min(1, Math.max(0, (point.z + 1) / 2));
          const r = Math.round(lerp(139, 34, blend));
          const g = Math.round(lerp(92, 211, blend));
          const bColor = Math.round(lerp(246, 238, blend));

          context.fillStyle = `rgba(${r}, ${g}, ${bColor}, ${0.22 + (point.z + 1) * 0.22})`;
          context.beginPath();
          context.arc(point.x, point.y, Math.max(1, point.size), 0, Math.PI * 2);
          context.fill();
        });

      sparkles.forEach((sparkle, index) => {
        const angle = t * 0.6 + index;
        const radius = sphereRadius * (0.65 + (index % 4) * 0.09);
        const sparkleX = centerX + Math.cos(angle) * radius;
        const sparkleY = centerY + Math.sin(angle * 1.3) * radius * 0.7;
        const alpha = 0.08 + ((Math.sin(t * 3.2 + index) + 1) / 2) * 0.22;

        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.beginPath();
        context.arc(sparkleX, sparkleY, 0.9 + (index % 3) * 0.45, 0, Math.PI * 2);
        context.fill();
      });

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        context.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    animationFrame = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="hero-background" aria-hidden="true">
      <div className="hero-background__base" />
      <div className="hero-background__blob hero-background__blob--left" />
      <div className="hero-background__blob hero-background__blob--right" />
      <div className="hero-background__grid" />
      <canvas ref={canvasRef} className="hero-background__canvas" />
      <div className="hero-background__hex hero-background__hex--one" />
      <div className="hero-background__hex hero-background__hex--two" />
      <div className="hero-background__hex hero-background__hex--three" />
      <div className="hero-background__triangle hero-background__triangle--one" />
      <div className="hero-background__triangle hero-background__triangle--two" />
      <div className="hero-background__star" />
      <div className="hero-background__vignette" />
    </div>
  );
}
