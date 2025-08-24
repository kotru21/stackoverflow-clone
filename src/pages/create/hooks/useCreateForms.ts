import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateQuestion } from "../../../entities/question/api";
import { useCreateSnippet } from "../../../entities/snippet/api";
import {
  normalizeLanguageInput,
  SUPPORTED_LANG_HINT,
} from "../../../shared/services/languageService";
import { toHttpError } from "../../../shared/api/http";

// Question Form
const questionSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  description: z.string().min(1, "Описание обязательно"),
  attachedCode: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export function useQuestionForm() {
  const navigate = useNavigate();
  const { mutateAsync: createQuestion, isPending } = useCreateQuestion();

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const created = await createQuestion(data);
      if (created?.id) {
        navigate(`/questions/${created.id}`);
      } else {
        navigate("/");
      }
    } catch (e) {
      const err = toHttpError(e);
      form.setError("root", { message: err.message });
      throw e;
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    errors: form.formState.errors,
    error: form.formState.errors.root?.message,
  };
}

// Snippet Form
const snippetSchema = z.object({
  language: z.string().min(1, "Укажите язык"),
  code: z.string().min(1, "Код обязателен"),
});

type SnippetFormData = z.infer<typeof snippetSchema>;

export function useSnippetForm() {
  const navigate = useNavigate();
  const { mutateAsync: createSnippet, isPending } = useCreateSnippet();

  const form = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
  });

  const onSubmit = async (data: SnippetFormData) => {
    try {
      // Валидируем язык отдельно
      const normalizedLanguage = normalizeLanguageInput(data.language);
      if (!normalizedLanguage) {
        form.setError("language", {
          message: `Неподдерживаемый язык. ${SUPPORTED_LANG_HINT}`,
        });
        return;
      }

      const created = await createSnippet({
        language: normalizedLanguage,
        code: data.code,
      });

      if (created?.id) {
        navigate(`/snippets/${created.id}`);
      } else {
        navigate("/");
      }
    } catch (e) {
      const err = toHttpError(e);
      form.setError("root", { message: err.message });
      throw e;
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    errors: form.formState.errors,
    error: form.formState.errors.root?.message,
  };
}
