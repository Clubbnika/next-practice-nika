'use client';
import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="ml-7 p-5 font-bold bg-black">
      <nav className="flex items-center gap-4">
        <Link
          className={
            pathname === PAGES.HOME ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.HOME}
        >
          Home{' '}
        </Link>

        <div className='bg-white/20 h-5 w-[2px]'></div>

        <Link
          className={
            pathname === PAGES.POSTS ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.POSTS}
        >
          Posts{' '}
        </Link>

        <div className='bg-white/20 h-5 w-[2px]'></div>

        <Link
          className={
            pathname === PAGES.PROFILE_FAKE ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.PROFILE_FAKE}
        >
          Profile{' '}
        </Link>
      </nav>
      <div className="width-full h-[1px] mt-5 bg-white/10"></div>
    </header>
  );
}