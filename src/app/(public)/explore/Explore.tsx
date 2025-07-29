'use client';

import { useSearchParams } from 'next/navigation';

export function Explore() {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');

  return (
    <h1 className="m-7 font-bold text-white">
      Explore {!!tag && `by #${tag}`}
    </h1>
  );
}
