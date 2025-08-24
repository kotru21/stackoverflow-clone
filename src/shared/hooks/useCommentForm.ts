import { useState } from "react";
import { http, toHttpError } from "../api/http";
import { useQueryClient } from "@tanstack/react-query";
import { emitSnippetComment } from "../socket";
import { useAuth } from "../../app/providers/useAuth";

export function useCommentForm(snippetId: number) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const qc = useQueryClient();

  const submit = async () => {
    setError(null);
    setOk(null);
    setPending(true);

    try {
      const res = await http.post("/comments", { content, snippetId });

      // Пытаемся вытащить id из API ответа
      let createdId: number | undefined;
      const rawUnknown: unknown = res.data;
      if (rawUnknown && typeof rawUnknown === "object") {
        const rawObj = rawUnknown as Record<string, unknown>;
        if (typeof rawObj.id !== "undefined") createdId = Number(rawObj.id);
        else if (
          rawObj.data &&
          typeof rawObj.data === "object" &&
          rawObj.data !== null &&
          typeof (rawObj.data as Record<string, unknown>).id !== "undefined"
        ) {
          createdId = Number(
            (rawObj.data as Record<string, unknown>).id as unknown as number
          );
        }
      }

      // Отправляем через вебсокет
      emitSnippetComment({
        content,
        snippetId,
        id: createdId,
        user: { username: user?.username || "unknown" },
      });

      setContent("");
      setOk("Комментарий отправлен");

      // При socket.io обновление прилетит и так; оставим инвалидацию на случай деградации
      qc.invalidateQueries({ queryKey: ["snippet", snippetId] });
    } catch (e) {
      const err = toHttpError(e);
      setError(err.message || "Не удалось отправить комментарий");
    } finally {
      setPending(false);
    }
  };

  return {
    content,
    setContent,
    error,
    ok,
    pending,
    submit,
  };
}
