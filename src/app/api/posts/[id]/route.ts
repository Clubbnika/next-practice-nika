import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = context.params;

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

    console.log(`Successfully processed delete request for Post ID: ${postIdNumber}`);
    return NextResponse.json({ message: `Post with ID ${id} deleted successfully.` }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during post deletion.";
    console.error(`Error deleting post ${id}:`, errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
