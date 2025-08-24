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
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] recv comment:create", data);
          }
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
            if (process.env.NODE_ENV !== "production") {
              console.log("[ws] broadcast comment:created ->", room, payload);
            }
            server.io.to(room).emit("comment:created", payload);
          } else {
            if (process.env.NODE_ENV !== "production") {
              console.log("[ws] broadcast comment:created (global)", payload);
            }
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

    // Обработка обновления комментария
    socket.on(
      "comment:update",
      (data: {
        snippetId?: number;
        questionId?: number;
        id?: number | string;
        content?: string;
      }) => {
        try {
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] recv comment:update", data);
          }
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
          };
          if (room) {
            if (process.env.NODE_ENV !== "production") {
              console.log("[ws] broadcast comment:updated ->", room, payload);
            }
            server.io.to(room).emit("comment:updated", payload);
          } else {
            if (process.env.NODE_ENV !== "production") {
              console.log("[ws] broadcast comment:updated (global)", payload);
            }
            server.io.emit("comment:updated", payload);
          }
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("comment:update relay failed", err);
          }
          socket.emit("comment:error", { message: "Update relay failed" });
        }
      }
    );

    // Обработка удаления комментария
    socket.on(
      "comment:delete",
      (data: {
        snippetId?: number;
        questionId?: number;
        id?: number | string;
      }) => {
        try {
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] recv comment:delete", data);
          }
          const room = data.snippetId
            ? `snippet:${data.snippetId}`
            : data.questionId
            ? `question:${data.questionId}`
            : undefined;
          const payload = {
            snippetId: data.snippetId,
            questionId: data.questionId,
            id: data.id,
          };
          if (room) {
            if (process.env.NODE_ENV !== "production") {
              console.log("[ws] broadcast comment:deleted ->", room, payload);
            }
            server.io.to(room).emit("comment:deleted", payload);
          } else {
            if (process.env.NODE_ENV !== "production") {
              console.log("[ws] broadcast comment:deleted (global)", payload);
            }
            server.io.emit("comment:deleted", payload);
          }
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("comment:delete relay failed", err);
          }
          socket.emit("comment:error", { message: "Delete relay failed" });
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
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] recv answer:create", data);
          }
          const room = `question:${data.questionId}`;
          const payload = {
            questionId: data.questionId,
            id: data.id,
            content: data.content,
            user: { username: data.user?.username || "unknown" },
            isCorrect: data.isCorrect ?? false,
          };
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] broadcast answer:created ->", room, payload);
          }
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
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] recv answer:state_change", data);
          }
          const room = `question:${data.questionId}`;
          const payload = {
            questionId: data.questionId,
            answerId: data.answerId,
            isCorrect: data.isCorrect,
          };
          if (process.env.NODE_ENV !== "production") {
            console.log(
              "[ws] broadcast answer:state_changed ->",
              room,
              payload
            );
          }
          server.io.to(room).emit("answer:state_changed", payload);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("answer:state_change relay failed", err);
          }
          socket.emit("answer:error", { message: "State change relay failed" });
        }
      }
    );

    // Обработка обновления ответа
    socket.on(
      "answer:update",
      (data: {
        questionId?: number | string;
        answerId?: number | string;
        content?: string;
      }) => {
        try {
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] recv answer:update", data);
          }
          const room = `question:${data.questionId}`;
          const payload = {
            questionId: data.questionId,
            answerId: data.answerId,
            content: data.content,
          };
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] broadcast answer:updated ->", room, payload);
          }
          server.io.to(room).emit("answer:updated", payload);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("answer:update relay failed", err);
          }
          socket.emit("answer:error", { message: "Update relay failed" });
        }
      }
    );

    // Обработка удаления ответа
    socket.on(
      "answer:delete",
      (data: { questionId?: number | string; answerId?: number | string }) => {
        try {
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] recv answer:delete", data);
          }
          const room = `question:${data.questionId}`;
          const payload = {
            questionId: data.questionId,
            answerId: data.answerId,
          };
          if (process.env.NODE_ENV !== "production") {
            console.log("[ws] broadcast answer:deleted ->", room, payload);
          }
          server.io.to(room).emit("answer:deleted", payload);
        } catch (err) {
          if (process.env.NODE_ENV !== "production") {
            console.error("answer:delete relay failed", err);
          }
          socket.emit("answer:error", { message: "Delete relay failed" });
        }
      }
    );
  });
}
