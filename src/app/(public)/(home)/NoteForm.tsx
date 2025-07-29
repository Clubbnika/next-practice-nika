'use client';

import { useState } from 'react';
import { postNote } from '@/app/server-actions/post-note';
import { useRouter } from 'next/navigation';

interface NoteFormProps {
  onPostSuccess?: () => void;
}

export function NoteForm({ onPostSuccess }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (isSubmitting) return;

    if (!content.trim()) {
      setMessage({ type: 'error', text: 'Please write something!' });
      return;
    }
    if (!author.trim()) {
      setMessage({ type: 'error', text: 'Please enter your username!' });
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = await postNote({ author, content });

      if (newPost) {
        setMessage({ type: 'success', text: 'Post succesfully added!' });
        setContent('');
        setAuthor('');
        if (onPostSuccess) {
          onPostSuccess();
        }

      } else {
        setMessage({ type: 'error', text: 'Something went wrong while creating the post.' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage({ type: 'error', text: 'Помилка при створенні посту.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 mx-auto mb-3 max-w-100 border border-white/10 rounded-xl hover:shadow shadow-white/30">
      <input
        name="author"
        placeholder="Введіть ваше ім'я користувача..."
        className="text-white outline-none border border-white/10 p-3 rounded-xl w-full mb-3 placeholder-gray-400"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        disabled={isSubmitting}
      />

      <textarea
        name="content"
        placeholder="Напишіть ваш пост..."
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
          className="text-black font-bold bg-white/80 rounded-xl p-2 px-4 hover:bg-white transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
