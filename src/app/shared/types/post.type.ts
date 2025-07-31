import type { Author } from "./user.type";

export interface PostType {
  id: number;
  title: string;
  content?: string;
  isPublished: boolean;
  author: Author;
  authorId: string;
  createdAt: Date;
}
