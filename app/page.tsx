'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lantern as LanternComponent } from '@/components/Lantern';
import { IntentionModal } from '@/components/IntentionModal';
import { Lantern, Notification } from '@/lib/types';
import {
  getLanterns,
  saveLantern,
  deleteLantern,
  calculateDashboardStats,
} from '@/lib/storage';
import { generateId, getRandomEncouragement } from '@/lib/helpers';

export default function Home() {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Load lanterns on mount
  useEffect(() => {
    setLanterns(getLanterns());
    setIsLoading(false);
  }, []);

  const handleAddLantern = (intention: string) => {
    const newLantern: Lantern = {
      id: generateId(),
      intention,
      brightness: 75,
      releaseDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isReleased: false,
      streak: 1,
    };

    saveLantern(newLantern);
    setLanterns([...lanterns, newLantern]);
    setIsModalOpen(false);

    // Show notification
    setNotification({
      id: generateId(),
      message: 'Your lantern has been released! ✨',
      type: 'success',
      duration: 3000,
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteLantern = (id: string) => {
    deleteLantern(id);
    setLanterns(lanterns.filter((l) => l.id !== id));

    setNotification({
      id: generateId(),
      message: 'Lantern released to the heavens 🌙',
      type: 'info',
      duration: 2500,
    });

    setTimeout(() => setNotification(null), 2500);
  };

  const handleIncreaseBrightness = (id: string) => {
    const lantern = lanterns.find((l) => l.id === id);
    if (lantern && lantern.brightness < 100) {
      const updated = { ...lantern, brightness: Math.min(100, lantern.brightness + 10) };
      saveLantern(updated);
      setLanterns(lanterns.map((l) => (l.id === id ? updated : l)));
    }
  };

  const stats = calculateDashboardStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          🌙
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <h1 className="text-4xl font-bold text-balance text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Barakah Lanterns
          </h1>
          <span className="text-3xl animate-bounce">🏮</span>
        </div>

        <p className="text-sm text-foreground/60 max-w-md mx-auto">
          {getRandomEncouragement()}
        </p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-around gap-4 max-w-sm mx-auto text-sm"
        >
          <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-foreground/50 text-xs">Total Lanterns</p>
            <p className="text-primary font-bold text-lg">{stats.totalLanterns}</p>
          </div>

          <div className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-foreground/50 text-xs">Streak</p>
            <p className="text-accent font-bold text-lg">🔥 {stats.currentStreak}</p>
          </div>

          <div className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/30">
            <p className="text-foreground/50 text-xs">Released</p>
            <p className="text-secondary font-bold text-lg">{stats.releasedLanterns}</p>
          </div>
        </motion.div>
      </motion.header>

      {/* Lantern Garden */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-8"
      >
        {lanterns.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-16"
          >
            <p className="text-4xl mb-4">🌙</p>
            <p className="text-foreground/60 mb-6">
              Your garden is empty. Release your first intention.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/50 transition-shadow"
            >
              ✨ Release a Lantern
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {lanterns.map((lantern) => (
              <motion.div
                key={lantern.id}
                variants={itemVariants}
                className="relative group"
                whileHover={{ y: -8 }}
              >
                <LanternComponent
                  lantern={lantern}
                  onClick={() => handleIncreaseBrightness(lantern.id)}
                  interactive={true}
                />

                {/* Hover actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-2 left-2 flex gap-2"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLantern(lantern.id);
                    }}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition"
                    title="Release to heavens"
                  >
                    ✨
                  </button>
                </motion.div>
              </motion.div>
            ))}

            {/* Add new lantern button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="h-full min-h-[300px] rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/60 flex items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="text-center">
                <p className="text-3xl mb-2">+</p>
                <p className="text-sm text-foreground/60">New Lantern</p>
              </div>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Floating action button for adding lantern */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow z-30"
      >
        ✨
      </motion.button>

      {/* Intention Modal */}
      <IntentionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLantern}
        isLoading={false}
      />

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-card border border-border shadow-lg"
        >
          <p className="text-sm text-foreground">{notification.message}</p>
        </motion.div>
      )}
    </div>
  );
}
