import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/jwtUtils";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = verifyAuthToken(token);

    if (!decoded) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // const userId = decoded.id;
    // const userEmail = decoded.email;
    // const username = decoded.username;

    return NextResponse.json({ message: "Access granted", user: decoded }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error verifying token:", error);
    if (error instanceof Error) {
        return NextResponse.json({ message: `Server error during token verification: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: "An unknown error occurred during token verification." }, { status: 500 });
  }
}