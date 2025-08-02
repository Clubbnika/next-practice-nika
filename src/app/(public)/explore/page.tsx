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

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('jwt_token');
    const storedUsername = localStorage.getItem('user_username');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setCurrentUserUsername(storedUsername);
      return token;
    } else {
      setIsLoggedIn(false);
      setCurrentUserUsername(null);
      return null;
    }
  }, []);

  const fetchPosts = useCallback(async (token: string | null) => {
    setLoadingPosts(true);
    setPostsError(null);
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401 && token) {
          throw new Error('Unauthorized: Invalid or expired session. Please log in again.');
        }
        throw new Error('Failed to fetch posts.');
      }

      const data: PostType[] = await response.json();
      setPosts(data);
    } catch (err: unknown) {
      console.error('Error fetching posts:', err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to load posts due to an unknown error.';
      setPostsError(errorMessage);

      if (token && errorMessage.includes('Unauthorized')) {
        setIsLoggedIn(false);
        setCurrentUserUsername(null);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_username');
        setPostsError('Your session has expired. Please log in again.');
      } else if (!token) {

        setPostsError(errorMessage);
      }
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    const token = checkAuthStatus();
    fetchPosts(token);
  }, [checkAuthStatus, fetchPosts]);

  const handlePostSuccess = useCallback(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      fetchPosts(token);
    }
  }, [fetchPosts]);

  const handleNoteDeleted = useCallback(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      fetchPosts(token);
    }
  }, [fetchPosts]);

  return (
    <>
      <EmojiRain />
      <div className={cn("flex flex-col gap-6 max-w-5xl mx-auto mt-20")}>
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col">
            {isLoggedIn ? (
              <>
                <p className="text-white font-bold text-center mb-6">Welcome, {currentUserUsername}! Share your thoughts:</p>
                <NoteForm
                  initialAuthor={currentUserUsername || ''}
                  isAuthorFieldDisabled={true}
                  onPostSuccess={handlePostSuccess}
                />
              </>
            ) : (
              <div className="p-4 border border-white/10 rounded-xl text-center mt-13">
                <p className="text-[#fff] font-bold text-lg mb-2">You are not logged in.</p>
                <p className="text-white/50">Log in to write your own posts!</p>
              </div>
            )}
          </div>
          <div className="flex-2 flex flex-col">
            <ExploreContent
              initialPosts={posts}
              isLoading={loadingPosts}
              error={postsError}
              currentUserUsername={currentUserUsername}
              onNoteDeleted={handleNoteDeleted}
            />
          </div>
        </div>
      </div>
    </>
  );
}