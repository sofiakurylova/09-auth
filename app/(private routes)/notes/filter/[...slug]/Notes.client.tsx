"use client";

import { Note } from "@/types/note";

export default function FilteredNotesClient({ notes }: { notes: Note[] }) {
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}
