import { useParams } from "react-router-dom";
import {
  useQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useUpdateAnswer,
  useDeleteAnswer,
} from "@/entities/question/api";
import type { Question, Answer } from "@/entities/question/types";
import { useAuth } from "@/app/providers/useAuth";
import QuestionDetailsView from "./ui/QuestionDetailsView";
import AnswerItemView from "./ui/AnswerItemView";
import AnswerFormView from "./ui/AnswerFormView";
import { BackLink } from "@/shared/ui/BackLink";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useQuestionAnswers } from "@/shared/socket";
import {
  useAnswerForm,
  useQuestionOwnership,
  useAnswerActions,
} from "@/entities/question/hooks";
import { useState } from "react";
import CodeEditor from "@/shared/ui/CodeEditor";
import { useNavigate } from "react-router-dom";

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: question, status } = useQuestion(id);

  useQuestionAnswers(id);

  const answerForm = useAnswerForm(id!);
  const isOwner = useQuestionOwnership(question);
  const {
    markCorrect,
    markIncorrect,
    isPending: markPending,
  } = useAnswerActions(id!);

  const updateMutation = useUpdateQuestion(id!);
  const deleteMutation = useDeleteQuestion(id!);
  const updateAnswerMutation = useUpdateAnswer(id!);
  const deleteAnswerMutation = useDeleteAnswer(id!);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCode, setEditCode] = useState("");
  const navigate = useNavigate();

  if (status === "pending")
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="space-y-3">
          {/* Заголовок и детали вопроса */}
          <Skeleton width={240} height={28} />
          <Skeleton height={80} className="rounded" />
          <Skeleton height={180} className="rounded" />
        </div>
        {/* Форма ответа */}
        <div className="space-y-2">
          <Skeleton width={220} height={20} />
          <Skeleton height={96} className="rounded" />
          <Skeleton width={180} height={36} className="rounded" />
        </div>
        {/* Секция ответов */}
        <div className="space-y-2">
          <Skeleton width={160} height={20} />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={56} className="rounded" />
          ))}
        </div>
      </div>
    );
  if (!question) return <p>Вопрос не найден</p>;

  const handleMarkCorrect = (answerId: string | number) => {
    if (!isOwner) return;
    markCorrect(answerId);
  };

  const handleMarkIncorrect = (answerId: string | number) => {
    if (!isOwner) return;
    markIncorrect(answerId);
  };

  const onStartEdit = () => {
    if (!question) return;
    setEditTitle(question.title);
    setEditDescription(question.description);
    setEditCode(question.attachedCode || "");
    setIsEditing(true);
  };

  const onCancelEdit = () => setIsEditing(false);

  const onSave = async () => {
    try {
      await updateMutation.mutateAsync({
        title: editTitle,
        description: editDescription,
        attachedCode: editCode,
      });
      setIsEditing(false);
    } catch {
      alert("Не удалось сохранить изменения");
    }
  };

  const onDelete = async () => {
    if (!confirm("Удалить вопрос?")) return;
    try {
      await deleteMutation.mutateAsync();
      navigate("/my?mode=questions");
    } catch {
      alert("Не удалось удалить вопрос");
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
        <QuestionDetailsView
          title={(question as Question).title}
          description={(question as Question).description}
          attachedCode={(question as Question).attachedCode}
          actions={actionButtons}
        />
      )}
      {isEditing && (
        <div className="space-y-3 border rounded p-3">
          <h1 className="text-xl font-semibold">Редактирование вопроса</h1>
          <div className="space-y-1">
            <label className="block text-xs font-medium">Заголовок</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">Описание</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={5}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">Код</label>
            <CodeEditor value={editCode} onChange={setEditCode} />
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
        <AnswerFormView
          onSubmit={answerForm.onSubmit}
          textareaProps={answerForm.register("content")}
          error={answerForm.formState.errors.content?.message}
          disabled={answerForm.formState.isSubmitting || answerForm.isPending}
        />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Войдите, чтобы оставить ответ.
        </p>
      )}
      <div>
        <h2 className="text-xl font-semibold mb-2">Ответы</h2>
        <AnswerList
          answers={(question as Question).answers || []}
          currentUser={user?.username}
          ownerCanMark={isOwner}
          onMarkCorrect={handleMarkCorrect}
          onMarkIncorrect={handleMarkIncorrect}
          markPending={markPending}
          onUpdate={(answerId, content) =>
            updateAnswerMutation.mutate({ answerId, content })
          }
          onDelete={(answerId) => deleteAnswerMutation.mutate(answerId)}
        />
      </div>
    </div>
  );
}

function AnswerList({
  answers,
  currentUser,
  ownerCanMark,
  onMarkCorrect,
  onMarkIncorrect,
  markPending,
  onUpdate,
  onDelete,
}: {
  answers: Answer[];
  currentUser?: string;
  ownerCanMark: boolean;
  onMarkCorrect: (id: string | number) => void;
  onMarkIncorrect: (id: string | number) => void;
  markPending: boolean;
  onUpdate: (id: string | number, content: string) => void;
  onDelete: (id: string | number) => void;
}) {
  return (
    <ul className="space-y-2">
      {answers.map((a) => (
        <EditableAnswerItem
          key={a.id}
          answer={a}
          canMark={ownerCanMark}
          currentUser={currentUser}
          onMarkCorrect={() => onMarkCorrect(a.id)}
          onMarkIncorrect={() => onMarkIncorrect(a.id)}
          markPending={markPending}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

import { useState as useStateReact } from "react";

function EditableAnswerItem({
  answer,
  canMark,
  currentUser,
  onMarkCorrect,
  onMarkIncorrect,
  markPending,
  onUpdate,
  onDelete,
}: {
  answer: Answer;
  canMark: boolean;
  currentUser?: string;
  onMarkCorrect: () => void;
  onMarkIncorrect: () => void;
  markPending: boolean;
  onUpdate: (id: string | number, content: string) => void;
  onDelete: (id: string | number) => void;
}) {
  const [editing, setEditing] = useStateReact(false);
  const [value, setValue] = useStateReact(answer.content);
  // Допускаем что объект ответа может содержать user (не описан в исходном типе)
  const answerUser = (answer as unknown as { user?: { username?: string } })
    .user;
  const isOwner = !!currentUser && answerUser?.username === currentUser;

  const save = () => {
    onUpdate(answer.id, value);
    setEditing(false);
  };
  const del = () => {
    if (confirm("Удалить ответ?")) onDelete(answer.id);
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
        canEdit={!!isOwner}
        onEdit={() => setEditing(true)}
        onDelete={del}
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
