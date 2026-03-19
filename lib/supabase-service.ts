import { createClient } from '@/lib/supabase/client';
import { Lantern, Letter, JournalEntry, EchoWhisper } from './types';

const supabase = createClient();

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// LANTERNS
export async function getLanterns(userId: string) {
  const { data, error } = await supabase
    .from('lanterns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Lantern[];
}

export async function saveLantern(userId: string, lantern: Lantern) {
  const { data, error } = await supabase
    .from('lanterns')
    .upsert({
      id: lantern.id,
      user_id: userId,
      intention: lantern.intention,
      color: lantern.color,
      created_at: lantern.created_at,
      is_released: lantern.isReleased,
      released_at: lantern.releasedAt,
    })
    .select();

  if (error) throw error;
  return data[0] as Lantern;
}

export async function deleteLantern(userId: string, lanternId: string) {
  const { error } = await supabase
    .from('lanterns')
    .delete()
    .eq('id', lanternId)
    .eq('user_id', userId);

  if (error) throw error;
}

// LETTERS
export async function getLetters(userId: string) {
  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Letter[];
}

export async function saveLetter(userId: string, letter: Letter) {
  const { data, error } = await supabase
    .from('letters')
    .upsert({
      id: letter.id,
      user_id: userId,
      content: letter.content,
      created_at: letter.created_at,
      scheduled_release: letter.scheduledRelease,
      is_released: letter.isReleased,
      released_at: letter.releasedAt,
    })
    .select();

  if (error) throw error;
  return data[0] as Letter;
}

export async function deleteLetter(userId: string, letterId: string) {
  const { error } = await supabase
    .from('letters')
    .delete()
    .eq('id', letterId)
    .eq('user_id', userId);

  if (error) throw error;
}

// JOURNAL ENTRIES
export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as JournalEntry[];
}

export async function saveJournalEntry(userId: string, entry: JournalEntry) {
  const { data, error } = await supabase
    .from('journal_entries')
    .upsert({
      id: entry.id,
      user_id: userId,
      date: entry.date,
      content: entry.content,
      heart_level: entry.heartLevel,
      created_at: entry.created_at,
    })
    .select();

  if (error) throw error;
  return data[0] as JournalEntry;
}

export async function deleteJournalEntry(userId: string, entryId: string) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) throw error;
}

// ECHO WHISPERS
export async function getEchoWhispers(userId: string) {
  const { data, error } = await supabase
    .from('echo_whispers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as EchoWhisper[];
}

export async function saveEchoWhisper(userId: string, whisper: EchoWhisper) {
  const { data, error } = await supabase
    .from('echo_whispers')
    .upsert({
      id: whisper.id,
      user_id: userId,
      moment: whisper.moment,
      timestamp: whisper.timestamp,
      created_at: whisper.created_at,
    })
    .select();

  if (error) throw error;
  return data[0] as EchoWhisper;
}

export async function deleteEchoWhisper(userId: string, whisperId: string) {
  const { error } = await supabase
    .from('echo_whispers')
    .delete()
    .eq('id', whisperId)
    .eq('user_id', userId);

  if (error) throw error;
}

// DAILY BOOST
export async function getDailyBoost(userId: string) {
  const { data, error } = await supabase
    .from('daily_boost')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function saveDailyBoost(userId: string, message: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_boost')
    .upsert({
      user_id: userId,
      date: today,
      message,
    })
    .select();

  if (error) throw error;
  return data[0];
}
