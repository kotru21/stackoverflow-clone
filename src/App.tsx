import { Outlet } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "@/app/providers/useAuth";
import { useTheme } from "@/app/providers/useTheme";
import Header from "@/app/Header";

export default function App() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const onLogout = useCallback(() => {
    void logout();
  }, [logout]);
  const onToggleTheme = useCallback(() => {
    toggle();
  }, [toggle]);
  return (
    <div className="min-h-dvh flex flex-col bg-white text-black dark:bg-neutral-900 dark:text-white">
      <Header
        user={user}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
