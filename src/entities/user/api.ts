import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { http } from "../../shared/api/http";
import { normalizePaginated, unwrapData } from "../../shared/api/normalize";
import type { Paginated } from "../../shared/types/pagination";
import type { User, UserStatistic } from "./types";

export function useUsers(params?: {
  page?: number;
  limit?: number;
  sortBy?: string[];
  search?: string;
  searchBy?: string[];
  enabled?: boolean;
}) {
  const { limit = 15, sortBy, search, searchBy, enabled = true } = params ?? {};
  return useInfiniteQuery({
    queryKey: ["users", { limit, sortBy, search, searchBy }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await http.get<unknown>("/users", {
        params: { page: pageParam, limit, sortBy, search, searchBy },
      });
      const raw = res.data as unknown;
      const { data, meta } = normalizePaginated<User>(raw, {
        fallbackLimit: limit,
        pageParam: Number(pageParam) || 1,
      });
      return { data, meta } as Paginated<User>;
    },
    getNextPageParam: (lastPage) => {
      const cp = Number(lastPage.meta?.currentPage ?? 1);
      const tp = Number(lastPage.meta?.totalPages ?? 1);
      const next = cp + 1;
      return next <= tp ? next : undefined;
    },
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    enabled,
  });
}

export function useUser(id?: number) {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await http.get(`/users/${id}`);
      const raw = unwrapData<{
        id: number | string;
        username: string;
        role: "user" | "admin";
      }>(res.data as unknown);
      return {
        id: Number(raw.id),
        username: raw.username,
        role: raw.role,
      } satisfies User;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useUserStatistic(id?: number) {
  return useQuery<{ user: User; statistic: UserStatistic }>({
    queryKey: ["user-stat", id],
    queryFn: async () => {
      const res = await http.get(`/users/${id}/statistic`);
      const raw = unwrapData<{
        id: number | string;
        username: string;
        role: "user" | "admin";
        statistic: UserStatistic;
      }>(res.data as unknown);
      const user: User = {
        id: Number(raw.id),
        username: raw.username,
        role: raw.role,
      };
      return { user, statistic: raw.statistic };
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useMe() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await http.get(`/me`);
      const raw = unwrapData<{
        id: number | string;
        username: string;
        role: "user" | "admin";
      }>(res.data as unknown);
      return {
        id: Number(raw.id),
        username: raw.username,
        role: raw.role,
      } satisfies User;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { username: string }) => {
      const res = await http.patch(`/me`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (payload: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const res = await http.patch(`/me/password`, payload);
      return res.data;
    },
  });
}

export function useDeleteMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await http.delete(`/me`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
