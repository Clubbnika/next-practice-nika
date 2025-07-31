import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSimpleAuthToken } from "@/lib/jwtUtils";
import { auth } from "../../../../lib/firebase";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const dbUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User profile not found in database. Please contact support." }, { status: 404 });
    }

    const token = generateSimpleAuthToken({
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username || ''
    });

    return NextResponse.json({ message: "Login successful!", user: dbUser, token }, { status: 200 });

  } catch (error: unknown) {
    console.error("Login error:", error);

    if (error instanceof FirebaseError) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      } else if (error.code === 'auth/invalid-email') {
        return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
      } else {
        return NextResponse.json({ error: `Firebase Error: ${error.message}` }, { status: 500 });
      }
    } else if (error instanceof Error) {
      return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown server error occurred." }, { status: 500 });
    }
  }
}
