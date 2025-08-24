import { useParams } from "react-router-dom";
import { useSnippet } from "../../entities/snippet/api";
import { useAuth } from "../../app/providers/useAuth";
import { BackLink } from "../../shared/ui/BackLink";
import SnippetDetailsView from "./ui/SnippetDetailsView";
import { Skeleton } from "../../shared/ui/Skeleton";
import CommentFormView from "./ui/CommentFormView";
import CommentsListView from "./ui/CommentsListView";
import { useSnippetComments } from "../../shared/socket";
import { useCommentForm } from "../../entities/snippet/hooks";

export default function SnippetPage() {
  const { id } = useParams();
  const snippetId = Number(id);
  const { data: snippet, status } = useSnippet(
    Number.isFinite(snippetId) ? snippetId : undefined
  );
  const { user } = useAuth();

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
        <CommentsListView comments={snippet.comments} />
      )}
    </div>
  );
}
