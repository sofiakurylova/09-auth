import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

interface Draft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: Draft;
  setDraft: (draft: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (newDraft) =>
        set((state) => ({
          draft: { ...state.draft, ...newDraft },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft-storage',
    }
  )
);
