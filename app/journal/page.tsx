'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { JournalEntry as JournalEntryComponent } from '@/components/JournalEntry';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GlowCard } from '@/components/GlowCard';
import { JournalEntry as JournalEntryType } from '@/lib/types';
import { getJournalEntries, saveJournalEntry } from '@/lib/storage';
import { generateId, calculateStreak } from '@/lib/helpers';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [note, setNote] = useState('');
  const [heartLevel, setHeartLevel] = useState(3);
  const [mood, setMood] = useState<'radiant' | 'calm' | 'contemplative' | 'restless' | 'heavy'>('calm');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const moods = [
    { value: 'radiant', label: '✨ Radiant', color: 'from-yellow-400 to-orange-400' },
    { value: 'calm', label: '🌙 Calm', color: 'from-blue-400 to-cyan-400' },
    { value: 'contemplative', label: '🔮 Contemplative', color: 'from-purple-400 to-pink-400' },
    { value: 'restless', label: '⚡ Restless', color: 'from-red-400 to-yellow-400' },
    { value: 'heavy', label: '🌊 Heavy', color: 'from-slate-400 to-blue-600' },
  ];

  useEffect(() => {
    const loadedEntries = getJournalEntries();
    // Sort by date descending
    setEntries(loadedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsLoading(false);
  }, []);

  const handleAddEntry = () => {
    if (!note.trim()) return;

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newEntry: JournalEntryType = {
      id: generateId(),
      date: new Date().toISOString(),
      heartLevel,
      note,
      mood: mood as any,
      tags: tagArray,
    };

    saveJournalEntry(newEntry);
    setEntries([newEntry, ...entries]);
    setNote('');
    setHeartLevel(3);
    setMood('calm');
    setTags('');
    setIsAdding(false);
  };

  const handleUpdateEntry = (updated: JournalEntryType) => {
    saveJournalEntry(updated);
    setEntries(entries.map((e) => (e.id === updated.id ? updated : e)));
  };

  const streak = calculateStreak(entries);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          🌙
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80 relative overflow-hidden">
      <ParticleBackground />
      {/* Header */}
      <motion.header
        className="relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 text-center"
      >
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
          Heart Journal
        </h1>
        <p className="text-sm text-foreground/60">
          Check in with your emotional state and reflect on your journey.
        </p>

        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 inline-block px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium"
          >
            🔥 {streak} day check-in streak
          </motion.div>
        )}
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 py-8 max-w-2xl mx-auto space-y-8 relative z-10"
      >
        {/* Add entry section */}
        {isAdding ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 rounded-lg border border-border bg-card/50 space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">Today's Check-in</h2>

            {/* Heart level selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">How is your heart today?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHeartLevel(level)}
                    className={`text-2xl p-2 rounded-lg transition-colors ${
                      heartLevel === level ? 'bg-primary/20' : 'hover:bg-foreground/10'
                    }`}
                  >
                    {'❤️'.repeat(level)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mood selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">What's your mood?</label>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((m) => (
                  <motion.button
                    key={m.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMood(m.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      mood === m.value
                        ? `bg-gradient-to-r ${m.color} text-white`
                        : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                    }`}
                  >
                    {m.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Note textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Your reflection</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind today?"
                maxLength={500}
                rows={4}
                className="resize-none border-primary/30 focus:border-primary bg-input text-foreground"
              />
              <span className="text-xs text-foreground/50">{note.length}/500</span>
            </div>

            {/* Tags input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Tags (comma-separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., gratitude, challenge, growth"
                className="border-primary/30 focus:border-primary bg-input text-foreground"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNote('');
                  setHeartLevel(3);
                  setMood('calm');
                  setTags('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEntry}
                disabled={!note.trim()}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Save Entry
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full p-6 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <p className="text-lg font-medium text-primary">+ New Check-in</p>
            <p className="text-sm text-foreground/50 mt-1">How are you feeling today?</p>
          </motion.button>
        )}

        {/* Entries list */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {entries.length === 0 ? (
            <p className="text-center text-foreground/50 py-8">
              No check-ins yet. Start your reflection journey today!
            </p>
          ) : (
            entries.map((entry) => (
              <JournalEntryComponent
                key={entry.id}
                entry={entry}
                isEditable={true}
                onUpdate={handleUpdateEntry}
              />
            ))
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
