import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

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
    const { author: username, content } = await request.json();

    if (!username || !content) {
      return NextResponse.json({ error: 'Username and content are required' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { username: username },
      update: {},
      create: {
        username: username,
        text: `Account @${username}`,
      },
    });

    const newPost = await prisma.post.create({
      data: {
        title: `Post by ${username}`,
        content: content,
        authorId: user.id,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}
