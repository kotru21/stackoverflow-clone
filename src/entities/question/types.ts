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

export type CreateQuestionDto = {
  title: string;
  description: string;
  attachedCode?: string;
};
