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
                canMark={!!user}
                pending={markPending}
                onMarkCorrect={() =>
                  setAnswerState({ answerId: a.id, state: "correct" })
                }
                onMarkIncorrect={() =>
                  setAnswerState({ answerId: a.id, state: "incorrect" })
                }
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
