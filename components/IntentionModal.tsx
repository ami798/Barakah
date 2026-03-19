'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intention: string) => void;
  title?: string;
  placeholder?: string;
  isLoading?: boolean;
}

export function IntentionModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Release a Lantern',
  placeholder = 'What intention do you wish to release?',
  isLoading = false,
}: IntentionModalProps) {
  const [intention, setIntention] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intention.trim()) {
      onSubmit(intention);
      setIntention('');
    }
  };

  const handleClose = () => {
    setIntention('');
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const inputVariants = {
    focus: { boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="relative h-24 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border p-6 flex items-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary/30" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-accent/30" />
                </div>

                <div className="relative">
                  <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                  <p className="text-xs text-foreground/50 mt-1">Share your deepest intention</p>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Intention input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground/70">Your Intention</label>

                  <motion.div
                    variants={inputVariants}
                    whileFocus="focus"
                    className="relative"
                  >
                    <Input
                      type="text"
                      value={intention}
                      onChange={(e) => setIntention(e.target.value)}
                      placeholder={placeholder}
                      maxLength={200}
                      autoFocus
                      disabled={isLoading}
                      className="pr-10 border-primary/30 focus:border-primary bg-input text-foreground placeholder:text-foreground/40"
                    />

                    {/* Character count */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/40">
                      {intention.length}/200
                    </span>
                  </motion.div>

                  {/* Character count progress bar */}
                  <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(intention.length / 200) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Info text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-foreground/50 leading-relaxed"
                >
                  🌙 Your lantern will rise into the sky, carrying your intention into the universe. It will
                  illuminate for 40 days before gently fading away.
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={!intention.trim() || isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isLoading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="inline-block"
                      >
                        ⚡
                      </motion.span>
                    ) : (
                      '✨ Release'
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Decorative footer */}
              <div className="h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
