import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/jwtUtils';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error: unknown) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const usernameFromToken = decodedToken.username;

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found in database.' }, { status: 404 });
    }

    const newPost = await prisma.post.create({
      data: {
        title: `Post by ${usernameFromToken}`,
        content: content,
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown server error occurred.' }, { status: 500 });
  }
}
