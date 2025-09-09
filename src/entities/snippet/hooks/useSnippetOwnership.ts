import { useMemo } from "react";
import { useAuth } from "@/app/providers/useAuth";
import type { Snippet } from "../types";

export function useSnippetOwnership(snippet: Snippet | undefined) {
  const { user } = useAuth();
  return useMemo(() => {
    if (!user || !snippet?.user) return false;
    const sUser = snippet.user;
    if (sUser.id !== undefined && sUser.id !== null) {
      return String(user.id) === String(sUser.id);
    }
    // Fallback: сравнение по username, если id отсутствует
    return user.username === sUser.username;
  }, [user, snippet]);
}
