import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAnswer } from "../api";
import { emitQuestionAnswer } from "../../../shared/socket";
import { useAuth } from "../../../app/providers/useAuth";

const schema = z.object({
  content: z.string().min(1, "Ответ не может быть пустым"),
});

type FormData = z.infer<typeof schema>;

export function useAnswerForm(questionId: string | number) {
  const { user } = useAuth();
  const { mutateAsync: createAnswer, isPending } = useCreateAnswer(questionId);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createAnswer(data.content);

      // Пытаемся получить id созданного ответа
      let createdId: number | string | undefined;
      const rawUnknown: unknown = res;
      if (rawUnknown && typeof rawUnknown === "object") {
        const rawObj = rawUnknown as Record<string, unknown>;
        if (typeof rawObj.id !== "undefined")
          createdId = rawObj.id as number | string;
        else if (
          rawObj.data &&
          typeof rawObj.data === "object" &&
          rawObj.data !== null &&
          typeof (rawObj.data as Record<string, unknown>).id !== "undefined"
        ) {
          createdId = (rawObj.data as Record<string, unknown>).id as
            | number
            | string;
        }
      }

      // Отправляем через вебсокет
      emitQuestionAnswer({
        content: data.content,
        questionId,
        id: createdId,
        user: { username: user?.username || "unknown" },
        isCorrect: false,
      });

      form.reset({ content: "" });
    } catch (error) {
      console.error("Ошибка при создании ответа:", error);
      throw error;
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
}
