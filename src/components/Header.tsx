'use client';
import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="ml-7 m-5 font-bold bg-black">
      <nav>
        <Link
          className={
            pathname === PAGES.HOME ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.HOME}
        >
          Home |{' '}
        </Link>

        <Link
          className={
            pathname === PAGES.POSTS ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.POSTS}
        >
          Posts |{' '}
        </Link>

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
