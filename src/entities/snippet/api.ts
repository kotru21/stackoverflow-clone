import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { http } from "../../shared/api/http";
import type { Paginated, Snippet, SnippetMark } from "./types";
import { normalizePaginated } from "../../shared/api/normalize";

export function useSnippets(params: {
  page?: number;
  limit?: number;
  search?: string;
  userId?: number;
}) {
  const { limit = 15, search = "", userId } = params;
  return useInfiniteQuery({
    queryKey: ["snippets", { search, userId, limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await http.get<unknown>("/snippets", {
        params: { page: pageParam, limit, search, userId },
      });
      const raw = res.data as unknown;
      const { data, meta } = normalizePaginated<Snippet>(raw, {
        fallbackLimit: limit,
        pageParam: Number(pageParam) || 1,
      });
      return { data, meta } as Paginated<Snippet>;
    },
    getNextPageParam: (lastPage) => {
      const cp = Number(lastPage.meta?.currentPage ?? 1);
      const tp = Number(lastPage.meta?.totalPages ?? 1);
      const next = cp + 1;
      return next <= tp ? next : undefined;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
  });
}

export function useSnippet(id?: number) {
  return useQuery({
    queryKey: ["snippets", id],
    queryFn: async () => (await http.get<Snippet>(`/snippets/${id}`)).data,
    enabled: !!id,
  });
}

export function useMarkSnippet(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (mark: SnippetMark) => {
      await http.post(`/snippets/${id}/mark`, { mark });
      return mark;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["snippets"] });
      qc.invalidateQueries({ queryKey: ["snippets", id] });
    },
  });
}
