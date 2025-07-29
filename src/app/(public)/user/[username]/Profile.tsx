'use client';

import { useParams } from 'next/navigation';

export function Profile() {
  const params = useParams<{ username: string }>();

  return (
    <div className="m-7 font-bold text-white">Profile @{params.username}</div>
  );
}
