import { Outlet } from "react-router-dom";
import { useAuth } from "./app/providers/useAuth";
import { useTheme } from "./app/providers/useTheme";
import Header from "./app/Header";

export default function App() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-dvh flex flex-col bg-white text-black dark:bg-neutral-900 dark:text-white">
      <Header
        user={user}
        theme={theme}
        onToggleTheme={toggle}
        onLogout={() => void logout()}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
