import type { Answer } from "@/entities/question/types";
import type { useAnswerForm } from "@/entities/question/hooks";
import type { useCommentForm } from "@/entities/snippet/hooks";

export type Mode = "question" | "snippet";

export interface BaseState {
  mode: Mode;
  loading: boolean;
  notFound: boolean;
  error?: string;
  isOwner: boolean;
  isEditing: boolean;
  startEdit(): void;
  cancelEdit(): void;
  saveEdit(): Promise<void> | void;
  saving: boolean;
  deleteItem(): Promise<void> | void;
  deleting: boolean;
}

export interface QuestionState extends BaseState {
  mode: "question";
  question?: {
    title: string;
    description: string;
    attachedCode?: string;
    answers?: Answer[];
  };
  edit: {
    title: string;
    description: string;
    code: string;
    setTitle(v: string): void;
    setDescription(v: string): void;
    setCode(v: string): void;
  };
  answerForm?: ReturnType<typeof useAnswerForm>;
  markPending: boolean;
  markCorrect(id: string | number): void;
  markIncorrect(id: string | number): void;
  updateAnswer(id: string | number, content: string): void;
  deleteAnswer(id: string | number): void;
}

export interface SnippetState extends BaseState {
  mode: "snippet";
  snippet?: {
    id: number;
    language: string;
    code: string;
    likesCount?: number;
    dislikesCount?: number;
    commentsCount?: number;
    user?: { username?: string };
    comments?: {
      id: number | string;
      content: string;
      user?: { username?: string };
    }[];
  };
  edit: {
    language: string;
    code: string;
    setLanguage(v: string): void;
    setCode(v: string): void;
  };
  commentForm?: ReturnType<typeof useCommentForm>;
  updateComment(id: number | string, content: string): void;
  deleteComment(id: number | string): void;
}

export type ItemState = QuestionState | SnippetState;
