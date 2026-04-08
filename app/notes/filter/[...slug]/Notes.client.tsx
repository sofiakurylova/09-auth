'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import type { NoteTag } from '@/types/note';
import css from './Notes.module.css';

export default function NotesClient({ tag }: { tag?: string }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const filterTag = tag === 'all' || !tag ? undefined : (tag as NoteTag);

  const handleSearch = useDebouncedCallback((v) => { setDebouncedSearch(v); setPage(1); }, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['notes', filterTag, page, debouncedSearch],
    queryFn: () => fetchNotes({ tag: filterTag, page, search: debouncedSearch }),
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={(v) => { setSearch(v); handleSearch(v); }} />
        <Link href="/notes/action/create" className={css.button}>Create note +</Link>
      </div>
      {isLoading ? <p>Loading...</p> : data && <NoteList notes={data.notes} />}
      {data && data.totalPages > 1 && (
        <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={setPage} />
      )}
    </div>
  );
}
