'use client';

import { useEffect } from 'react';
import { initializePWA } from '@/lib/pwa';

export function PWAProvider() {
  useEffect(() => {
    // Initialize PWA on client mount
    initializePWA();
  }, []);

  return null;
}
