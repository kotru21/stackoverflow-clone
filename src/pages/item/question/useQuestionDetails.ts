import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useSetAnswerState,
  useUpdateAnswer,
  useDeleteAnswer,
} from "@/entities/question/api";
import { useAnswerForm, useQuestionOwnership } from "@/entities/question/hooks";
import {
  useQuestionAnswers,
  emitAnswerUpdate,
  emitAnswerDelete,
} from "@/shared/socket";
import type { QuestionState } from "../hooks/itemTypes";
import { emitNotification } from "@/shared/notifications";
import { deriveEntityAccessState } from "../utils/queryErrorState";

export function useQuestionDetails(id?: string): QuestionState {
  const navigate = useNavigate();
  const query = useQuestion(id);
  const { data: questionData, status } = query;
  useQuestionAnswers(id);
  const answerForm = useAnswerForm(id || "0");
  const isOwner = useQuestionOwnership(questionData);
  const setAnswerStateMut = useSetAnswerState(id || "0");
  const updateAnswerMut = useUpdateAnswer(id || "0");
  const deleteAnswerMut = useDeleteAnswer(id || "0");
  const updateQuestionMut = useUpdateQuestion(id || "0");
  const deleteQuestionMut = useDeleteQuestion(id || "0");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editQCode, setEditQCode] = useState("");

  const startEdit = () => {
    if (questionData) {
      setEditTitle(questionData.title);
      setEditDescription(questionData.description);
      setEditQCode(questionData.attachedCode || "");
    }
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const loading = status === "pending";
  const { notFound, forbidden } = deriveEntityAccessState(query);

  useEffect(() => {
    if (forbidden) {
      emitNotification({
        type: "error",
        message: "Нет прав для просмотра вопроса",
      });
    }
  }, [forbidden]);

  const mappedQuestion = useMemo(
    () =>
      questionData
        ? {
            title: questionData.title,
            description: questionData.description,
            attachedCode: questionData.attachedCode,
            answers: questionData.answers,
          }
        : undefined,
    [questionData]
  );

  const saveEdit = useCallback(async () => {
    try {
      await updateQuestionMut.mutateAsync({
        title: editTitle,
        description: editDescription,
        attachedCode: editQCode,
      });
      setIsEditing(false);
    } catch {
      emitNotification({
        type: "error",
        message: "Не удалось сохранить изменения",
      });
    }
  }, [editTitle, editDescription, editQCode, updateQuestionMut]);

  const deleteItem = useCallback(async () => {
    if (!confirm("Удалить вопрос?")) return;
    try {
      await deleteQuestionMut.mutateAsync();
      navigate("/my?mode=questions");
    } catch {
      emitNotification({
        type: "error",
        message: "Не удалось удалить вопрос",
      });
    }
  }, [deleteQuestionMut, navigate]);

  const markCorrect = useCallback(
    (answerId: string | number) => {
      if (!isOwner) return;
      setAnswerStateMut.mutate({ answerId, state: "correct" });
    },
    [isOwner, setAnswerStateMut]
  );

  const markIncorrect = useCallback(
    (answerId: string | number) => {
      if (!isOwner) return;
      setAnswerStateMut.mutate({ answerId, state: "incorrect" });
    },
    [isOwner, setAnswerStateMut]
  );

  const updateAnswer = useCallback(
    (answerId: string | number, content: string) =>
      updateAnswerMut.mutate(
        { answerId, content },
        {
          onSuccess: () =>
            emitAnswerUpdate({
              questionId: id || "0",
              answerId,
              content,
            }),
        }
      ),
    [id, updateAnswerMut]
  );

  const deleteAnswer = useCallback(
    (answerId: string | number) =>
      deleteAnswerMut.mutate(answerId, {
        onSuccess: () => emitAnswerDelete({ questionId: id || "0", answerId }),
      }),
    [id, deleteAnswerMut]
  );

  return {
    mode: "question",
    loading,
    notFound,
    error: forbidden ? "Недостаточно прав" : undefined,
    isOwner,
    isEditing,
    startEdit,
    cancelEdit,
    saveEdit,
    saving: updateQuestionMut.isPending,
    deleteItem,
    deleting: deleteQuestionMut.isPending,
    question: mappedQuestion,
    edit: {
      title: editTitle,
      description: editDescription,
      code: editQCode,
      setTitle: setEditTitle,
      setDescription: setEditDescription,
      setCode: setEditQCode,
    },
    answerForm,
    markPending: setAnswerStateMut.isPending,
    markCorrect,
    markIncorrect,
    updateAnswer,
    deleteAnswer,
  } as const;
}

export default useQuestionDetails;
