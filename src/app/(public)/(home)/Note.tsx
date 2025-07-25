import Link from "next/link";
import type { INote } from "../../shared/types/note"
import { PAGES } from "@/app/config/pages.config";

interface Props {
  note: INote;
}

export function Note({ note }: Props) {
  return (
  <div className="border-1 w-fit m-3 pr-3 pb-1 rounded-tr-xl rounded-tl-xl rounded-br-xl border-[#b1d1ae] bg-[#f0fedd]">
    <Link href={PAGES.PROFILE(note.author)} className="text-xs ml-3 text-[#78a068] font-bold">
      {note.author}
    </Link>

    <p className="text-xl ml-3 text-[#040b04d9]">
      {note.text}
    </p>
  </div>
  ) 
}