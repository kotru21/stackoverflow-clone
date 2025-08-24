import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeEditor from "@/shared/ui/CodeEditor";
import { useQuestionForm, useSnippetForm } from "./hooks";

export default function CreatePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"question" | "snippet">("question");

  const questionForm = useQuestionForm();
  const snippetForm = useSnippetForm();

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setMode("question")}
          className={`pb-2 px-1 border-b-2 transition ${
            mode === "question"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}>
          Вопрос
        </button>
        <button
          onClick={() => setMode("snippet")}
          className={`pb-2 px-1 border-b-2 transition ${
            mode === "snippet"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}>
          Сниппет
        </button>
      </div>

      {/* Question Form */}
      {mode === "question" && (
        <form onSubmit={questionForm.onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок <span className="text-red-500">*</span>
            </label>
            <input
              {...questionForm.register("title")}
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите заголовок вопроса..."
            />
            {questionForm.errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {questionForm.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание <span className="text-red-500">*</span>
            </label>
            <textarea
              {...questionForm.register("description")}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Опишите вашу проблему подробно..."
            />
            {questionForm.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {questionForm.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Прикрепленный код (опционально)
            </label>
            <CodeEditor
              value={questionForm.watch("attachedCode") || ""}
              onChange={(value) => questionForm.setValue("attachedCode", value)}
              placeholder="Введите код для демонстрации проблемы..."
            />
          </div>

          {questionForm.error && (
            <div className="text-red-600 text-sm">{questionForm.error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={questionForm.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {questionForm.isPending ? "Создание..." : "Создать вопрос"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Snippet Form */}
      {mode === "snippet" && (
        <form onSubmit={snippetForm.onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Язык программирования <span className="text-red-500">*</span>
            </label>
            <input
              {...snippetForm.register("language")}
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="JavaScript, Python, Java, C/C++, C#, Go, Kotlin, Ruby"
            />
            {snippetForm.errors.language && (
              <p className="text-red-500 text-sm mt-1">
                {snippetForm.errors.language.message}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Допустимые: JavaScript, Python, Java, C/C++, C#, Go, Kotlin, Ruby
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Код <span className="text-red-500">*</span>
            </label>
            <CodeEditor
              value={snippetForm.watch("code") || ""}
              onChange={(value) => snippetForm.setValue("code", value)}
              language={snippetForm.watch("language")}
              placeholder="Введите ваш код..."
            />
            {snippetForm.errors.code && (
              <p className="text-red-500 text-sm mt-1">
                {snippetForm.errors.code.message}
              </p>
            )}
          </div>

          {snippetForm.error && (
            <div className="text-red-600 text-sm">{snippetForm.error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={snippetForm.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {snippetForm.isPending ? "Создание..." : "Создать сниппет"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
