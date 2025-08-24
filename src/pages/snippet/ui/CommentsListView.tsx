import { memo } from "react";
import Avatar from "@/shared/ui/Avatar";

export type Comment = {
  id: number;
  content: string;
  user: { username: string };
};

export type CommentsListViewProps = {
  comments: Comment[];
};

export const CommentsListView = memo(function CommentsListView({
  comments,
}: CommentsListViewProps) {
  if (!comments.length) return null;
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Комментарии</h2>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li
            key={c.id}
            className="border rounded p-2 bg-white dark:bg-neutral-800">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              <Avatar username={c.user.username} size={16} /> @{c.user.username}
            </div>
            <div className="text-sm whitespace-pre-wrap">{c.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default CommentsListView;
