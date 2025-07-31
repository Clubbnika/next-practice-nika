'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { NoteForm } from './NoteForm';
import { ExploreContent } from './Explore';
import cn from 'classnames';

import type { PostType } from '@/app/shared/types/post.type';
import { EmojiRain } from '@/components/EmojiRain';

export default function ExplorePage() {
  const [currentUserUsername, setCurrentUserUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setPostsError(null);
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data: PostType[] = await response.json();
      setPosts(data);
    } catch (err: unknown) {
      console.error('Error fetching posts:', err);
      setPostsError((err instanceof Error) ? err.message : 'Failed to load posts.');
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const storedUsername = localStorage.getItem('user_username');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setCurrentUserUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setCurrentUserUsername(null);
    }

    fetchPosts();
  }, [fetchPosts]);

  const handlePostSuccess = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <EmojiRain />
      <div
        className={cn("flex flex-col gap-6 max-w-5xl mx-auto mt-2")}
      >
        <h1 className="text-white text-3xl font-bold text-left mb-8">Explore Posts</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            <h2 className="text-white/50 font-bold text-left mb-4">All Posts</h2>
            <ExploreContent posts={posts} isLoading={loadingPosts} error={postsError} />
          </div>

          <div className="flex-1 flex flex-col">
            {isLoggedIn ? (
              <>
                <p className="text-white font-bold text-center mb-4">Welcome, {currentUserUsername}! Share your thoughts:</p>
                <NoteForm
                  initialAuthor={currentUserUsername || ''}
                  isAuthorFieldDisabled={true}
                  onPostSuccess={handlePostSuccess}
                />
              </>
            ) : (
              <div className="p-4 border border-blue-400 rounded-xl bg-blue-900/20 text-center mb-8">
                <p className="text-white text-lg mb-2">You are not logged in.</p>
                <p className="text-blue-200">Log in to write your own posts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
