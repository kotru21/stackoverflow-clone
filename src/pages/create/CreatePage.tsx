import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateQuestion } from "../../entities/question/api";
import { useCreateSnippet } from "../../entities/snippet/api";
import CodeEditor from "../../shared/ui/CodeEditor";
import { toHttpError } from "../../shared/api/http";

const questionSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  description: z.string().min(1, "Описание обязательно"),
  attachedCode: z.string().optional(),
});
type QuestionFormData = z.infer<typeof questionSchema>;

const SUPPORTED_LANG_HINT =
  "Допустимые: JavaScript, Python, Java, C/C++, C#, Go, Kotlin, Ruby";

function normalizeLanguageInput(input: string): string | undefined {
  const raw = (input || "").trim().toLowerCase();
  if (!raw) return undefined;
  const cleaned = raw.replace(/\s+/g, ""); // убираем пробелы: "c sharp" -> "csharp"
  const map: Record<string, string> = {
    javascript: "JavaScript",
    js: "JavaScript",
    node: "JavaScript",
    python: "Python",
    py: "Python",
    java: "Java",
    c: "C",
    "c++": "C++",
    cpp: "C++",
    "c#": "C#",
    csharp: "C#",
    "c-sharp": "C#",
    golang: "Go",
    go: "Go",
    kotlin: "Kotlin",
    kt: "Kotlin",
    ruby: "Ruby",
    rb: "Ruby",
  };
  // сначала пробуем как есть
  if (map[raw]) return map[raw];
  // затем по "очищенному" ключу
  if (map[cleaned]) return map[cleaned];
  return undefined;
}

const snippetSchema = z.object({
  language: z
    .string()
    .min(1, "Укажите язык")
    .transform((v) => normalizeLanguageInput(v) ?? "__invalid__")
    .refine((v) => v !== "__invalid__", {
      message: `Неподдерживаемый язык. ${SUPPORTED_LANG_HINT}`,
    }),
  code: z.string().min(1, "Код обязателен"),
});
type SnippetFormData = z.infer<typeof snippetSchema>;

export default function CreatePage() {
  const [mode, setMode] = useState<"question" | "snippet">("question");
  const nav = useNavigate();
  const [qError, setQError] = useState<string | null>(null);
  const [sError, setSError] = useState<string | null>(null);

  const {
    register: qReg,
    handleSubmit: qSubmit,
    formState: { errors: qErr, isSubmitting: qSub },
    setValue: qSetValue,
    watch: qWatch,
  } = useForm<QuestionFormData>({ resolver: zodResolver(questionSchema) });
  const codeQ = qWatch("attachedCode") || "";

  const {
    register: sReg,
    handleSubmit: sSubmit,
    formState: { errors: sErr, isSubmitting: sSub },
    setValue: sSetValue,
    watch: sWatch,
  } = useForm<SnippetFormData>({ resolver: zodResolver(snippetSchema) });
  const codeS = sWatch("code") || "";

  const { mutateAsync: createQuestion, isPending: qPending } =
    useCreateQuestion();
  const { mutateAsync: createSnippet, isPending: sPending } =
    useCreateSnippet();

  const onCreateQuestion = async (data: QuestionFormData) => {
    setQError(null);
    try {
      const created = await createQuestion(data);
      const id = (created as { id?: string | number } | undefined)?.id;
      if (id != null) nav(`/questions/${id}`);
      else nav("/");
    } catch (e) {
      const err = toHttpError(e);
      setQError(err.message || "Не удалось создать вопрос. Попробуйте позже.");
    }
  };
  const onCreateSnippet = async (data: SnippetFormData) => {
    setSError(null);
    try {
      const created = await createSnippet(data);
      const id = (created as { id?: string | number } | undefined)?.id;
      if (id != null) nav(`/snippets/${id}`);
      else nav("/");
    } catch (e) {
      const err = toHttpError(e);
      setSError(
        err.message ||
          "Не удалось создать сниппет. Проверьте корректность данных."
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          className={
            "px-3 py-1 rounded border " +
            (mode === "question" ? "bg-blue-600 text-white" : "")
          }
          onClick={() => setMode("question")}>
          Вопрос
        </button>
        <button
          className={
            "px-3 py-1 rounded border " +
            (mode === "snippet" ? "bg-blue-600 text-white" : "")
          }
          onClick={() => setMode("snippet")}>
          Сниппет
        </button>
      </div>

      {mode === "question" ? (
        <form onSubmit={qSubmit(onCreateQuestion)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Заголовок</label>
                <input
                  className="w-full border rounded p-2"
                  placeholder="Опишите проблему кратко"
                  {...qReg("title")}
                />
                {qErr.title && (
                  <p className="text-xs text-red-500">{qErr.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">Описание</label>
                <textarea
                  className="w-full border rounded p-2 min-h-40"
                  placeholder="Раскройте детали"
                  rows={8}
                  {...qReg("description")}
                />
                {qErr.description && (
                  <p className="text-xs text-red-500">
                    {qErr.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm mb-1">Код (необязательно)</label>
              <CodeEditor
                value={codeQ}
                onChange={(v) => qSetValue("attachedCode", v)}
                language="tsx"
                height="60vh"
                placeholder="Вставьте минимальный воспроизводимый пример"
              />
            </div>
          </div>
          {qError && (
            <div className="mt-3 border border-red-300 bg-red-50 text-red-700 rounded p-2 text-sm">
              {qError}
            </div>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <button
              type="submit"
              disabled={qSub || qPending}
              className="px-3 py-1 border rounded">
              Создать вопрос
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={sSubmit(onCreateSnippet)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Язык</label>
                <input
                  className="w-full border rounded p-2"
                  placeholder="Например: JavaScript"
                  {...sReg("language")}
                />
                {sErr.language && (
                  <p className="text-xs text-red-500">
                    {sErr.language.message}
                  </p>
                )}
                {!sErr.language && (
                  <p className="text-xs text-gray-500 mt-1">
                    {SUPPORTED_LANG_HINT}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm mb-1">Код</label>
              <CodeEditor
                value={codeS}
                onChange={(v) => sSetValue("code", v)}
                language={sWatch("language")}
                height="60vh"
                placeholder="Вставьте код сниппета"
              />
              {sErr.code && (
                <p className="text-xs text-red-500">{sErr.code.message}</p>
              )}
            </div>
          </div>
          {sError && (
            <div className="mt-3 border border-red-300 bg-red-50 text-red-700 rounded p-2 text-sm">
              {sError}
            </div>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <button
              type="submit"
              disabled={sSub || sPending}
              className="px-3 py-1 border rounded">
              Создать сниппет
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
