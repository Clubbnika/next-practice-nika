import { PAGES } from "@/app/config/pages.config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'ProfileFake'
}

export default function ProfileFake() {

  return (
    <div className="m-7 text-xl text-white">
      <h1 className="font-bold">
        Profile
      </h1>

      <Link 
      className="text-sm text-white/40"
      href={PAGES.HOME}>
        - Go to home
      </Link>
    </div>
  );
}