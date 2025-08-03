'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/app/shared/types/user-avatar';
import { EmojiRain } from '@/components/EmojiRain';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const storedUsername = localStorage.getItem('user_username');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername(null);
    }
  }, [router]);

  const handleLoginRedirect = () => {
    router.push('/');
  };

  return (
    <>
    <EmojiRain />
    <div className={cn("flex flex-col gap-6 max-w-lg mx-auto mt-10 text-white text-center")}>
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      {isLoggedIn ? (
        <div className="p-8 border border-white/20 rounded-xl">
          <div className='flex justify-center mb-3'>
          <UserAvatar alt='Avatar icon' src='/avatar.png' width={60} height={60}/>
          </div>
          <p className="text-xl mb-4">Welcome to your profile, {username}!</p>
          <p className="text-white/60 text-sm">This is your personal profile content.</p>
        </div>
      ) : (
        <div className="p-8 border border-red-400 rounded-xl bg-red-900/20">
          <p className="text-xl mb-4 text-red-300">You are not logged in.</p>
          <p className="text-red-200 mb-6">Please log in to view your profile.</p>
          <Button onClick={handleLoginRedirect} className="w-full max-w-xs mx-auto bg-red-600 hover:bg-red-700">
            Go to Login
          </Button>
        </div>
      )}
    </div>
      </>
  );
}
