'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Letter } from '@/lib/types';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GlowCard } from '@/components/GlowCard';
import {
  getLetters,
  saveLetter,
} from '@/lib/storage';
import { generateId, getDaysUntilUnlock, formatDate } from '@/lib/helpers';
import { CrescentMeter } from '@/components/CrescentMeter';

export default function LetterPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [content, setContent] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const UNLOCK_DATE = '2027-02-08';

  useEffect(() => {
    setLetters(getLetters());
    setIsLoading(false);
  }, []);

  const handleSealLetter = () => {
    if (!content.trim()) return;

    const newLetter: Letter = {
      id: generateId(),
      content,
      sealedDate: new Date().toISOString(),
      unlockDate: UNLOCK_DATE,
      isOpened: false,
    };

    saveLetter(newLetter);
    setLetters([...letters, newLetter]);
    setContent('');
  };

  const daysUntilUnlock = getDaysUntilUnlock(UNLOCK_DATE);
  const progressPercentage = ((daysUntilUnlock / 365) * 100);

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
          Sealed Letters
        </h1>
        <p className="text-sm text-foreground/60">
          Write to your future self. They will be unlocked on February 8, 2027.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-6 py-8 max-w-2xl mx-auto space-y-8 relative z-10"
      >
        {/* Unlock countdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-foreground/60 mb-4">Time until unlock</p>
          <CrescentMeter progress={progressPercentage} label={`${daysUntilUnlock} days`} />
        </motion.div>

        {/* Write new letter section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 p-6 rounded-lg border border-border bg-card/50"
        >
          <h2 className="text-lg font-semibold text-foreground">Write a Letter</h2>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dear future self, I want to tell you..."
            maxLength={1000}
            rows={6}
            className="resize-none border-primary/30 focus:border-primary bg-input text-foreground"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/50">{content.length}/1000</span>

            <Button
              onClick={handleSealLetter}
              disabled={!content.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              🔐 Seal Letter
            </Button>
          </div>
        </motion.div>

        {/* Letters list */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Your Sealed Letters</h2>

          {letters.length === 0 ? (
            <p className="text-center text-foreground/50 py-8">
              No sealed letters yet. Write one to yourself!
            </p>
          ) : (
            <div className="grid gap-4">
              {letters.map((letter) => (
                <motion.div
                  key={letter.id}
                  layout
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedLetter(letter)}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-card/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground/70">
                        {letter.content.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-foreground/50 mt-2">
                        Sealed on {formatDate(letter.sealedDate)}
                      </p>
                    </div>

                    {letter.isOpened ? (
                      <span className="text-xl">💌✨</span>
                    ) : (
                      <span className="text-xl">🔐</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Letter detail modal */}
      {selectedLetter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedLetter(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card border border-border rounded-lg p-8 shadow-xl max-h-96 overflow-y-auto"
          >
            <p className="text-foreground/70 whitespace-pre-wrap">{selectedLetter.content}</p>
            <Button
              onClick={() => setSelectedLetter(null)}
              variant="outline"
              className="mt-6 w-full"
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
