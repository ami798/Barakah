'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PulseAnimationProps {
  children: ReactNode;
  className?: string;
  intensity?: 'gentle' | 'medium' | 'strong';
}

export function PulseAnimation({
  children,
  className,
  intensity = 'medium',
}: PulseAnimationProps) {
  const intensityClasses = {
    gentle: 'animate-pulse',
    medium: 'animate-pulse',
    strong: 'animate-pulse',
  };

  return (
    <div
      className={cn(intensityClasses[intensity], className)}
      style={{
        animationDuration: intensity === 'gentle' ? '4s' : intensity === 'medium' ? '3s' : '2s',
      }}
    >
      {children}
    </div>
  );
}
