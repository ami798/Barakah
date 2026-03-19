import { Lantern, Letter, JournalEntry, EchoWhisper, DashboardStats } from './types';

const STORAGE_KEYS = {
  LANTERNS: 'barakah_lanterns',
  LETTERS: 'barakah_letters',
  JOURNAL: 'barakah_journal',
  ECHOES: 'barakah_echoes',
  LAST_ACTIVITY: 'barakah_last_activity',
};

// Generic storage functions
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`Failed to save to storage: ${key}`);
  }
}

// Lantern management
export function getLanterns(): Lantern[] {
  return getFromStorage<Lantern[]>(STORAGE_KEYS.LANTERNS, []);
}

export function saveLantern(lantern: Lantern): void {
  const lanterns = getLanterns();
  const index = lanterns.findIndex(l => l.id === lantern.id);
  
  if (index >= 0) {
    lanterns[index] = lantern;
  } else {
    lanterns.push(lantern);
  }
  
  saveToStorage(STORAGE_KEYS.LANTERNS, lanterns);
  updateLastActivity();
}

export function deleteLantern(id: string): void {
  const lanterns = getLanterns();
  saveToStorage(STORAGE_KEYS.LANTERNS, lanterns.filter(l => l.id !== id));
  updateLastActivity();
}

// Letter management
export function getLetters(): Letter[] {
  return getFromStorage<Letter[]>(STORAGE_KEYS.LETTERS, []);
}

export function saveLetter(letter: Letter): void {
  const letters = getLetters();
  const index = letters.findIndex(l => l.id === letter.id);
  
  if (index >= 0) {
    letters[index] = letter;
  } else {
    letters.push(letter);
  }
  
  saveToStorage(STORAGE_KEYS.LETTERS, letters);
  updateLastActivity();
}

// Journal management
export function getJournalEntries(): JournalEntry[] {
  return getFromStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL, []);
}

export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();
  const index = entries.findIndex(e => e.id === entry.id);
  
  if (index >= 0) {
    entries[index] = entry;
  } else {
    entries.push(entry);
  }
  
  saveToStorage(STORAGE_KEYS.JOURNAL, entries);
  updateLastActivity();
}

// Echo whispers management
export function getEchoWhispers(): EchoWhisper[] {
  return getFromStorage<EchoWhisper[]>(STORAGE_KEYS.ECHOES, []);
}

export function saveEchoWhisper(whisper: EchoWhisper): void {
  const whispers = getEchoWhispers();
  const index = whispers.findIndex(w => w.id === whisper.id);
  
  if (index >= 0) {
    whispers[index] = whisper;
  } else {
    whispers.push(whisper);
  }
  
  saveToStorage(STORAGE_KEYS.ECHOES, whispers);
  updateLastActivity();
}

// Activity tracking
export function getLastActivity(): string {
  return getFromStorage<string>(STORAGE_KEYS.LAST_ACTIVITY, new Date().toISOString());
}

export function updateLastActivity(): void {
  saveToStorage(STORAGE_KEYS.LAST_ACTIVITY, new Date().toISOString());
}

// Calculate current streak based on journal entries
export function calculateStreak(): number {
  const entries = getJournalEntries();
  if (entries.length === 0) return 0;
  
  // Sort entries by date in descending order
  const sorted = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - streak);
    
    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Calculate dashboard stats
export function calculateDashboardStats(): DashboardStats {
  const lanterns = getLanterns();
  const journalEntries = getJournalEntries();
  
  const releasedLanterns = lanterns.filter(l => l.isReleased).length;
  const averageMood = journalEntries.length > 0
    ? journalEntries.reduce((sum, entry) => sum + entry.heartLevel, 0) / journalEntries.length
    : 0;
  
  return {
    totalLanterns: lanterns.length,
    releasedLanterns,
    currentStreak: calculateStreak(),
    journalEntries: journalEntries.length,
    averageMood,
    lastActivity: getLastActivity(),
  };
}

// Export data as JSON for backup
export function exportAllData() {
  return {
    lanterns: getLanterns(),
    letters: getLetters(),
    journal: getJournalEntries(),
    echoes: getEchoWhispers(),
    exportDate: new Date().toISOString(),
  };
}

// Clear all data (use with caution)
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
