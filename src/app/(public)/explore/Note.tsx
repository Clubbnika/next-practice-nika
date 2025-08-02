'use client';

import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import type { PostType } from '@/app/shared/types/post.type';
import { Trash2, X } from 'lucide-react';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import cn from 'classnames';

interface NoteProps {
  note: PostType;
  currentUserUsername: string | null;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function Note({ note, currentUserUsername, onDelete, isDeleting }: NoteProps) {
  const isAuthor = currentUserUsername && currentUserUsername === note.author.username;

  return (
    <div className="relative border-1 max-w-100 m-3 pr-3 pb-1 rounded-tr-xl rounded-tl-xl rounded-br-xl border-[#b1d1ae] bg-[#f0fedd]">
      {isAuthor && (
        <button
          onClick={() => onDelete(note.id.toString())}
          disabled={isDeleting}
          className={cn(
            "absolute top-1 right-1 p-2 rounded-full text-[#78a068] font-bold hover:bg-[#78a068]/15 transition-colors",
            { "cursor-not-allowed opacity-50": isDeleting }
          )}
        >
          {isDeleting ? <Spinner variant='circle' size={16} /> : <X size={16} />}
        </button>
      )}

      <Link
        href={PAGES.PROFILE(note.author.username)}
        className="text-xs ml-3 text-[#78a068] font-bold"
      >
        {note.author.username}
      </Link>

      <p className="text-xl ml-3 text-[#040b04d9]">{note.content}</p>
      <p className="text-xs text-right text-[#78a068]">
        {new Date(note.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
