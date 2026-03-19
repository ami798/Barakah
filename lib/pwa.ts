// PWA initialization and registration

export async function registerServiceWorker() {
  if (typeof window === 'undefined') {
    return;
  }

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });

    console.log('Service Worker registered:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker?.addEventListener('statechange', () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          // New service worker is ready, notify user
          console.log('New version available. Please refresh.');
          
          // Optional: Show a notification to the user
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('pwa-update-available', {
                detail: { registration },
              })
            );
          }
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

// Handle install prompt
export function setupPWAInstall() {
  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button if needed
    window.dispatchEvent(
      new CustomEvent('pwa-install-available', {
        detail: { prompt: deferredPrompt },
      })
    );
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
  });

  return () => deferredPrompt;
}

// Check if app is already installed
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  const isIOSInstalled = window.navigator.standalone === true;
  const isAndroidInstalled = 'display-mode' in window.matchMedia('(display-mode: standalone)');

  return isIOSInstalled || isAndroidInstalled;
}

// Get PWA display mode
export function getPWADisplayMode(): string {
  if (typeof window === 'undefined') return 'browser';

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) return 'standalone';

  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  if (isMinimalUI) return 'minimal-ui';

  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  if (isFullscreen) return 'fullscreen';

  return 'browser';
}

// Request notification permission
export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return 'denied';
}

// Send notification
export function sendNotification(
  title: string,
  options?: NotificationOptions
) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options,
      });
    } else {
      new Notification(title, options);
    }
  }
}

// Initialize all PWA features
export async function initializePWA() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Register service worker
    await registerServiceWorker();

    // Setup install prompt
    setupPWAInstall();

    // Log PWA info
    console.log('PWA Mode:', getPWADisplayMode());
    console.log('Is Installed:', isAppInstalled());
  } catch (error) {
    console.error('PWA initialization error:', error);
  }
}
