'use client';

import { Note } from './Note';
import cn from 'classnames';

import type { PostType } from '@/app/shared/types/post.type';

interface ExploreContentProps {
  posts: PostType[];
  isLoading: boolean;
  error: string | null;
}

export function ExploreContent({ posts, isLoading, error }: ExploreContentProps) {
  return (
    <div
      className={cn("space-y-3 pt-3 rounded-t-xl w-full pb-3 min-h-110")}
      style={{
        backgroundImage: 'url(background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 'full',
      }}
    >
      {isLoading && <p className="text-white text-center">Loading posts...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
      {!isLoading && posts.length === 0 && !error && (
        <p className="text-white text-center">No posts yet. Be the first to write one!</p>
      )}
      {posts.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
}
