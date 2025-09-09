import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const userSchema = z.object({
  id: z.coerce.number().int().nonnegative().default(0),
  username: z.coerce.string().trim().default(""),
  role: z.union([z.literal("user"), z.literal("admin")]).default("user"),
});

const parseUser = (raw: unknown): User => {
  const data = userSchema.parse(raw);
  return { id: data.id, username: data.username, role: data.role };
};
import { http } from "@/shared/api/http";
import { toAppError } from "@/shared/api/app-error";
import { unwrapData } from "@/shared/api/normalize";
import { AuthContext, type User } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await http.get<unknown>("/auth");
      const raw = unwrapData<unknown>(res.data);
      setUser(parseUser(raw));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // mount-only init
    const initAuth = async () => {
      try {
        const res = await http.get<unknown>("/auth");
        const raw = unwrapData<unknown>(res.data);
        setUser(parseUser(raw));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    void initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await http.post("/auth/login", { username, password });
      await refresh();
    } catch (e) {
      const err = toAppError(e);
      const error = new Error(err.message || "Login failed");
      (error as Error & { status?: number }).status = err.status;
      throw error;
    }
  };

  const logout = async () => {
    try {
      await http.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  };

  const register = async (username: string, password: string) => {
    try {
      await http.post("/register", { username, password });
    } catch (e) {
      const err = toAppError(e);
      const error = new Error(err.message || "Register failed");
      (error as Error & { status?: number }).status = err.status;
      throw error;
    }
  };

  return (
    <AuthContext value={{ user, loading, login, logout, register, refresh }}>
      {children}
    </AuthContext>
  );
}
