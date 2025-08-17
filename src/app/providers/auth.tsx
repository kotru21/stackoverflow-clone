import { useCallback, useEffect, useRef, useState } from "react";
import { http, toHttpError } from "../../shared/api/http";
import { unwrapData } from "../../shared/api/normalize";
import { AuthContext, type User } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const getDebugEnabled = () => {
    try {
      const envDev = Boolean(
        (import.meta as unknown as { env?: Record<string, unknown> }).env?.DEV
      );
      const qs =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : undefined;
      const fromQuery = qs?.get("debugQuestionPage") === "1";
      const fromLocal =
        typeof window !== "undefined" &&
        !!window.localStorage &&
        window.localStorage.getItem("debugQuestionPage") === "1";
      return envDev || !!fromQuery || !!fromLocal;
    } catch {
      return false;
    }
  };

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
      if (getDebugEnabled()) {
        console.log("[AuthProvider] /auth OK:", res.status, {
          data: normalized,
        });
      }
      setUser(normalized);
    } catch {
      if (getDebugEnabled()) {
        try {
          const err = await http
            .get("/auth")
            .then(() => undefined)
            .catch((e) => toHttpError(e));
          console.log("[AuthProvider] /auth FAIL:", err);
        } catch {
          console.log("[AuthProvider] /auth FAIL: unknown error");
        }
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (getDebugEnabled()) console.log("[AuthProvider] mount");
    void refresh();
  }, [refresh]);

  const login = async (username: string, password: string) => {
    try {
      await http.post("/auth/login", { username, password });
      await refresh();
      if (getDebugEnabled()) {
        console.log("[AuthProvider] login complete; user=", user);
      }
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
    if (getDebugEnabled()) console.log("[AuthProvider] logout done");
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
