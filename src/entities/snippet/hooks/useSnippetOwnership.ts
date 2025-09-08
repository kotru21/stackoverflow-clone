import { useMemo } from "react";
import { useAuth } from "@/app/providers/useAuth";
import type { Snippet } from "../types";

export function useSnippetOwnership(snippet: Snippet | undefined) {
  const { user } = useAuth();
  return useMemo(() => {
    if (!user || !snippet) return false;
    const sUser = snippet.user;
    if (!sUser) return false;
    return (
      String(user.id) === String(sUser.id) || user.username === sUser.username
    );
  }, [user, snippet]);
}
