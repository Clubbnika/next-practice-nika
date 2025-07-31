import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY environment variable is not set. Please add it to your .env.local file.");
}

export interface SimpleJwtPayload {
  id: string;
  email: string;
  username: string;
}

export function generateSimpleAuthToken(payload: SimpleJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET_KEY as string, { expiresIn: '1h' });
}

export function verifyAuthToken(token: string): SimpleJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as SimpleJwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}