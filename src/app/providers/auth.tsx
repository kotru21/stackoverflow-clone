import { useEffect, useRef, useState } from "react";
import { http, toHttpError } from "../../shared/api/http";
import { AuthContext, type User } from "./auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await http.get<User>("/auth");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    void refresh();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await http.post("/auth/login", { username, password });
      await refresh();
    } catch (e) {
      const err = toHttpError(e);
      throw new Error(err.message || "Login failed");
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
      throw new Error(err.message || "Register failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
