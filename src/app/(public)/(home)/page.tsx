import { NOTES } from "../../data/notes";
import { Note } from "./Note";
import { NoteForm } from "./NoteForm";

export default function Home() {
  return (
    <>
    <NoteForm />
      <div className="space-y-3 mx-auto max-w-100 pt-3 rounded-xl "
        style={{
          backgroundImage: 'url(background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100%'
        }}>
        {NOTES.map(note =>
          <Note
            key={note.author}
            note={note} />
        )}
      </div>
    </>
  );
}

