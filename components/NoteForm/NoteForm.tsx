'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NoteTag } from '@/types/note';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

const TAG_OPTIONS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(draft);
  };

  if (!isHydrated) return null;

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label>Title</label>
        <input className={css.input} value={draft.title} onChange={(e) => setDraft({ title: e.target.value })} />
      </div>
      <div className={css.formGroup}>
        <label>Content</label>
        <textarea className={css.textarea} rows={8} value={draft.content} onChange={(e) => setDraft({ content: e.target.value })} />
      </div>
      <div className={css.formGroup}>
        <label>Tag</label>
        <select className={css.select} value={draft.tag} onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}>
          {TAG_OPTIONS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>
      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>Cancel</button>
        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>Create note</button>
      </div>
    </form>
  );
}
