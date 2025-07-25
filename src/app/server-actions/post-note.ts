'use server';

import { createNote } from '../../api/notes';
import type { INote } from '../shared/types/note';

export async function postNote(formData: FormData): Promise<INote | null> {
  const content = formData.get('content') as string;
  const author = formData.get('author') as string || 'Anonymous';

  if (!content || content.trim() === '') {
    console.error('Server Action: Content cannot be empty.');
    return null;
  }

  const newNoteData: Omit<INote, 'id'> = {
    author: author.trim(),
    text: content.trim(),
  };

  try {
    const createdNote = await createNote(newNoteData);
    console.log('Server Action: Note created successfully (mock):', createdNote);
    return createdNote;
  } catch (error) {
    console.error('Server Action: Failed to create note (mock):', error);
    return null;
  }
}