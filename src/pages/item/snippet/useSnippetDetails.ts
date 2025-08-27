import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useSnippet,
  useUpdateSnippet,
  useDeleteSnippet,
  useUpdateComment,
  useDeleteComment,
} from "@/entities/snippet/api";
import { useCommentForm, useSnippetOwnership } from "@/entities/snippet/hooks";
import {
  useSnippetComments,
  emitSnippetCommentUpdate,
  emitSnippetCommentDelete,
} from "@/shared/socket";
import type { SnippetState } from "../hooks/itemTypes";
import { emitNotification } from "@/shared/notifications";
import { deriveEntityAccessState } from "../utils/queryErrorState";

export function useSnippetDetails(rawId?: string): SnippetState {
  const navigate = useNavigate();
  const numericId = Number(rawId);
  const validId = Number.isFinite(numericId) ? numericId : undefined;
  const query = useSnippet(validId);
  const { data: snippetData, status } = query;
  useSnippetComments(validId);
  const isOwner = useSnippetOwnership(snippetData);
  const updateSnippetMut = useUpdateSnippet(numericId || 0);
  const deleteSnippetMut = useDeleteSnippet(numericId || 0);
  const updateCommentMut = useUpdateComment(numericId || 0);
  const deleteCommentMut = useDeleteComment(numericId || 0);
  const commentForm = useCommentForm(numericId || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [editLanguage, setEditLanguage] = useState("");
  const [editCode, setEditCode] = useState("");

  const startEdit = () => {
    if (snippetData) {
      setEditLanguage(snippetData.language);
      setEditCode(snippetData.code);
    }
    setIsEditing(true);
  };
  const cancelEdit = () => setIsEditing(false);

  const loading = status === "pending";
  const { notFound, forbidden } = deriveEntityAccessState(query);
  if (forbidden) {
    emitNotification({
      type: "error",
      message: "Нет прав для просмотра сниппета",
    });
  }

  const mappedSnippet = useMemo(
    () =>
      snippetData
        ? {
            id: snippetData.id,
            language: snippetData.language,
            code: snippetData.code,
            user: { username: snippetData.user?.username },
            likesCount: snippetData.likesCount,
            dislikesCount: snippetData.dislikesCount,
            commentsCount: snippetData.commentsCount,
            comments: snippetData.comments?.map((c) => ({
              id: Number(c.id),
              content: c.content,
              user: { username: c.user.username },
            })),
          }
        : undefined,
    [snippetData]
  );

  return {
    mode: "snippet",
    loading,
    notFound,
    error: forbidden ? "Недостаточно прав" : undefined,
    isOwner,
    isEditing,
    startEdit,
    cancelEdit,
    saveEdit: async () => {
      try {
        await updateSnippetMut.mutateAsync({
          language: editLanguage,
          code: editCode,
        });
        setIsEditing(false);
      } catch {
        emitNotification({
          type: "error",
          message: "Не удалось сохранить изменения",
        });
      }
    },
    saving: updateSnippetMut.isPending,
    deleteItem: async () => {
      if (!confirm("Удалить сниппет?")) return;
      try {
        await deleteSnippetMut.mutateAsync();
        navigate("/my?mode=snippets");
      } catch {
        emitNotification({
          type: "error",
          message: "Не удалось удалить сниппет",
        });
      }
    },
    deleting: deleteSnippetMut.isPending,
    snippet: mappedSnippet,
    edit: {
      language: editLanguage,
      code: editCode,
      setLanguage: setEditLanguage,
      setCode: setEditCode,
    },
    commentForm,
    updateComment: (id: number | string, content: string) =>
      updateCommentMut.mutate(
        { id: Number(id), content },
        {
          onSuccess: () =>
            emitSnippetCommentUpdate({
              snippetId: numericId || 0,
              id,
              content,
            }),
        }
      ),
    deleteComment: (id: number | string) =>
      deleteCommentMut.mutate(Number(id), {
        onSuccess: () =>
          emitSnippetCommentDelete({ snippetId: numericId || 0, id }),
      }),
  } as const;
}

export default useSnippetDetails;
