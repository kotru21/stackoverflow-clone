export type User = {
  id: string | number;
  username: string;
  role: "user" | "admin";
};

export type Answer = {
  id: string | number;
  content: string;
  isCorrect: boolean;
};

export type Question = {
  id: string | number;
  title: string;
  description: string;
  attachedCode?: string;
  answers?: Answer[];
  user: User;
  isResolved?: boolean;
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
