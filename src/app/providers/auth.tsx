import { useCallback, useEffect, useRef, useState } from "react";
import { http, toHttpError } from "../../shared/api/http";
import { unwrapData } from "../../shared/api/normalize";
import { AuthContext, type User } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await http.get<unknown>("/auth");
      const raw = unwrapData<unknown>(res.data);
      const normalized: User = {
        id: Number((raw as Record<string, unknown>)?.["id"] ?? 0),
        username: String((raw as Record<string, unknown>)?.["username"] ?? ""),
        role:
          ((raw as Record<string, unknown>)?.["role"] as "user" | "admin") ||
          "user",
      };
      setUser(normalized);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    void refresh();
  }, [refresh]);

  const login = async (username: string, password: string) => {
    try {
      await http.post("/auth/login", { username, password });
      await refresh();
    } catch (e) {
      const err = toHttpError(e);
      const error = new Error(err.message || "Login failed");
      (error as Error & { status?: number }).status = err.status;
      throw error;
    }
  };

  const logout = async () => {
    await http.post("/auth/logout");
    setUser(null);
  };

  const register = async (username: string, password: string) => {
    try {
      await http.post("/register", { username, password });
    } catch (e) {
      const err = toHttpError(e);
      const error = new Error(err.message || "Register failed");
      (error as Error & { status?: number }).status = err.status;
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
