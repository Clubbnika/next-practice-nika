import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import type { PostType } from '@/app/shared/types/post.type';

interface Props {
  note: PostType;
}

export function Note({ note }: Props) {
  console.log(note);

  return (
    <div className="border-1 max-w-100 m-3 pr-3 pb-1 rounded-tr-xl rounded-tl-xl rounded-br-xl border-[#b1d1ae] bg-[#f0fedd]">
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