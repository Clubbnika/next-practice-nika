'use client';

import { useState, useEffect } from 'react';
import { postNote } from '@/app/server-actions/post-note';

interface NoteFormProps {
  onPostSuccess?: () => void;
  initialAuthor?: string;
  isAuthorFieldDisabled?: boolean;
}

export function NoteForm({ onPostSuccess, initialAuthor, isAuthorFieldDisabled = false }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(initialAuthor || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (initialAuthor) {
      setAuthor(initialAuthor);
    }
  }, [initialAuthor]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (isSubmitting) return;

    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Please write something!' });
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = await postNote({ content });

      if (newPost) {
        setMessage({ type: 'success', text: 'Post successfully added!' });
        setContent('');
        if (onPostSuccess) {
          onPostSuccess();
        }
      } else {
        setMessage({ type: 'error', text: 'Something went wrong while creating the post.' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage({ type: 'error', text: (error as Error).message || 'Something went wrong while creating the post.' }); // Краще виводити message з помилки
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 mx-auto mb-3 max-w-lg border border-white/10 rounded-xl hover:shadow shadow-white/30">
      <input
        name="author"
        placeholder="Please write your username..."
        className="text-white outline-none border border-white/10 p-3 rounded-xl w-full mb-3 placeholder-gray-400"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        disabled={isSubmitting || isAuthorFieldDisabled}
      />

      <textarea
        name="content"
        placeholder="Write the post..."
        className="text-white outline-none border border-white/10 p-3 rounded-xl w-full mb-3 placeholder-gray-400 h-24 resize-y"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />

      {message && (
        <p className={`text-center mb-3 ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
          {message.text}
        </p>
      )}

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="text-black font-bold bg-white rounded-xl p-2 px-4 hover:bg-white/80 transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}