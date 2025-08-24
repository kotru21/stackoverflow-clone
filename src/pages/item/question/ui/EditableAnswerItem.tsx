import { useState } from "react";
import type { Answer } from "@/entities/question/types";
import AnswerItemView from "./AnswerItemView";

interface EditableAnswerItemProps {
  answer: Answer;
  canMark: boolean;
  currentUser?: string;
  onMarkCorrect: () => void;
  onMarkIncorrect: () => void;
  markPending: boolean;
  onUpdate: (id: string | number, content: string) => void;
  onDelete: (id: string | number) => void;
}

export function EditableAnswerItem({
  answer,
  canMark,
  currentUser,
  onMarkCorrect,
  onMarkIncorrect,
  markPending,
  onUpdate,
  onDelete,
}: EditableAnswerItemProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(answer.content);
  const answerUser = ((): string | undefined => {
    const anyAnswer = answer as unknown as { user?: { username?: string } };
    return anyAnswer.user?.username;
  })();
  const isOwner = !!currentUser && answerUser === currentUser;
  const save = () => {
    onUpdate(answer.id, value);
    setEditing(false);
  };
  return (
    <div>
      <AnswerItemView
        content={editing ? value : answer.content}
        isCorrect={answer.isCorrect}
        canMark={canMark}
        pending={markPending}
        onMarkCorrect={onMarkCorrect}
        onMarkIncorrect={onMarkIncorrect}
        canEdit={isOwner}
        onEdit={() => setEditing(true)}
        onDelete={() => onDelete(answer.id)}
      />
      {editing && (
        <div className="mt-2 space-y-2 border rounded p-2">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="w-full border rounded px-2 py-1 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
              Сохранить
            </button>
            <button
              onClick={() => {
                setValue(answer.content);
                setEditing(false);
              }}
              className="text-xs px-2 py-1 rounded border">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditableAnswerItem;
