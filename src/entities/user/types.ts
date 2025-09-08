export type Role = "user" | "admin";

export type User = {
  id: number;
  username: string;
  role: Role;
};

export type UserStatistic = {
  snippetsCount: number;
  rating: number;
  commentsCount: number;
  likesCount: number;
  dislikesCount: number;
  questionsCount: number;
  correctAnswersCount: number;
  regularAnswersCount: number;
};
