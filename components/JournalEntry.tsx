'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { JournalEntry as JournalEntryType } from '@/lib/types';
import { formatDate, getMoodEmoji, getHeartColor } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface JournalEntryProps {
  entry: JournalEntryType;
  isEditable?: boolean;
  onUpdate?: (entry: JournalEntryType) => void;
  onClick?: () => void;
}

export function JournalEntry({
  entry,
  isEditable = false,
  onUpdate,
  onClick,
}: JournalEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNote, setEditNote] = useState(entry.note);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ ...entry, note: editNote });
    }
    setEditMode(false);
  };

  const heartVariants = {
    initial: { scale: 0, rotate: -20 },
    animate: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200 } },
    hover: { scale: 1.2 },
  };

  const moodEmoji = getMoodEmoji(entry.mood);
  const heartColor = getHeartColor(entry.heartLevel);

  return (
    <motion.div
      layout
      onClick={onClick || (() => setIsExpanded(!isExpanded))}
      className={cn(
        'p-4 rounded-lg border border-border cursor-pointer transition-colors hover:bg-card/50',
        isExpanded && 'bg-card/70'
      )}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Heart level indicator */}
          <motion.div
            variants={heartVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="flex-shrink-0"
          >
            <span className={cn('text-2xl', heartColor)}>
              {'❤️'.repeat(entry.heartLevel)}
            </span>
          </motion.div>

          {/* Date and mood */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {formatDate(entry.date)}
            </p>
            <p className="text-xs text-foreground/50 flex items-center gap-1">
              <span>{moodEmoji}</span>
              <span className="capitalize">{entry.mood}</span>
            </p>
          </div>
        </div>

        {/* Tags preview */}
        {entry.tags.length > 0 && (
          <div className="hidden sm:flex gap-1 flex-wrap justify-end">
            {entry.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-border space-y-3"
        >
          {/* Note content */}
          {editMode ? (
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              className="w-full px-3 py-2 rounded bg-input border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Add your thoughts..."
            />
          ) : (
            <p className="text-sm text-foreground/70 leading-relaxed">
              {entry.note || 'No notes added'}
            </p>
          )}

          {/* All tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent/80 border border-accent/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          {isEditable && (
            <div className="flex gap-2 pt-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditNote(entry.note);
                      setEditMode(false);
                    }}
                    className="text-xs px-3 py-1.5 rounded border border-border hover:bg-foreground/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xs px-3 py-1.5 rounded border border-border hover:bg-foreground/10 transition"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
