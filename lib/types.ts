// Lantern represents a single lantern in the garden
export interface Lantern {
  id: string;
  intention: string;
  brightness: number; // 0-100
  releaseDate: string; // ISO date
  createdAt: string;
  isReleased: boolean;
  streak: number; // consecutive days with activity
}

// Letter represents a sealed letter to be opened on a specific date
export interface Letter {
  id: string;
  content: string;
  sealedDate: string;
  unlockDate: string; // Feb 8, 2027
  isOpened: boolean;
  openedDate?: string;
}

// JournalEntry represents an emotional check-in
export interface JournalEntry {
  id: string;
  date: string;
  heartLevel: number; // 1-5 scale
  note: string;
  mood: 'radiant' | 'calm' | 'contemplative' | 'restless' | 'heavy';
  tags: string[];
}

// EchoWhisper represents a shared wisdom or reflection
export interface EchoWhisper {
  id: string;
  content: string;
  author?: string;
  createdAt: string;
  likes: number;
  category: 'wisdom' | 'reflection' | 'inspiration' | 'healing';
}

// Dashboard stats for user overview
export interface DashboardStats {
  totalLanterns: number;
  releasedLanterns: number;
  currentStreak: number;
  journalEntries: number;
  averageMood: number;
  lastActivity: string;
}

// Notification for temporary UI feedback
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}
