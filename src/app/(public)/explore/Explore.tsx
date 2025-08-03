'use client';

import { Note } from './Note';
import cn from 'classnames';
import type { PostType } from '@/app/shared/types/post.type';
import { useCallback, useState } from 'react';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

interface ExploreContentProps {
  initialPosts: PostType[];
  isLoading: boolean;
  error: string | null;
  currentUserUsername: string | null;
  onNoteDeleted: () => void;
}

export function ExploreContent({ initialPosts, isLoading, error, currentUserUsername, onNoteDeleted }: ExploreContentProps) {
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'yourPosts'>('all');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const handleDeletePost = async (id: string) => {
    setDeletingNoteId(id);
    setDeleteError(null);

    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setDeleteError("You must be logged in to delete a post.");
      setDeletingNoteId(null);
      return;
    }

    const postIdNumber = Number(id);
    if (isNaN(postIdNumber)) {
      setDeleteError("Invalid post ID.");
      setDeletingNoteId(null);
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postIdNumber}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to delete post.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e: unknown) {
          console.error("Error parsing server error response:", e);
        }
        throw new Error(errorMessage);
      }

      onNoteDeleted();
    } catch (err: unknown) {
      const errorMessage = (err instanceof Error) ? err.message : 'Unknown error during post deletion.';
      setDeleteError(errorMessage);
    } finally {
      setDeletingNoteId(null);
    }
  };

  const getFilteredPosts = useCallback((allPosts: PostType[], filter: 'all' | 'yourPosts', currentUserUsername: string | null) => {
    if (filter === 'yourPosts' && currentUserUsername) {
      return allPosts.filter(post => post.author.username === currentUserUsername);
    }
    return allPosts;
  }, []);

  const handleSetFilter = (newFilter: 'all' | 'yourPosts') => {
    if (newFilter === 'yourPosts' && !currentUserUsername) {
      setAuthMessage("Log in to write and see your posts!");
      setFilter('all');
    } else {
      setAuthMessage(null);
      setFilter(newFilter);
    }
  };

  const filteredPosts = getFilteredPosts(initialPosts, filter, currentUserUsername);

  const showContent = !isLoading && !error && !deleteError && !authMessage;
  const showCenteredMessage = isLoading || error || deleteError || authMessage || (!isLoading && filteredPosts.length === 0);

  return (
    <>
      <div className="flex justify-end space-x-4 mb-4">
        <button
          className={cn('text-white/80 px-4 py-2 font-bold text-sm rounded', { 'bg-[#78a068] text-black': filter === 'all' && !authMessage })}
          onClick={() => handleSetFilter('all')}
        >
          All Posts
        </button>
        <button
          className={cn('text-white/80 px-4 py-2 font-bold text-sm rounded', { 'bg-[#78a068] text-black': filter === 'yourPosts' && !authMessage })}
          onClick={() => handleSetFilter('yourPosts')}
        >
          Your Posts
        </button>
      </div>
      
      <div
        className={cn("space-y-3 pt-3 rounded-t-xl w-full pb-3 min-h-[520px] flex justify-center items-center", {
          'hidden': !showCenteredMessage
        })}
        style={{
          backgroundImage: 'url(background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 'full',
        }}
      >
        {isLoading && <Spinner variant='ellipsis' size={100} className="text-black" />}
        {(error || deleteError) && (
          <p className="text-red-500 text-center">Error: {error || deleteError}</p>
        )}
        {authMessage && (
          <p className="text-black font-bold text-center">{authMessage}</p>
        )}
        {!isLoading && !authMessage && filteredPosts.length === 0 && !error && !deleteError && (
          <p className="text-white text-center">No posts yet. Be the first to write one!</p>
        )}
      </div>

      <div
        className={cn("space-y-3 pt-3 rounded-t-xl w-full pb-3 min-h-[520px]", {
          'hidden': showCenteredMessage,
          'flex flex-col': showContent
        })}
        style={{
          backgroundImage: 'url(background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 'full',
        }}
      >
        {showContent && filteredPosts.map((note) => (
          <Note
            key={note.id}
            note={note}
            currentUserUsername={currentUserUsername}
            onDelete={handleDeletePost}
            isDeleting={deletingNoteId === note.id.toString()}
          />
        ))}
      </div>
    </>
  );
}
