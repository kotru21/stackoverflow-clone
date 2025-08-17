import { useParams } from "react-router-dom";
import { useEffect } from "react";
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
  const { user, refresh } = useAuth();
  const { data: question, status } = useQuestion(id);
  const { mutateAsync: createAnswer, isPending } = useCreateAnswer(id!);
  const { mutateAsync: setAnswerState, isPending: markPending } =
    useSetAnswerState(id!);
  const debugEnabled = (() => {
    try {
      const envDev = Boolean(
        (import.meta as unknown as { env?: Record<string, unknown> }).env?.DEV
      );
      const qs =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : undefined;
      const fromQuery = qs?.get("debugQuestionPage") === "1";
      const fromLocal =
        typeof window !== "undefined" &&
        !!window.localStorage &&
        window.localStorage.getItem("debugQuestionPage") === "1";
      return envDev || !!fromQuery || !!fromLocal;
    } catch {
      return false;
    }
  })();
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

  // В режиме отладки: если пользователь ещё не загружен, форсируем refresh(), чтобы увидеть логи AuthProvider
  useEffect(() => {
    if (debugEnabled && !user) {
      try {
        void refresh();
        console.log("[QuestionPage] forced refresh() to trigger /auth logs");
      } catch {
        // no-op for debug
      }
    }
  }, [debugEnabled, user, refresh]);

  // Dev/log-flag логирование для диагностики
  if (debugEnabled) {
    // Статус и базовые данные
    console.log("[QuestionPage] DEBUG ENABLED");
    console.log("[QuestionPage] status:", status, "questionId:", id);
    if (user) {
      console.log("[QuestionPage] auth user:", {
        id: (user as unknown as Record<string, unknown>)["id"],
        username: (user as unknown as Record<string, unknown>)["username"],
        role: (user as unknown as Record<string, unknown>)["role"],
      });
    } else {
      console.log("[QuestionPage] auth user: null");
    }
    if (question) {
      const qAny = question as unknown as Record<string, unknown>;
      const qUser =
        (qAny?.["user"] as Record<string, unknown> | undefined) ?? undefined;
      console.log("[QuestionPage] question owner raw fields:", {
        questionId: qAny?.["id"],
        user: qUser
          ? { id: qUser["id"], username: qUser["username"] }
          : undefined,
        userId: qAny?.["userId"],
        authorId: qAny?.["authorId"],
        ownerId: qAny?.["ownerId"],
        createdById: qAny?.["createdById"],
        answersLen: Array.isArray(qAny?.["answers"] as unknown[])
          ? (qAny?.["answers"] as unknown[]).length
          : undefined,
      });
    }
  }

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

  if (debugEnabled) {
    console.log("[QuestionPage] derived owner:", {
      ownerId,
      ownerName,
      isOwner,
      currentUserId: user?.id,
      currentUserName: user?.username,
    });
  }

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
                  if (!isOwner) {
                    alert("Только автор вопроса может помечать ответы.");
                    return;
                  }
                  if (debugEnabled) {
                    console.log("[QuestionPage] action: mark correct", {
                      answerId: a.id,
                    });
                  }
                  setAnswerState({ answerId: a.id, state: "correct" });
                }}
                onMarkIncorrect={() => {
                  if (!isOwner) {
                    alert("Только автор вопроса может помечать ответы.");
                    return;
                  }
                  if (debugEnabled) {
                    console.log("[QuestionPage] action: unmark (incorrect)", {
                      answerId: a.id,
                    });
                  }
                  setAnswerState({ answerId: a.id, state: "incorrect" });
                }}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
