import { api } from './api';
import { cookies } from 'next/headers';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getAuthHeaders = async (): Promise<{ Cookie: string }> => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search, tag } = params;
  const headers = await getAuthHeaders();
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search && { search }),
      ...(tag && { tag }),
    },
    headers,
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, { headers });
  return response.data;
};

export const getMe = async (): Promise<User | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await api.get<User>('/users/me', { headers });
    return response.data;
  } catch {
    return null;
  }
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders();
    const response = await api.get('/auth/session', { headers });
    return response.status === 200;
  } catch {
    return false;
  }
};
