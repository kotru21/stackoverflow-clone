import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuestion, useCreateAnswer } from "../entities/question/api";
import type { Question, Answer } from "../entities/question/types";
import { useAuth } from "../app/providers/useAuth";
import { CodeBlock } from "../shared/ui/CodeBlock";
import { ExpandableText } from "../shared/ui/ExpandableText";

const schema = z.object({
  content: z.string().min(1, "Ответ не может быть пустым"),
});

type FormData = z.infer<typeof schema>;

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: question, status } = useQuestion(id);
  const { mutateAsync: createAnswer, isPending } = useCreateAnswer(id!);
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

  if (status === "pending") return <p>Загрузка...</p>;
  if (!question) return <p>Вопрос не найден</p>;

  return (
    <div className="space-y-4">
      <div className="text-sm">
        <Link to="/" className="text-blue-600 dark:text-blue-400">
          ← Назад
        </Link>
      </div>
      <h1 className="text-2xl font-semibold">{(question as Question).title}</h1>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {(question as Question).description}
      </p>
      {(question as Question).attachedCode && (
        <CodeBlock code={(question as Question).attachedCode!} />
      )}
      <div>
        <h2 className="text-xl font-semibold mb-2">Ответы</h2>
        <ul className="space-y-2">
          {Array.isArray((question as Question).answers) &&
            (question as Question).answers!.map((a: Answer) => (
              <li
                key={a.id}
                className="border rounded p-2 text-sm bg-white dark:bg-neutral-800">
                <div className="flex items-start justify-between gap-2">
                  <ExpandableText
                    text={a.content}
                    mode="toggle"
                    moreLabel="Показать весь"
                    lessLabel="Показать меньше"
                    className="flex-1"
                    maxHeight={120}
                  />
                  {a.isCorrect && (
                    <span className="text-green-600 text-xs">correct</span>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
      {user ? (
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <textarea
            className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            rows={4}
            placeholder="Ваш ответ..."
            {...register("content")}
          />
          {errors.content && (
            <p className="text-xs text-red-600">{errors.content.message}</p>
          )}
          <button
            disabled={isSubmitting || isPending}
            className="px-3 py-2 border rounded disabled:opacity-50 bg-white dark:bg-neutral-800">
            Отправить ответ
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Войдите, чтобы оставить ответ.
        </p>
      )}
    </div>
  );
}
