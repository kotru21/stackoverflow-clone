import { BackLink } from "@/shared/ui/BackLink";
import CodeEditor from "@/shared/ui/CodeEditor";
import QuestionDetailsView from "./question/ui/QuestionDetailsView";
import SnippetDetailsView from "./snippet/ui/SnippetDetailsView";
import GenericTextForm from "./ui/GenericTextForm";
import CommentsListView from "./ui/CommentsListView";
import { ActionButtons } from "./ui/ActionButtons";
import { EditPanel } from "./ui/EditPanel";
import { LoadingSkeleton } from "./ui/LoadingSkeleton";
import type { ItemState, QuestionState, SnippetState } from "./hooks/itemTypes";
import type { Answer } from "@/entities/question/types";
import { EditableAnswerItem } from "./question/ui/EditableAnswerItem";
import { useAuth } from "@/app/providers/useAuth";

export function ItemDetailsView(props: ItemState) {
  if (props.loading) return <LoadingSkeleton mode={props.mode} />;
  if (props.notFound) return <p className="text-gray-500">Не найдено</p>;
  return props.mode === "question" ? (
    <QuestionSection state={props as QuestionState} />
  ) : (
    <SnippetSection state={props as SnippetState} />
  );
}

function QuestionSection({ state }: { state: QuestionState }) {
  const { user } = useAuth();
  const {
    question,
    isOwner,
    isEditing,
    edit,
    startEdit,
    cancelEdit,
    saveEdit,
    saving,
    deleteItem,
    deleting,
    answerForm,
    markCorrect,
    markIncorrect,
    markPending,
    updateAnswer,
    deleteAnswer,
  } = state;
  return (
    <div className="space-y-4">
      <BackLink />
      {!isEditing && question && (
        <QuestionDetailsView
          title={question.title}
          description={question.description}
          attachedCode={question.attachedCode}
          actions={
            isOwner && (
              <ActionButtons
                onEdit={startEdit}
                onDelete={deleteItem}
                deleting={deleting}
              />
            )
          }
        />
      )}
      {isEditing && (
        <EditPanel
          title="Редактирование вопроса"
          saving={saving}
          onSave={saveEdit}
          onCancel={cancelEdit}>
          <div className="space-y-1">
            <label className="block text-xs font-medium">Заголовок</label>
            <input
              value={edit.title}
              onChange={(e) => edit.setTitle(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">Описание</label>
            <textarea
              value={edit.description}
              onChange={(e) => edit.setDescription(e.target.value)}
              rows={5}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">Код</label>
            <CodeEditor value={edit.code} onChange={edit.setCode} />
          </div>
        </EditPanel>
      )}
      {user ? (
        answerForm && (
          <GenericTextForm
            formSubmit={answerForm.onSubmit}
            value={answerForm.watch("content") || ""}
            onChange={(v) =>
              answerForm.setValue("content", v, { shouldValidate: true })
            }
            error={answerForm.formState.errors.content?.message}
            pending={answerForm.formState.isSubmitting || answerForm.isPending}
            placeholder="Ваш ответ..."
            submitLabel="Отправить ответ"
          />
        )
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Войдите, чтобы оставить ответ.
        </p>
      )}
      {question && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Ответы</h2>
          <ul className="space-y-2">
            {Array.isArray(question.answers) &&
              question.answers!.map((a: Answer) => (
                <EditableAnswerItem
                  key={a.id}
                  answer={a}
                  canMark={isOwner}
                  currentUser={user?.username}
                  onMarkCorrect={() => markCorrect(a.id)}
                  onMarkIncorrect={() => markIncorrect(a.id)}
                  markPending={markPending}
                  onUpdate={(id, content) => updateAnswer(id, content)}
                  onDelete={(id) => deleteAnswer(id)}
                />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SnippetSection({ state }: { state: SnippetState }) {
  const { user } = useAuth();
  const {
    snippet,
    isOwner,
    isEditing,
    edit,
    startEdit,
    cancelEdit,
    saveEdit,
    saving,
    deleteItem,
    deleting,
    commentForm,
    updateComment,
    deleteComment,
  } = state;
  return (
    <div className="space-y-4">
      <BackLink />
      {!isEditing && snippet && (
        <SnippetDetailsView
          id={snippet.id}
          language={snippet.language}
          authorName={snippet.user?.username}
          code={snippet.code}
          likesCount={snippet.likesCount}
          dislikesCount={snippet.dislikesCount}
          commentsCount={snippet.commentsCount}
          actions={
            isOwner && (
              <ActionButtons
                onEdit={startEdit}
                onDelete={deleteItem}
                deleting={deleting}
              />
            )
          }
        />
      )}
      {isEditing && (
        <EditPanel
          title="Редактирование сниппета"
          saving={saving}
          onSave={saveEdit}
          onCancel={cancelEdit}>
          <div className="space-y-2">
            <label className="block text-xs font-medium">Язык</label>
            <input
              value={edit.language}
              onChange={(e) => edit.setLanguage(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium">Код</label>
            <CodeEditor
              value={edit.code}
              onChange={edit.setCode}
              language={edit.language}
            />
          </div>
        </EditPanel>
      )}
      {user ? (
        commentForm && (
          <GenericTextForm
            value={commentForm.content}
            onChange={commentForm.setContent}
            onSubmit={commentForm.submit}
            pending={commentForm.pending}
            error={commentForm.error}
            success={commentForm.ok || undefined}
            placeholder="Ваш комментарий..."
            submitLabel="Отправить"
            header={
              <h2 className="text-lg font-semibold">Оставить комментарий</h2>
            }
          />
        )
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Войдите, чтобы оставлять комментарии.
        </p>
      )}
      {snippet?.comments && snippet.comments.length > 0 && (
        <CommentsListView
          comments={snippet.comments.map((c) => ({
            id: Number(c.id),
            content: c.content,
            user: { username: c.user?.username || "unknown" },
          }))}
          currentUser={user}
          onUpdate={(cid, content) => updateComment(cid, content)}
          onDelete={(cid) => deleteComment(cid)}
        />
      )}
    </div>
  );
}
