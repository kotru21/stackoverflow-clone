import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useQuestion,
  useCreateAnswer,
  useSetAnswerState,
} from "../../entities/question/api";
import type { Question, Answer } from "../../entities/question/types";
import { useAuth } from "../../app/providers/useAuth";
import QuestionDetailsView from "./ui/QuestionDetailsView";
import AnswerItemView from "./ui/AnswerItemView";
import AnswerFormView from "./ui/AnswerFormView";
import { BackLink } from "../../shared/ui/BackLink";
import { Skeleton } from "../../shared/ui/Skeleton";

const schema = z.object({
  content: z.string().min(1, "Ответ не может быть пустым"),
});

type FormData = z.infer<typeof schema>;

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: question, status } = useQuestion(id);
  const { mutateAsync: createAnswer, isPending } = useCreateAnswer(id!);
  const { mutateAsync: setAnswerState, isPending: markPending } =
    useSetAnswerState(id!);
  // debug-флаг и временные логи удалены
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await createAnswer(data.content);
    reset({ content: "" });
  };

  // удалены dev-логирование и принудительный refresh

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
        {/* Форма ответа (новый лейаут: сразу под деталями) */}
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
  // Только автор вопроса может помечать ответы правильными/неправильными
  // Поддерживаем разные возможные формы данных от API: user.id | userId | user.userId
  const qAny = question as unknown as Record<string, unknown>;
  const qUser =
    (qAny?.["user"] as Record<string, unknown> | undefined) ?? undefined;
  const ownerIdCandidates: Array<number | string | undefined> = [
    qUser?.["id"] as number | string | undefined,
    qAny?.["userId"] as number | string | undefined,
    qUser?.["userId"] as number | string | undefined,
    (qAny?.["author"] as Record<string, unknown> | undefined)?.["id"] as
      | number
      | string
      | undefined,
    (qAny?.["owner"] as Record<string, unknown> | undefined)?.["id"] as
      | number
      | string
      | undefined,
    (qAny?.["createdBy"] as Record<string, unknown> | undefined)?.["id"] as
      | number
      | string
      | undefined,
    qAny?.["createdById"] as number | string | undefined,
    qAny?.["authorId"] as number | string | undefined,
    qAny?.["ownerId"] as number | string | undefined,
  ];
  const ownerId = ownerIdCandidates.find((v) => v !== undefined);
  const ownerNameCandidates: Array<string | undefined> = [
    (qUser?.["username"] as string | undefined) ?? undefined,
    (qAny?.["author"] as Record<string, unknown> | undefined)?.["username"] as
      | string
      | undefined,
    (qAny?.["owner"] as Record<string, unknown> | undefined)?.["username"] as
      | string
      | undefined,
    (qAny?.["createdBy"] as Record<string, unknown> | undefined)?.[
      "username"
    ] as string | undefined,
  ];
  const ownerName = ownerNameCandidates.find((v) => !!v);
  const isOwner =
    !!user &&
    ((ownerId != null && String(user.id) === String(ownerId)) ||
      (ownerName != null && user.username === ownerName));


  return (
    <div className="space-y-4">
      <BackLink />
      <QuestionDetailsView
        title={(question as Question).title}
        description={(question as Question).description}
        attachedCode={(question as Question).attachedCode}
      />
      {user ? (
        <AnswerFormView
          onSubmit={handleSubmit(onSubmit)}
          textareaProps={register("content")}
          error={errors.content?.message}
          disabled={isSubmitting || isPending}
        />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Войдите, чтобы оставить ответ.
        </p>
      )}
      <div>
        <h2 className="text-xl font-semibold mb-2">Ответы</h2>
        <ul className="space-y-2">
          {Array.isArray((question as Question).answers) &&
            (question as Question).answers!.map((a: Answer) => (
              <AnswerItemView
                key={a.id}
                content={a.content}
                isCorrect={a.isCorrect}
                canMark={isOwner}
                pending={markPending}
                onMarkCorrect={() => {
                  if (!isOwner) return;
                  setAnswerState({ answerId: a.id, state: "correct" });
                }}
                onMarkIncorrect={() => {
                  if (!isOwner) return;
                  setAnswerState({ answerId: a.id, state: "incorrect" });
                }}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
