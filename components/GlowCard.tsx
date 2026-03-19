'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'gold' | 'emerald' | 'rose';
}

export function GlowCard({
  children,
  className,
  glowColor = 'gold',
}: GlowCardProps) {
  const glowClasses = {
    gold: 'before:from-amber-500/20 before:to-yellow-600/20 shadow-[0_0_30px_rgba(184,134,11,0.15)]',
    emerald: 'before:from-emerald-500/20 before:to-teal-600/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    rose: 'before:from-rose-500/20 before:to-pink-600/20 shadow-[0_0_30px_rgba(244,63,94,0.15)]',
  };

  return (
    <div
      className={cn(
        'relative bg-card border border-border rounded-lg p-6 overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 before:pointer-events-none',
        glowClasses[glowColor],
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
