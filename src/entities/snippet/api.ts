import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { http } from "../../shared/api/http";
import type { Snippet, SnippetMark, Comment as SnippetComment } from "./types";
import type { Paginated } from "../../shared/types/pagination";
import { normalizePaginated, unwrapData } from "../../shared/api/normalize";

export function useSnippets(params: {
  page?: number;
  limit?: number;
  search?: string;
  userId?: number;
  enabled?: boolean;
}) {
  const { limit = 15, search = "", userId, enabled = true } = params;
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
    enabled,
  });
}

export function useSnippet(id?: number) {
  return useQuery<Snippet>({
    queryKey: ["snippet", id],
    queryFn: async () => {
      const res = await http.get(`/snippets/${id}`);
      type ApiUser = {
        id: number | string;
        username: string;
        role: "user" | "admin";
      };
      type ApiMark = {
        id: number | string;
        type: "like" | "dislike";
        user: ApiUser;
      };
      type ApiSnippetDetail = {
        id: number | string;
        language?: string;
        code?: string;
        user?: ApiUser;
        marks?: ApiMark[];
        comments?: { id: number | string; content: string; user: ApiUser }[];
      };
      const raw = unwrapData<ApiSnippetDetail>(res.data as unknown);
      const likesCount = Array.isArray(raw?.marks)
        ? raw.marks.filter((m) => m?.type === "like").length
        : undefined;
      const dislikesCount = Array.isArray(raw?.marks)
        ? raw.marks.filter((m) => m?.type === "dislike").length
        : undefined;
      const apiComments = Array.isArray(raw?.comments) ? raw!.comments : [];
      const comments: SnippetComment[] | undefined = apiComments.length
        ? apiComments.map((c) => ({
            id: Number(c.id),
            content: c.content,
            user: {
              id: Number(c.user.id),
              username: c.user.username,
              role: c.user.role,
            },
          }))
        : undefined;
      const commentsCount =
        comments?.length ??
        (Array.isArray(raw?.comments) ? raw!.comments!.length : undefined);
      const normalized: Snippet = {
        id: Number(raw?.id ?? 0),
        language: String(raw?.language ?? ""),
        code: String(raw?.code ?? ""),
        user: raw?.user
          ? {
              id: Number(raw.user.id),
              username: raw.user.username,
              role: raw.user.role,
            }
          : { id: 0, username: "unknown", role: "user" },
        likesCount,
        dislikesCount,
        commentsCount,
        comments,
      };
      return normalized;
    },
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
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
      qc.invalidateQueries({ queryKey: ["snippet", id] });
    },
  });
}
