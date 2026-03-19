'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CrescentMeterProps {
  progress: number; // 0-100
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function CrescentMeter({
  progress,
  label = 'Progress',
  showLabel = true,
  className,
}: CrescentMeterProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // SVG dimensions
  const size = 120;
  const radius = 45;
  const strokeWidth = 8;

  // Calculate the fill percentage for the moon
  const fillPercentage = (clampedProgress / 100) * 180;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Crescent Moon Meter */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        role="progressbar"
        aria-valuenow={Math.round(clampedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} - ${Math.round(clampedProgress)}% complete`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-lg"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc (gold light filling from left) */}
          <defs>
            <linearGradient id="crescentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            <filter id="crescentGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Crescent arc path */}
          <motion.path
            d={`M ${size / 2 - radius} ${size / 2} A ${radius} ${radius} 0 0 1 ${
              size / 2 + radius
            } ${size / 2}`}
            fill="none"
            stroke="url(#crescentGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#crescentGlow)"
            strokeDasharray={Math.PI * radius}
            initial={{
              strokeDashoffset: Math.PI * radius,
            }}
            animate={{
              strokeDashoffset: Math.PI * radius - (clampedProgress / 100) * Math.PI * radius,
            }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
          />

          {/* Center dot */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r="3"
            fill="url(#crescentGradient)"
            filter="url(#crescentGlow)"
          />

          {/* Decorative stars */}
          {clampedProgress > 50 && (
            <>
              <motion.circle
                cx={size / 2 - radius - 15}
                cy={size / 2 - 20}
                r="1.5"
                fill="#fbbf24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.circle
                cx={size / 2 + radius + 15}
                cy={size / 2 - 20}
                r="1.5"
                fill="#fbbf24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              />
            </>
          )}
        </svg>

        {/* Percentage display in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Math.round(clampedProgress)}%
          </motion.span>
        </div>
      </motion.div>

      {/* Label and description */}
      {showLabel && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm font-medium text-foreground/80">{label}</p>
          <p className="text-xs text-foreground/50 mt-1">
            {clampedProgress === 100
              ? 'Complete! 🌙'
              : `${Math.round(100 - clampedProgress)} to go`}
          </p>
        </motion.div>
      )}
    </div>
  );
}
