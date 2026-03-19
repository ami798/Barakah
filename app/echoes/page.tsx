'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GlowCard } from '@/components/GlowCard';
import { EchoWhisper } from '@/lib/types';
import { getEchoWhispers, saveEchoWhisper } from '@/lib/storage';
import { generateId, formatDate } from '@/lib/helpers';

const defaultWhispers: EchoWhisper[] = [
  {
    id: 'default-1',
    content: 'Every intention carries weight. Honor yours by releasing it with purpose.',
    author: 'Barakah Community',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 24,
    category: 'wisdom',
  },
  {
    id: 'default-2',
    content: 'Your heart knows the way. Trust it.',
    author: 'Barakah Community',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 18,
    category: 'reflection',
  },
  {
    id: 'default-3',
    content: 'In the quiet moments, we find our truth.',
    author: 'Barakah Community',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 31,
    category: 'inspiration',
  },
];

export default function EchoesPage() {
  const [whispers, setWhispers] = useState<EchoWhisper[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<'wisdom' | 'reflection' | 'inspiration' | 'healing'>('inspiration');
  const [likedWhispers, setLikedWhispers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'wisdom', label: '🔮 Wisdom', color: 'from-purple-400 to-pink-400' },
    { value: 'reflection', label: '📔 Reflection', color: 'from-blue-400 to-cyan-400' },
    { value: 'inspiration', label: '✨ Inspiration', color: 'from-yellow-400 to-orange-400' },
    { value: 'healing', label: '💚 Healing', color: 'from-green-400 to-emerald-400' },
  ];

  useEffect(() => {
    const stored = getEchoWhispers();
    const combined = [...defaultWhispers, ...stored].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setWhispers(combined);
    setIsLoading(false);
  }, []);

  const handleAddWhisper = () => {
    if (!content.trim()) return;

    const newWhisper: EchoWhisper = {
      id: generateId(),
      content,
      author: author || 'Anonymous',
      createdAt: new Date().toISOString(),
      likes: 0,
      category,
    };

    saveEchoWhisper(newWhisper);
    setWhispers([newWhisper, ...whispers]);
    setContent('');
    setAuthor('');
    setCategory('inspiration');
    setIsAdding(false);
  };

  const handleLike = (id: string) => {
    const newLiked = new Set(likedWhispers);
    const whisper = whispers.find((w) => w.id === id);

    if (whisper) {
      if (newLiked.has(id)) {
        newLiked.delete(id);
        whisper.likes = Math.max(0, whisper.likes - 1);
      } else {
        newLiked.add(id);
        whisper.likes += 1;
      }

      setLikedWhispers(newLiked);
      if (!id.startsWith('default-')) {
        saveEchoWhisper(whisper);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          🌙
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    },
  };

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
          Echo Whispers
        </h1>
        <p className="text-sm text-foreground/60">
          Share and discover wisdom from the Barakah community
        </p>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 py-8 max-w-3xl mx-auto space-y-6 relative z-10"
      >
        {/* Add whisper button */}
        {!isAdding ? (
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(true)}
            className="w-full p-6 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <p className="text-lg font-medium text-primary">+ Share a Whisper</p>
            <p className="text-sm text-foreground/50 mt-1">Share your wisdom with the community</p>
          </motion.button>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 rounded-lg border border-border bg-card/50 space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">Share Your Wisdom</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Your Message</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What wisdom or inspiration would you like to share?"
                maxLength={300}
                rows={4}
                className="resize-none border-primary/30 focus:border-primary bg-input text-foreground"
              />
              <span className="text-xs text-foreground/50">{content.length}/300</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Your Name (optional)</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name or Anonymous"
                className="border-primary/30 focus:border-primary bg-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat.value as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === cat.value
                        ? `bg-gradient-to-r ${cat.color} text-white`
                        : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                    }`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setContent('');
                  setAuthor('');
                  setCategory('inspiration');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddWhisper}
                disabled={!content.trim()}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Share
              </Button>
            </div>
          </motion.div>
        )}

        {/* Whispers list */}
        <motion.div variants={containerVariants} className="space-y-4">
          {whispers.length === 0 ? (
            <p className="text-center text-foreground/50 py-8">
              No whispers yet. Be the first to share!
            </p>
          ) : (
            whispers.map((whisper) => {
              const isLiked = likedWhispers.has(whisper.id);
              const categoryIcon = categories.find((c) => c.value === whisper.category);

              return (
                <motion.div
                  key={whisper.id}
                  variants={itemVariants}
                  className="p-6 rounded-lg border border-border bg-card hover:bg-card/70 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm text-primary font-medium">{whisper.author}</p>
                      <p className="text-xs text-foreground/50">{formatDate(whisper.createdAt)}</p>
                    </div>

                    <span className="text-lg">{categoryIcon?.label.split(' ')[0]}</span>
                  </div>

                  {/* Content */}
                  <p className="text-foreground/80 leading-relaxed italic mb-4">
                    "{whisper.content}"
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-xs text-foreground/50">{whisper.category}</span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(whisper.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                        isLiked
                          ? 'bg-accent/30 text-accent'
                          : 'bg-foreground/10 text-foreground/60 hover:bg-foreground/20'
                      }`}
                    >
                      <span>{isLiked ? '❤️' : '🤍'}</span>
                      <span>{whisper.likes}</span>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
