export interface CommentDto {
  id: number;
  content: string;
  user: { id?: number; username: string };
  snippetId?: number;
  questionId?: number;
  createdAt?: string;
}

export type WSMessage<T extends string = string, P = unknown> = {
  type: T;
  payload: P;
};
