// Generate unique ID for records
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateString);
  checkDate.setHours(0, 0, 0, 0);
  
  if (checkDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (checkDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

// Format time for display
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Get days until unlock date
export function getDaysUntilUnlock(unlockDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const unlock = new Date(unlockDate);
  unlock.setHours(0, 0, 0, 0);
  
  const diffTime = unlock.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

// Check if letter should be unlocked
export function isLetterUnlocked(unlockDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const unlock = new Date(unlockDate);
  unlock.setHours(0, 0, 0, 0);
  
  return today.getTime() >= unlock.getTime();
}

// Get moon phase for crescent meter (0-1 scale)
export function getMoonPhase(progressValue: number): number {
  // Clamp between 0 and 1
  return Math.min(1, Math.max(0, progressValue));
}

// Get color based on heart level
export function getHeartColor(heartLevel: number): string {
  switch (heartLevel) {
    case 5: return 'text-emerald-400';
    case 4: return 'text-blue-400';
    case 3: return 'text-yellow-300';
    case 2: return 'text-orange-400';
    case 1: return 'text-red-400';
    default: return 'text-gray-400';
  }
}

// Get mood emoji
export function getMoodEmoji(mood: string): string {
  const moodMap: Record<string, string> = {
    radiant: '✨',
    calm: '🌙',
    contemplative: '🔮',
    restless: '⚡',
    heavy: '🌊',
  };
  return moodMap[mood] || '💫';
}

// Calculate brightness change for animation
export function calculateBrightnessChange(currentBrightness: number, maxBrightness: number = 100): number {
  const percentageChange = (currentBrightness / maxBrightness) * 100;
  return percentageChange;
}

// Format large numbers for display
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Get random encouragement message
export function getRandomEncouragement(): string {
  const messages = [
    'Your light matters in this world.',
    'Each moment of awareness is a gift.',
    'Your journey is uniquely yours.',
    'Small steps lead to profound change.',
    'You are exactly where you need to be.',
    'Growth happens in the quiet moments.',
    'Your heart knows the way.',
    'Every intention creates ripples.',
    'You are braver than you believe.',
    'The darkness makes room for light.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Calculate check-in streak from journal entries
export function calculateStreak(entries: Array<{ date: string }> = []): number {
  if (entries.length === 0) return 0;
  
  // Sort entries by date descending
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    entryDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
