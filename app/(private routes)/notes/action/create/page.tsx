import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Create Note | NoteHub',
  description: 'Create a new note on NoteHub. Add a title, content, and tag to organize your thoughts.',
  openGraph: {
    title: 'Create Note | NoteHub',
    description: 'Create a new note on NoteHub. Add a title, content, and tag to organize your thoughts.',
    url: 'https://notehub.app/notes/action/create',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
