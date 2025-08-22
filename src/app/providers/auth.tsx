import { useCallback, useEffect, useRef, useState } from "react";
import { http, toHttpError, setAuthToken } from "../../shared/api/http";
import { unwrapData } from "../../shared/api/normalize";
import { AuthContext, type User } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const storeTokenFromRaw = (raw: unknown) => {
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      const tokenLike = (obj["accessToken"] || obj["token"] || obj["jwt"]) as
        | string
        | undefined;
      if (typeof tokenLike === "string" && tokenLike.length > 10) {
        setAuthToken(tokenLike);
        try {
          localStorage.setItem("authToken", tokenLike);
        } catch {
          // ignore localStorage write errors
        }
      }
    }
  };

  const refresh = useCallback(async () => {
    try {
      const res = await http.get<unknown>("/auth");
      const raw = unwrapData<unknown>(res.data);
      storeTokenFromRaw(raw);
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
    // Восстанавливаем токен из localStorage (если API не использует httpOnly cookie)
    try {
      const saved = localStorage.getItem("authToken");
      if (saved) setAuthToken(saved);
    } catch {
      // ignore localStorage errors
    }
    void refresh();
  }, [refresh]);

  const login = async (username: string, password: string) => {
    try {
      const res = await http.post("/auth/login", { username, password });
      const raw = unwrapData<unknown>(res.data);
      storeTokenFromRaw(raw);
      await refresh();
    } catch (e) {
      const err = toHttpError(e);
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
    setAuthToken(null);
    try {
      localStorage.removeItem("authToken");
    } catch {
      // ignore localStorage errors
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await http.post("/register", { username, password });
      const raw = unwrapData<unknown>(res.data);
      storeTokenFromRaw(raw);
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
