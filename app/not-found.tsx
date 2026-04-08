import type { Metadata } from 'next';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: '404 - Page Not Found | NoteHub',
  description: 'The page you are looking for does not exist. Please check the URL or navigate back to the homepage.',
  openGraph: {
    title: '404 - Page Not Found | NoteHub',
    description: 'The page you are looking for does not exist. Please check the URL or navigate back to the homepage.',
    url: 'https://notehub.app/404',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '100px' }}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </main>
  );
}
