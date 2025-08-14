export type User = { id: number; username: string; role: "user" | "admin" };

export type Snippet = {
  id: number;
  language: string;
  code: string;
  user: User;
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
};

export type SnippetMark = "like" | "dislike" | "none";
