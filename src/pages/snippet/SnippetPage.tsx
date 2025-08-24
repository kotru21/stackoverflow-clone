import { useParams } from "react-router-dom";
import {
  useSnippet,
  useUpdateSnippet,
  useDeleteSnippet,
  useUpdateComment,
  useDeleteComment,
} from "@/entities/snippet/api";
import { useAuth } from "@/app/providers/useAuth";
import { BackLink } from "@/shared/ui/BackLink";
import SnippetDetailsView from "./ui/SnippetDetailsView";
import { Skeleton } from "@/shared/ui/Skeleton";
import CommentFormView from "./ui/CommentFormView";
import CommentsListView from "./ui/CommentsListView";
import { useSnippetComments } from "@/shared/socket";
import { useCommentForm, useSnippetOwnership } from "@/entities/snippet/hooks";
import CodeEditor from "@/shared/ui/CodeEditor";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SnippetPage() {
  const { id } = useParams();
  const snippetId = Number(id);
  const { data: snippet, status } = useSnippet(
    Number.isFinite(snippetId) ? snippetId : undefined
  );
  const { user } = useAuth();
  const isOwner = useSnippetOwnership(snippet);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editLanguage, setEditLanguage] = useState<string>("");
  const [editCode, setEditCode] = useState<string>("");

  const updateMutation = useUpdateSnippet(snippetId);
  const deleteMutation = useDeleteSnippet(snippetId);
  const updateCommentMutation = useUpdateComment(snippetId);
  const deleteCommentMutation = useDeleteComment(snippetId);

  useSnippetComments(Number.isFinite(snippetId) ? snippetId : undefined);

  const commentForm = useCommentForm(snippetId);

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton width={180} height={28} />
            <Skeleton width={64} height={18} rounded className="" />
          </div>
          <Skeleton width={140} height={16} />
          <Skeleton height={220} className="rounded" />
          <div className="flex items-center gap-4">
            <Skeleton width={80} height={14} />
            <Skeleton width={100} height={14} />
            <Skeleton width={110} height={14} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton width={200} height={20} />
          <Skeleton height={96} className="rounded" />
          <div className="flex items-center gap-2">
            <Skeleton width={140} height={36} className="rounded" />
            <Skeleton width={160} height={16} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton width={160} height={20} />
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="border rounded p-2 bg-white dark:bg-neutral-800">
              <Skeleton width={120} height={12} className="mb-2" />
              <Skeleton height={40} className="rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <p className="text-red-500">Не удалось загрузить сниппет.</p>;
  }

  if (!snippet) {
    return <p className="text-gray-500">Сниппет не найден.</p>;
  }

  const onStartEdit = () => {
    if (!snippet) return;
    setEditLanguage(snippet.language);
    setEditCode(snippet.code);
    setIsEditing(true);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
  };

  const onSave = async () => {
    try {
      await updateMutation.mutateAsync({
        language: editLanguage,
        code: editCode,
      });
      setIsEditing(false);
    } catch {
      alert("Не удалось сохранить изменения");
    }
  };

  const onDelete = async () => {
    if (!confirm("Удалить сниппет? Действие необратимо.")) return;
    try {
      await deleteMutation.mutateAsync();
      navigate("/my?mode=snippets");
    } catch {
      alert("Не удалось удалить сниппет");
    }
  };

  const actionButtons = isOwner && !isEditing && (
    <>
      <button
        onClick={onStartEdit}
        className="px-2 py-1 text-xs rounded border bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700">
        Редактировать
      </button>
      <button
        onClick={onDelete}
        disabled={deleteMutation.isPending}
        className="px-2 py-1 text-xs rounded border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50">
        {deleteMutation.isPending ? "Удаление..." : "Удалить"}
      </button>
    </>
  );

  return (
    <div className="space-y-4">
      <BackLink />
      {!isEditing && (
        <SnippetDetailsView
          id={snippet.id}
          language={snippet.language}
          authorName={snippet.user?.username ?? "unknown"}
          code={snippet.code}
          likesCount={snippet.likesCount}
          dislikesCount={snippet.dislikesCount}
          commentsCount={snippet.commentsCount}
          actions={actionButtons}
        />
      )}
      {isEditing && (
        <div className="space-y-3 border rounded p-3">
          <h1 className="text-xl font-semibold">
            Редактирование сниппета #{snippet.id}
          </h1>
          <div className="space-y-2">
            <label className="block text-xs font-medium">Язык</label>
            <input
              value={editLanguage}
              onChange={(e) => setEditLanguage(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="Language"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium">Код</label>
            <CodeEditor
              value={editCode}
              onChange={setEditCode}
              language={editLanguage}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              disabled={updateMutation.isPending}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm disabled:opacity-50">
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 rounded border text-sm">
              Отмена
            </button>
          </div>
        </div>
      )}

      {user ? (
        <CommentFormView
          content={commentForm.content}
          onChange={commentForm.setContent}
          onSubmit={commentForm.submit}
          pending={commentForm.pending}
          error={commentForm.error}
          ok={commentForm.ok}
        />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Войдите, чтобы оставлять комментарии.
        </p>
      )}

      {Array.isArray(snippet.comments) && snippet.comments.length > 0 && (
        <CommentsListView
          comments={snippet.comments}
          currentUser={user}
          onUpdate={(cid, content) => {
            updateCommentMutation.mutate({ id: cid, content });
          }}
          onDelete={(cid) => {
            deleteCommentMutation.mutate(cid);
          }}
        />
      )}
    </div>
  );
}
