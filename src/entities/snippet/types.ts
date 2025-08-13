export type User = { id: number; username: string; role: "user" | "admin" };

export type Snippet = {
  id: number;
  language: string;
  code: string;
  user: User;
  // Optional aggregate fields if backend provides them
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
};

export type PaginatedMeta = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginatedMeta;
};

export type SnippetMark = "like" | "dislike" | "none";
