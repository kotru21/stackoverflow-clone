import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { http } from "../../shared/api/http";
import type { Question } from "./types";
import type { Paginated } from "../../shared/types/pagination";
import { normalizePaginated, unwrapData } from "../../shared/api/normalize";

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
    refetchOnWindowFocus: false,
  });
}

export function useCreateAnswer(questionId: string | number) {
  const qc = useQueryClient();
  type CreateAnswerResult = unknown;
  return useMutation({
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
  });
}
