import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/jwtUtils';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const authorizationHeader = request.headers.get('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authorizationHeader.split(' ')[1];
    let decodedToken: { id: string; email: string; username: string } | null;

    try {
      decodedToken = verifyAuthToken(token);
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
    }

    const userId = decodedToken.id;

    const postId = Number(params.id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== userId) {
      return NextResponse.json({ error: 'Unauthorized: You can only delete your own posts' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error deleting post:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown server error occurred.' }, { status: 500 });
  }
}
