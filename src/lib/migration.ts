import { supabase } from './supabase';

const NOTES_KEY = 'philosopher_notes_v2';
const PROGRESS_KEY = 'completed_philosophers';
const MIGRATED_FLAG = 'supabase_migrated';

export async function migrateLocalStorageToSupabase(userId: string) {
  const isMigrated = localStorage.getItem(MIGRATED_FLAG);
  if (isMigrated === 'true') return { success: true, message: 'Already migrated' };

  try {
    // 1. Migrate Notes & Overrides
    const rawNotes = localStorage.getItem(NOTES_KEY);
    if (rawNotes) {
      const notesData = JSON.parse(rawNotes);
      for (const [phiId, data] of Object.entries(notesData) as [string, any][]) {
        // Upsert Notes
        if (data.userNotes && data.userNotes.length > 0) {
          const { error: noteError } = await supabase
            .from('user_notes')
            .upsert({
              user_id: userId,
              philosopher_id: phiId,
              content: data.userNotes
            });
          if (noteError) throw noteError;
        }

        // Upsert Overrides
        if (data.overrides && Object.keys(data.overrides).length > 0) {
          const { error: ovError } = await supabase
            .from('user_overrides')
            .upsert({
              user_id: userId,
              philosopher_id: phiId,
              content: data.overrides
            });
          if (ovError) throw ovError;
        }
      }
    }

    // 2. Migrate Progress
    const rawProgress = localStorage.getItem(PROGRESS_KEY);
    if (rawProgress) {
      const progressIds = JSON.parse(rawProgress) as string[];
      if (progressIds.length > 0) {
        const progressRows = progressIds.map(id => ({
          user_id: userId,
          philosopher_id: id
        }));
        
        const { error: progError } = await supabase
          .from('user_progress')
          .upsert(progressRows);
        
        if (progError) throw progError;
      }
    }

    // 3. Mark as migrated ONLY after full success
    localStorage.setItem(MIGRATED_FLAG, 'true');
    console.log('Migration to Supabase completed successfully');
    
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}
