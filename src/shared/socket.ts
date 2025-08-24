import { io, type Socket } from "socket.io-client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Правильный доступ к Vite env
const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const isDev = import.meta.env.DEV;
const DEFAULT_PATH =
  API_BASE && API_BASE.startsWith("/api") ? "/api/socket.io" : "/socket.io";
const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined) ||
  (isDev ? "http://localhost:4000" : undefined);
const SOCKET_PATH =
  (import.meta.env.VITE_SOCKET_PATH as string | undefined) || DEFAULT_PATH;

let socketRef: Socket | null = null;

export function getSocket(): Socket {
  if (socketRef) return socketRef;
  socketRef = io(SOCKET_URL ?? window.location.origin, {
    path: SOCKET_PATH,
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket"],
  });
  if (isDev) {
    socketRef.on("connect", () => {
      console.log("[socket] connected", {
        id: socketRef?.id,
        url: SOCKET_URL,
        path: SOCKET_PATH,
      });
    });
    socketRef.io.on("error", (err) => {
      console.error("[socket] error", err);
    });
    socketRef.on("connect_error", (err) => {
      console.error("[socket] connect_error", err.message);
    });
  }
  return socketRef;
}

export function closeSocket() {
  if (socketRef) {
    socketRef.close();
    socketRef = null;
  }
}

// Хук для подписки на комментарии к сниппету
export function useSnippetComments(snippetId: number | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!snippetId) return;
    const socket = getSocket();
    const channel = `snippet:${snippetId}`;

    const onCreated = (payload: {
      snippetId?: number;
      id?: number;
      content?: string;
      user?: { username: string };
    }) => {
      if (payload?.snippetId === snippetId) {
        // Мгновенно оптимистично добавляем комментарий, если он ещё не в списке
        qc.setQueryData(["snippet", snippetId], (prev: unknown) => {
          if (!prev || typeof prev !== "object") return prev;
          const prevSnippet = prev as Record<string, unknown>;
          const comments = prevSnippet.comments as
            | Array<Record<string, unknown>>
            | undefined;
          const exists = comments?.some((c) => c.id === payload.id);
          if (exists) return prev;
          if (!payload.id) return prev;
          const newComment = {
            id: Number(payload.id),
            content: String(payload.content ?? ""),
            user: {
              id: 0,
              username: payload.user?.username || "unknown",
              role: "user",
            },
          };
          return {
            ...prevSnippet,
            comments: [...(comments || []), newComment],
            commentsCount: ((prevSnippet.commentsCount as number) || 0) + 1,
          };
        });
        // Триггерим актуализацию из API на всякий случай
        qc.invalidateQueries({ queryKey: ["snippet", snippetId] });
      }
    };

    socket.emit("join", channel);
    socket.on("comment:created", onCreated);

    return () => {
      socket.emit("leave", channel);
      socket.off("comment:created", onCreated);
    };
  }, [snippetId, qc]);
}

// Хук для подписки на ответы к вопросу
export function useQuestionAnswers(questionId: number | string | undefined) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!questionId) return;
    const socket = getSocket();
    const channel = `question:${questionId}`;

    const onAnswerCreated = (payload: {
      questionId?: number | string;
      id?: number | string;
      content?: string;
      user?: { username: string };
      isCorrect?: boolean;
    }) => {
      if (
        payload?.questionId &&
        String(payload.questionId) === String(questionId)
      ) {
        // Мгновенно оптимистично добавляем ответ, если он ещё не в списке
        qc.setQueryData(["question", questionId], (prev: unknown) => {
          if (!prev || typeof prev !== "object") return prev;
          const prevQuestion = prev as Record<string, unknown>;
          const answers = prevQuestion.answers as
            | Array<Record<string, unknown>>
            | undefined;
          const exists = answers?.some(
            (a) => String(a.id) === String(payload.id)
          );
          if (exists) return prev;
          if (!payload.id) return prev;
          const newAnswer = {
            id: payload.id,
            content: String(payload.content ?? ""),
            isCorrect: Boolean(payload.isCorrect ?? false),
            user: {
              id: 0,
              username: payload.user?.username || "unknown",
              role: "user",
            },
          };
          return {
            ...prevQuestion,
            answers: [...(answers || []), newAnswer],
          };
        });
        // Триггерим актуализацию из API на всякий случай
        qc.invalidateQueries({ queryKey: ["question", questionId] });
      }
    };

    const onAnswerStateChanged = (payload: {
      questionId?: number | string;
      answerId?: number | string;
      isCorrect?: boolean;
    }) => {
      if (
        payload?.questionId &&
        String(payload.questionId) === String(questionId)
      ) {
        // Обновляем статус ответа
        qc.setQueryData(["question", questionId], (prev: unknown) => {
          if (!prev || typeof prev !== "object") return prev;
          const prevQuestion = prev as Record<string, unknown>;
          const answers = prevQuestion.answers as
            | Array<Record<string, unknown>>
            | undefined;
          if (!answers) return prev;
          return {
            ...prevQuestion,
            answers: answers.map((answer) =>
              String(answer.id) === String(payload.answerId)
                ? { ...answer, isCorrect: Boolean(payload.isCorrect) }
                : answer
            ),
          };
        });
        // Триггерим актуализацию из API на всякий случай
        qc.invalidateQueries({ queryKey: ["question", questionId] });
      }
    };

    socket.emit("join", channel);
    socket.on("answer:created", onAnswerCreated);
    socket.on("answer:state_changed", onAnswerStateChanged);

    return () => {
      socket.emit("leave", channel);
      socket.off("answer:created", onAnswerCreated);
      socket.off("answer:state_changed", onAnswerStateChanged);
    };
  }, [questionId, qc]);
}

// Функция для отправки комментария к сниппету
export function emitSnippetComment(data: {
  content: string;
  snippetId: number;
  id?: number;
  user?: { username: string };
}) {
  try {
    const socket = getSocket();
    socket.emit("comment:create", {
      content: data.content,
      snippetId: data.snippetId,
      id: data.id,
      user: data.user,
    });
  } catch {
    // ignore socket emit errors
  }
}

// Функция для отправки ответа на вопрос
export function emitQuestionAnswer(data: {
  content: string;
  questionId: number | string;
  id?: number | string;
  user?: { username: string };
  isCorrect?: boolean;
}) {
  try {
    const socket = getSocket();
    socket.emit("answer:create", {
      content: data.content,
      questionId: data.questionId,
      id: data.id,
      user: data.user,
      isCorrect: data.isCorrect ?? false,
    });
  } catch {
    // ignore socket emit errors
  }
}

// Функция для отправки изменения статуса ответа
export function emitAnswerStateChange(data: {
  questionId: number | string;
  answerId: number | string;
  isCorrect: boolean;
}) {
  try {
    const socket = getSocket();
    socket.emit("answer:state_change", {
      questionId: data.questionId,
      answerId: data.answerId,
      isCorrect: data.isCorrect,
    });
  } catch {
    // ignore socket emit errors
  }
}
