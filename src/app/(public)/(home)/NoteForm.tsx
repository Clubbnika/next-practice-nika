import { postNote } from "@/app/server-actions/post-note";

export function NoteForm() {
  return (
    <>
      <form
        className="p-3 mx-auto mb-3 max-w-100 border border-white/10 rounded-xl"
      >
      <input
        name="content"
        placeholder="Please wright username..."
        className="text-white outline-none"
      />
      </form>
      <form action={postNote}
        className="p-3 mx-auto mb-3 max-w-100 border border-white/10 rounded-xl">

        <input
          name="content"
          placeholder="Wright some messages..."
          className="text-white bg-transparent outline-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="text-black font-bold bg-white/80 rounded-xl p-1.5"
          >
            Send
          </button>
        </div>
      </form>
    </>

  );
}