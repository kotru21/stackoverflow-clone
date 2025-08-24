import { useMemo } from "react";
import { useAuth } from "@/app/providers/useAuth";
import type { Question } from "../types";

export function useQuestionOwnership(question: Question | undefined) {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user || !question) return false;

    const questionUser = question.user;
    if (!questionUser) return false;

    return (
      String(user.id) === String(questionUser.id) ||
      user.username === questionUser.username
    );
  }, [user, question]);
}
