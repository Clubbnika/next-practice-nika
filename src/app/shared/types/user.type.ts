import type { PostType } from "./post.type";

export interface Author {
  id: string;
  username: string;
  text?: string;
  email: string;
  password?: string;
  posts: PostType[];
}
