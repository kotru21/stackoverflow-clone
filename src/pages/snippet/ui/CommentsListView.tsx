import { memo, useState } from "react";
import Avatar from "@/shared/ui/Avatar";

export type Comment = {
  id: number;
  content: string;
  user: { username: string };
};

export type CommentsListViewProps = {
  comments: Comment[];
  currentUser?: { username: string } | null;
  onUpdate?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
};

export const CommentsListView = memo(function CommentsListView({
  comments,
  currentUser,
  onUpdate,
  onDelete,
}: CommentsListViewProps) {
  if (!comments.length) return null;
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Комментарии</h2>
      <ul className="space-y-2">
        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            isOwner={currentUser?.username === c.user.username}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
});

function CommentItem({
  comment,
  isOwner,
  onUpdate,
  onDelete,
}: {
  comment: Comment;
  isOwner: boolean;
  onUpdate?: (id: number, content: string) => void;
  onDelete?: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(comment.content);

  const save = () => {
    if (!onUpdate) return;
    onUpdate(comment.id, value);
    setEditing(false);
  };
  const del = () => {
    if (!onDelete) return;
    if (confirm("Удалить комментарий?")) onDelete(comment.id);
  };
  return (
    <li className="border rounded p-2 bg-white dark:bg-neutral-800">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <Avatar username={comment.user.username} size={16} /> @
          {comment.user.username}
        </div>
        {isOwner && !editing && (
          <div className="flex gap-1">
            <button
              onClick={() => setEditing(true)}
              className="text-xs px-2 py-0.5 rounded border">
              Изм.
            </button>
            <button
              onClick={del}
              className="text-xs px-2 py-0.5 rounded border border-red-600 text-red-600">
              Удал.
            </button>
          </div>
        )}
      </div>
      {!editing && (
        <div className="text-sm whitespace-pre-wrap">{comment.content}</div>
      )}
      {editing && (
        <div className="space-y-2">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="px-2 py-0.5 text-xs rounded bg-blue-600 text-white">
              Сохранить
            </button>
            <button
              onClick={() => {
                setValue(comment.content);
                setEditing(false);
              }}
              className="px-2 py-0.5 text-xs rounded border">
              Отмена
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default CommentsListView;
