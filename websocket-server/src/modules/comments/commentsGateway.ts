import { WSServer } from "../core/server";

// Шлюз теперь не создаёт комментарии в API (нет токена), а лишь ретранслирует событие после того как клиент сам сохранил через HTTP.
export function registerCommentsGateway(server: WSServer) {
  server.io.on("connection", (socket) => {
    // Обработка создания комментариев
    socket.on(
      "comment:create",
      (data: {
        snippetId?: number;
        questionId?: number;
        id?: number;
        content?: string;
        user?: { username?: string };
      }) => {
        try {
          const room = data.snippetId
            ? `snippet:${data.snippetId}`
            : data.questionId
            ? `question:${data.questionId}`
            : undefined;
          const payload = {
            snippetId: data.snippetId,
            questionId: data.questionId,
            id: data.id,
            content: data.content,
            user: { username: data.user?.username || "unknown" },
          };
          if (room) {
            server.io.to(room).emit("comment:created", payload);
          } else {
            server.io.emit("comment:created", payload);
          }
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("comment:create relay failed", err);
          }
          socket.emit("comment:error", { message: "Relay failed" });
        }
      }
    );

    // Обработка создания ответов на вопросы
    socket.on(
      "answer:create",
      (data: {
        questionId?: number | string;
        id?: number | string;
        content?: string;
        user?: { username?: string };
        isCorrect?: boolean;
      }) => {
        try {
          const room = `question:${data.questionId}`;
          const payload = {
            questionId: data.questionId,
            id: data.id,
            content: data.content,
            user: { username: data.user?.username || "unknown" },
            isCorrect: data.isCorrect ?? false,
          };
          server.io.to(room).emit("answer:created", payload);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("answer:create relay failed", err);
          }
          socket.emit("answer:error", { message: "Relay failed" });
        }
      }
    );

    // Обработка изменения статуса ответа
    socket.on(
      "answer:state_change",
      (data: {
        questionId?: number | string;
        answerId?: number | string;
        isCorrect?: boolean;
      }) => {
        try {
          const room = `question:${data.questionId}`;
          const payload = {
            questionId: data.questionId,
            answerId: data.answerId,
            isCorrect: data.isCorrect,
          };
          server.io.to(room).emit("answer:state_changed", payload);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("answer:state_change relay failed", err);
          }
          socket.emit("answer:error", { message: "State change relay failed" });
        }
      }
    );
  });
}
