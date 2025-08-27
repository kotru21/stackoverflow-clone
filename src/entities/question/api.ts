import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { http } from "../../shared/api/http";
import { emitNotification } from "@/shared/notifications";
import type { Question, CreateQuestionDto } from "./types";
import type { Paginated } from "../../shared/types/pagination";
import { normalizePaginated, unwrapData } from "../../shared/api/normalize";
import { useApiMutation } from "@/shared/hooks/useApiMutation";

export function useQuestions(params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string[];
  enabled?: boolean;
}) {
  const { limit = 15, search = "", sortBy = [], enabled = true } = params;
  return useInfiniteQuery({
    queryKey: ["questions", { limit, search, sortBy }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await http.get<unknown>("/questions", {
        params: { page: pageParam, limit, search, sortBy },
      });
      const raw = res.data as unknown;
      const { data, meta } = normalizePaginated<Question>(raw, {
        fallbackLimit: limit,
        pageParam: Number(pageParam) || 1,
      });
      return { data, meta } as Paginated<Question>;
    },
    getNextPageParam: (last) => {
      const cp = Number(last.meta?.currentPage ?? 1);
      const tp = Number(last.meta?.totalPages ?? 1);
      const next = cp + 1;
      return next <= tp ? next : undefined;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    enabled,
  });
}

export function useQuestion(id?: string | number) {
  return useQuery<Question>({
    queryKey: ["question", id],
    queryFn: async () => {
      const res = await http.get(`/questions/${id}`);
      return unwrapData<Question>(res.data as unknown);
    },
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

export function useCreateAnswer(questionId: string | number) {
  const qc = useQueryClient();
  type CreateAnswerResult = unknown;
  return useApiMutation<CreateAnswerResult, string>({
    mutationFn: async (content: string) => {
      const res = await http.post<CreateAnswerResult>("/answers", {
        content,
        questionId: Number(questionId),
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question", questionId] });
    },
    notifySuccessMessage: "Ответ добавлен",
  });
}

export function useSetAnswerState(questionId: string | number) {
  const qc = useQueryClient();
  return useApiMutation<
    unknown,
    { answerId: string | number; state: "correct" | "incorrect" }
  >({
    mutationFn: async ({ answerId, state }) => {
      const idNum = Number(answerId);
      const res = await http.put(`/answers/${idNum}/state/${state}`);
      return res.data as unknown;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question", questionId] });
      qc.invalidateQueries({ queryKey: ["questions"] });
    },
    notifySuccessMessage: () => undefined,
    suppressErrorToast: true,
    onError: () => {
      qc.invalidateQueries({ queryKey: ["question", questionId] });
      emitNotification({
        type: "error",
        message: "Не удалось обновить статус ответа. Попробуйте ещё раз.",
      });
    },
  });
}

export function useUpdateAnswer(questionId: string | number) {
  const qc = useQueryClient();
  return useApiMutation<
    unknown,
    { answerId: string | number; content: string }
  >({
    mutationFn: async ({ answerId, content }) => {
      const res = await http.patch(`/answers/${Number(answerId)}`, { content });
      return res.data as unknown;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question", questionId] });
    },
    notifySuccessMessage: "Ответ обновлён",
  });
}

export function useDeleteAnswer(questionId: string | number) {
  const qc = useQueryClient();
  return useApiMutation<unknown, string | number>({
    mutationFn: async (answerId) => {
      const res = await http.delete(`/answers/${Number(answerId)}`);
      return res.data as unknown;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question", questionId] });
    },
    notifySuccessMessage: "Ответ удалён",
  });
}

export function useCreateQuestion() {
  const qc = useQueryClient();
  return useApiMutation<Question, CreateQuestionDto>({
    mutationFn: async (dto) => {
      const res = await http.post<unknown>("/questions", dto);
      return unwrapData<Question>(res.data as unknown);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["questions"] });
    },
    notifySuccessMessage: "Вопрос создан",
  });
}

export function useUpdateQuestion(id: string | number) {
  const qc = useQueryClient();
  return useApiMutation<Question, CreateQuestionDto>({
    mutationFn: async (dto) => {
      const res = await http.patch<unknown>(`/questions/${id}`, dto);
      return unwrapData<Question>(res.data as unknown);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question", id] });
      qc.invalidateQueries({ queryKey: ["questions"] });
    },
    notifySuccessMessage: "Вопрос обновлён",
  });
}

export function useDeleteQuestion(id: string | number) {
  const qc = useQueryClient();
  return useApiMutation<unknown, void>({
    mutationFn: async () => {
      const res = await http.delete<unknown>(`/questions/${id}`);
      return res.data as unknown;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["questions"] });
    },
    notifySuccessMessage: "Вопрос удалён",
  });
}
