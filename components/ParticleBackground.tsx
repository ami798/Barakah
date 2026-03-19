'use client';

import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let particleId = 0;

    const createParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 3; i++) {
        newParticles.push({
          id: particleId++,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          life: 1,
        });
      }
      return newParticles;
    };

    setParticles(createParticles());

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 20, 40, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles((prevParticles) => {
        const updated = prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity * 0.98,
            life: p.life - 0.005,
          }))
          .filter((p) => p.life > 0);

        // Draw particles
        updated.forEach((p) => {
          ctx.fillStyle = `rgba(184, 134, 11, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Add new particles periodically
        if (updated.length < 30) {
          updated.push(...createParticles());
        }

        return updated;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{       zIndex: 0 }}
    />
  );
}
