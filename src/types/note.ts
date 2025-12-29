export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;  // ISO date string from API
  updatedAt: string;  // ISO date string from API
}

// type used for delete / queries if needed
export type NoteId = Note['id'];

// type used to create a new note (POST request)
export type NotePost = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;