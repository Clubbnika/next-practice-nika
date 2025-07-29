'use client';

import { useEffect, useState, useCallback } from 'react';
import { Note } from './Note';
import { NoteForm } from './NoteForm';

import type { PostType } from '@/app/shared/types/post.type';

export function Explore() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.statusText}`);
      }
      const data: PostType[] = await res.json();
      setPosts(data);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      setError('Failed loading posts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <NoteForm onPostSuccess={fetchPosts} />
      <div
        className="space-y-3 mx-auto max-w-100 pt-3 rounded-xl "
        style={{
          backgroundImage: 'url(background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        {isLoading && <p className="text-white text-center">Loading posts...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && posts.length === 0 && !error && (
          <p className="text-white text-center">There are no posts yet, be the first!</p>
        )}
        {posts.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    </>
  );
}
