import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "../../../../lib/firebase";

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Email, password, and username are required." }, { status: 400 });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const newUserInDB = await prisma.user.create({
      data: {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        username: username,
        text: `Account for @${username}`,
      },
    });

    return NextResponse.json({ message: "User created successfully!", user: newUserInDB }, { status: 200 });
  } catch (error: unknown) {
    console.error("Register error:", error);

    if (error instanceof FirebaseError) {
      if (error.code === 'auth/email-already-in-use') {
        return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
      } else if (error.code === 'auth/weak-password') {
        return NextResponse.json({ error: "Password is too weak. Please use at least 6 characters." }, { status: 400 });
      } else {
        return NextResponse.json({ error: `Error Firebase: ${error.message}` }, { status: 500 });
      }
    } else if (error instanceof Error) {
      return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown server error occurred." }, { status: 500 });
    }
  }
}