'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CrescentMeter } from '@/components/CrescentMeter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GlowCard } from '@/components/GlowCard';
import { calculateDashboardStats, exportAllData, getLanterns, getJournalEntries } from '@/lib/storage';
import { formatDate } from '@/lib/helpers';

export default function DashboardPage() {
  const [stats, setStats] = useState(calculateDashboardStats());
  const [isLoading, setIsLoading] = useState(true);
  const [lanterns, setLanterns] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setStats(calculateDashboardStats());
    setLanterns(getLanterns());
    setEntries(getJournalEntries());
    setIsLoading(false);
  }, []);

  const handleExport = () => {
    const data = exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barakah-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
          Your Journey
        </h1>
        <p className="text-sm text-foreground/60">
          Track your progress and celebrate your growth
        </p>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-6 py-8 max-w-4xl mx-auto space-y-8"
      >
        {/* Main stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border border-border bg-card/50 text-center"
          >
            <p className="text-sm text-foreground/60 mb-2">Total Lanterns</p>
            <p className="text-4xl font-bold text-primary">{stats.totalLanterns}</p>
            <p className="text-xs text-foreground/40 mt-2">Intentions released</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border border-border bg-card/50 text-center"
          >
            <p className="text-sm text-foreground/60 mb-2">Released</p>
            <p className="text-4xl font-bold text-accent">{stats.releasedLanterns}</p>
            <p className="text-xs text-foreground/40 mt-2">Completed journeys</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border border-border bg-card/50 text-center"
          >
            <p className="text-sm text-foreground/60 mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-secondary">🔥 {stats.currentStreak}</p>
            <p className="text-xs text-foreground/40 mt-2">Days in a row</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border border-border bg-card/50 text-center"
          >
            <p className="text-sm text-foreground/60 mb-2">Check-ins</p>
            <p className="text-4xl font-bold text-primary">{stats.journalEntries}</p>
            <p className="text-xs text-foreground/40 mt-2">Heart entries</p>
          </motion.div>
        </div>

        {/* Mood average progress */}
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-lg border border-border bg-card/50"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6 text-center">Emotional Wellbeing</h2>
          <CrescentMeter
            progress={stats.averageMood * 20}
            label="Average Heart Level"
            showLabel={true}
          />
        </motion.div>

        {/* Recent activity */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>

          <div className="p-6 rounded-lg border border-border bg-card/50 space-y-4">
            {entries.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-2">Latest Check-in</p>
                <p className="text-foreground/60">{formatDate(entries[0].date)} - {entries[0].mood}</p>
              </div>
            )}

            {lanterns.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-2">Last Lantern Released</p>
                <p className="text-foreground/60 truncate">{lanterns[lanterns.length - 1].intention}</p>
              </div>
            )}

            {entries.length === 0 && lanterns.length === 0 && (
              <p className="text-sm text-foreground/50">Start by releasing a lantern or checking in!</p>
            )}
          </div>
        </motion.div>

        {/* Data export */}
        <motion.div variants={itemVariants} className="p-6 rounded-lg border border-border bg-card/50">
          <h3 className="font-semibold text-foreground mb-4">Backup & Export</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Download all your data as a JSON file for backup or transfer.
          </p>
          <Button
            onClick={handleExport}
            variant="outline"
            className="w-full"
          >
            📥 Download Backup
          </Button>
        </motion.div>

        {/* Statistics section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg border border-border bg-card/50">
            <h3 className="font-semibold text-foreground mb-2">Lantern Stats</h3>
            <div className="space-y-2 text-sm text-foreground/60">
              <p>Total released: {stats.totalLanterns}</p>
              <p>Active: {stats.totalLanterns - stats.releasedLanterns}</p>
              <p>
                Completion rate:{' '}
                {stats.totalLanterns === 0
                  ? '0%'
                  : Math.round((stats.releasedLanterns / stats.totalLanterns) * 100)}
                %
              </p>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card/50">
            <h3 className="font-semibold text-foreground mb-2">Reflection Stats</h3>
            <div className="space-y-2 text-sm text-foreground/60">
              <p>Total entries: {stats.journalEntries}</p>
              <p>Current streak: {stats.currentStreak} days</p>
              <p>Avg heart level: {Math.round(stats.averageMood * 10) / 10}/5</p>
            </div>
          </div>
        </motion.div>

        {/* Inspirational quote */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-lg border border-border bg-gradient-to-r from-primary/10 to-accent/10 text-center"
        >
          <p className="text-lg text-foreground font-medium italic">
            {'"Your journey is uniquely yours. Every lantern released, every entry written, brings you closer to your truth."'}
          </p>
          <p className="text-sm text-foreground/50 mt-3">✨ Keep going</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
