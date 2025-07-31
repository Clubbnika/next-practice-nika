'use client';

import { useState, useEffect } from 'react';
import { NoteForm } from './NoteForm';
import { useRouter } from 'next/navigation';
import { Explore } from './Explore';

export default function ExplorePage() {
  const [currentUserUsername, setCurrentUserUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('user_username');
    const token = localStorage.getItem('jwt_token');

    if (username && token) {
      setCurrentUserUsername(username);
    } else {
      router.push('/');
    }
  }, [router]);

  if (currentUserUsername === null) {
    return <div className="text-white text-center mt-20">Loading user data...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto mt-10">
      <h1 className="text-white text-3xl font-bold text-center">Welcome, {currentUserUsername}!</h1>
      <p className="text-white text-center">Share your thoughts:</p>
      <NoteForm
        initialAuthor={currentUserUsername}
        isAuthorFieldDisabled={true}
        onPostSuccess={() => {
          console.log('Post added successfully, user:', currentUserUsername);
        }}
      />
      <div className="text-white text-center mt-10">
        <Explore />
      </div>
    </div>
  );
}
