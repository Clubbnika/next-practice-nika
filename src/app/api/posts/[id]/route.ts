import { NextRequest, NextResponse } from 'next/server';

// ВИДАЛІТЬ ЦЕЙ ІНТЕРФЕЙС, він нам більше не потрібен тут
// interface RouteContext {
//   params: {
//     id: string;
//   };
// }

export async function DELETE(
  request: NextRequest, // Перший аргумент - об'єкт запиту
  // ЗМІНЮЄМО ТИП ДРУГОГО АРГУМЕНТУ НА ПРЯМИЙ ОБ'ЄКТНИЙ ТИП:
  context: { params: { id: string } } // <--- Ось тут виправлення
) {
  const { id } = context.params; // Доступ до id через context.params

  try {
    const postIdNumber = Number(id);
    if (isNaN(postIdNumber)) {
      return NextResponse.json({ error: "Invalid post ID provided." }, { status: 400 });
    }

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: "Authentication required to delete posts." }, { status: 401 });
    }

    // TODO: Додайте тут вашу реальну логіку видалення поста з бази даних.
    console.log(`Successfully processed delete request for Post ID: ${postIdNumber}`);
    return NextResponse.json({ message: `Post with ID ${id} deleted successfully.` }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during post deletion.";
    console.error(`Error deleting post ${id}:`, errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}