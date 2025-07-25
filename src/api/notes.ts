import type { INote } from "@/app/shared/types/note";

const mockNotes: INote[] = [
  {
    id: 1,
    author: 'Nika',
    text: 'Learning next'
  },
  {
    id: 2,
    author: 'Youra',
    text: 'Learning next'
  },
  {
    id: 3,
    author: 'Denis',
    text: 'Ya molodec!'
  },
  {
    id: 4,
    author: 'Nastya',
    text: 'Anatoliy, i give you 3 points'
  },
  {
    id: 5,
    author: 'Lida',
    text: 'Learning next'
  },
  {
    id: 6,
    author: 'Anya',
    text: 'Learning next'
  }
];

let nextId = Math.max(...mockNotes.map(n => n.id)) + 1 || 1;

function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export const getNotes = async (): Promise<INote[]> => {
  await wait(500);
  console.log('Mock API: Fetching notes:', mockNotes);
  return [...mockNotes];
};


export const createNote = async (newNoteData: Omit<INote, 'id'>): Promise<INote> => {
  await wait(700);

  const createdNote: INote = {
    id: nextId++,
    ...newNoteData,
  };

  mockNotes.unshift(createdNote);
  console.log('Mock API: Note created:', createdNote, 'Current notes:', mockNotes);
  return createdNote;
};
