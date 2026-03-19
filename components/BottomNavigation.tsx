'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Garden', href: '/', icon: '🌙' },
  { label: 'Letter', href: '/letter', icon: '💌' },
  { label: 'Journal', href: '/journal', icon: '📔' },
  { label: 'Dashboard', href: '/dashboard', icon: '✨' },
  { label: 'Echoes', href: '/echoes', icon: '🔮' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-2 py-3 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 text-center text-xs font-medium transition-colors"
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -top-2 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon with animation */}
              <motion.span
                className="text-xl"
                animate={{
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {item.icon}
              </motion.span>

              {/* Label */}
              <motion.span
                className={cn(
                  'transition-colors',
                  isActive ? 'text-primary font-semibold' : 'text-foreground/50'
                )}
              >
                {item.label}
              </motion.span>

              {/* Active background glow */}
              {isActive && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
