'use client';

import { useState, useEffect, useCallback } from 'react';
import { Note } from './Note';
import { NoteForm } from './NoteForm';
import { getNotes } from '@/api/notes';
import type { INote } from '../../shared/types/note';

export default function Home() {
  const [notes, setNotes] = useState<INote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (err) {
        console.error("Error loading messages:", err);
        setError("Error loading messages, try again");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteAdded = useCallback((newNote: INote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  }, []);

  return (
    <>
      <NoteForm onNoteAdded={handleNoteAdded} />
      <div
        className="space-y-3 mx-auto max-w-100 pt-3 rounded-xl"
        style={{
          backgroundImage: 'url(background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {isLoading && <p className="text-white text-center">Loading messages...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && notes.length === 0 && !error && (
          <p className="text-white text-center">Haven`t any messages, you can be the first!</p>
        )}
        {!isLoading && notes.length > 0 && (
          notes.map((note) => (
            <Note
              key={note.id}
              note={note}
            />
          ))
        )}
      </div>
    </>
  );
}