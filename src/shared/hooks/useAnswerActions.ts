import { useSetAnswerState } from "../../entities/question/api";
import { emitAnswerStateChange } from "../socket";

export function useAnswerActions(questionId: string | number) {
  const { mutateAsync: setAnswerState, isPending } =
    useSetAnswerState(questionId);

  const markCorrect = async (answerId: string | number) => {
    try {
      await setAnswerState({ answerId, state: "correct" });
      emitAnswerStateChange({
        questionId,
        answerId,
        isCorrect: true,
      });
    } catch (error) {
      console.error("Ошибка при изменении статуса ответа:", error);
      throw error;
    }
  };

  const markIncorrect = async (answerId: string | number) => {
    try {
      await setAnswerState({ answerId, state: "incorrect" });
      emitAnswerStateChange({
        questionId,
        answerId,
        isCorrect: false,
      });
    } catch (error) {
      console.error("Ошибка при изменении статуса ответа:", error);
      throw error;
    }
  };

  return {
    markCorrect,
    markIncorrect,
    isPending,
  };
}
