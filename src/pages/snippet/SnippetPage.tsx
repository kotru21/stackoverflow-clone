import { useParams } from "react-router-dom";
import { useSnippet } from "../../entities/snippet/api";
import { useAuth } from "../../app/providers/useAuth";
import { useState } from "react";
import { http, toHttpError } from "../../shared/api/http";
import { useQueryClient } from "@tanstack/react-query";
import { BackLink } from "../../shared/ui/BackLink";
import SnippetDetailsView from "./ui/SnippetDetailsView";

export default function SnippetPage() {
  const { id } = useParams();
  const snippetId = Number(id);
  const { data: snippet, status } = useSnippet(
    Number.isFinite(snippetId) ? snippetId : undefined
  );
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
      await http.post("/comments", { content, snippetId });
      setContent("");
      setOk("Комментарий отправлен");
      // refresh snippet to show new comment
      qc.invalidateQueries({ queryKey: ["snippet", snippetId] });
    } catch (e) {
      const err = toHttpError(e);
      setError(err.message || "Не удалось отправить комментарий");
    } finally {
      setPending(false);
    }
  };

  if (status === "pending") {
    return <p>Загрузка...</p>;
  }

  if (status === "error") {
    return <p className="text-red-500">Не удалось загрузить сниппет.</p>;
  }

  if (!snippet) {
    return <p className="text-gray-500">Сниппет не найден.</p>;
  }

  return (
    <div className="space-y-4">
      <BackLink />
      <SnippetDetailsView
        id={snippet.id}
        language={snippet.language}
        authorName={snippet.user?.username ?? "unknown"}
        code={snippet.code}
        likesCount={snippet.likesCount}
        dislikesCount={snippet.dislikesCount}
        commentsCount={snippet.commentsCount}
      />

      {Array.isArray(snippet.comments) && snippet.comments.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Комментарии</h2>
          <ul className="space-y-2">
            {snippet.comments.map((c) => (
              <li
                key={c.id}
                className="border rounded p-2 bg-white dark:bg-neutral-800">
                <div className="text-xs text-gray-500 mb-1">
                  @{c.user.username}
                </div>
                <div className="text-sm whitespace-pre-wrap">{c.content}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user ? (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Оставить комментарий</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded border p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            placeholder="Ваш комментарий..."
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={!content.trim() || pending}
              className="px-3 py-1.5 border rounded disabled:opacity-50">
              Отправить
            </button>
            {error && <span className="text-red-500 text-sm">{error}</span>}
            {ok && <span className="text-green-600 text-sm">{ok}</span>}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Войдите, чтобы оставлять комментарии.
        </p>
      )}
    </div>
  );
}
