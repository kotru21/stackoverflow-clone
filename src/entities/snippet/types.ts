export type User = { id: number; username: string; role: "user" | "admin" };

export type Snippet = {
  id: number;
  language: string;
  code: string;
  user: User;
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
  comments?: Comment[];
};

export type SnippetMark = "like" | "dislike" | "none";

export type Comment = {
  id: number;
  content: string;
  user: User;
};
