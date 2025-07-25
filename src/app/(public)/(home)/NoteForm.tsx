'use client';

import { useState } from 'react';
import { postNote } from '@/app/server-actions/post-note';
import type { INote } from '../../shared/types/note';

interface NoteFormProps {
  onNoteAdded: (note: INote) => void;
}

export function NoteForm({ onNoteAdded }: NoteFormProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (content.trim() === '') {
      alert('Message should not be empty!');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('author', author.trim());
    formData.append('content', content.trim());

    try {
      const newNote = await postNote(formData);
      if (newNote) {
        onNoteAdded(newNote);
        setContent('');
      } else {
        alert('Try again');
      }
    } catch (error) {
      console.error('Error loading message', error);
      alert('Error adding message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 mx-auto mb-3 max-w-100 border border-white/10 rounded-xl"
    >
      <input
        name="author"
        placeholder="Please wright the username..."
        className="text-white outline-none mb-2 bg-transparent w-full"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        disabled={isSubmitting}
      />
      <input
        name="content"
        placeholder="Wright the message..."
        className="text-white outline-none bg-transparent w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="text-black font-bold bg-white/80 rounded-xl p-1.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}