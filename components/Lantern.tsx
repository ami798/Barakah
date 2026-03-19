'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lantern as LanternType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface LanternProps {
  lantern: LanternType;
  onClick?: () => void;
  interactive?: boolean;
}

export function Lantern({ lantern, onClick, interactive = true }: LanternProps) {
  // Animation variants for floating and breathing
  const containerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants = {
    glow: {
      boxShadow: [
        `0 0 20px rgba(245, 158, 11, 0.3)`,
        `0 0 40px rgba(245, 158, 11, 0.6)`,
        `0 0 20px rgba(245, 158, 11, 0.3)`,
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Brightness affects glow intensity
  const brightnessFactor = lantern.brightness / 100;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={interactive ? { scale: 1.1 } : undefined}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center cursor-pointer transition-transform',
        interactive && 'hover:scale-110'
      )}
    >
      {/* Outer glow effect */}
      <motion.div
        variants={glowVariants}
        animate="glow"
        className="absolute -inset-4 rounded-full pointer-events-none"
        style={{
          opacity: brightnessFactor * 0.6,
        }}
      />

      {/* Floating animation container */}
      <motion.div
        variants={floatVariants}
        animate="float"
        className="relative w-24 h-32"
      >
        {/* Lantern body SVG */}
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 ${8 + brightnessFactor * 12}px rgba(245, 158, 11, ${
              0.3 + brightnessFactor * 0.7
            }))`,
          }}
        >
          {/* Top decoration */}
          <path
            d="M 20 10 Q 30 5 50 5 Q 70 5 80 10"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Main lantern body */}
          <g>
            {/* Left panel */}
            <path
              d="M 25 20 L 25 90 Q 25 95 30 95 L 70 95 Q 75 95 75 90 L 75 20"
              fill="#1a1a2e"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
            />

            {/* Right panel - ornate pattern */}
            <circle cx="50" cy="55" r="18" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
            <circle cx="50" cy="55" r="12" fill="none" stroke="#f59e0b" strokeWidth="0.5" />

            {/* Top crescent detail */}
            <path
              d="M 35 35 Q 50 25 65 35"
              stroke="#fbbf24"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Inner light glow */}
          <ellipse
            cx="50"
            cy="60"
            rx="12"
            ry="20"
            fill="url(#lightGradient)"
            opacity={0.3 + brightnessFactor * 0.7}
          />

          {/* Bottom decoration */}
          <path
            d="M 30 100 Q 35 105 50 105 Q 65 105 70 100"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Hanging ornament */}
          <path
            d="M 50 105 L 50 115"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <circle cx="50" cy="118" r="2" fill="#f59e0b" />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            <radialGradient id="lightGradient">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Brightness indicator (small dots) */}
        {lantern.brightness > 70 && (
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="absolute top-8 left-8 w-1.5 h-1.5 bg-yellow-300 rounded-full blur-sm"
          />
        )}
      </motion.div>

      {/* Intention text with streak */}
      <div className="mt-4 text-center max-w-xs">
        <p className="text-sm text-foreground/70 truncate">{lantern.intention}</p>

        {/* Streak indicator */}
        {lantern.streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium"
          >
            🔥 {lantern.streak} day streak
          </motion.div>
        )}
      </div>

      {/* Status indicator */}
      {lantern.isReleased && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-3 h-3 bg-emerald-400 rounded-full"
          title="Released"
        />
      )}
    </motion.div>
  );
}
