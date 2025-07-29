'use client';
import Link from 'next/link';
import { PAGES } from '../config/pages.config';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="ml-7 m-3 font-bold">
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
            pathname === PAGES.EXPLORE ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.EXPLORE}
        >
          Explore |{' '}
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
      <div className="width-full h-[1px] mt-3 bg-white/10"></div>
    </header>
  );
}
