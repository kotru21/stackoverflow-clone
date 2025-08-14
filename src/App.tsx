import { Outlet } from "react-router-dom";
import { useAuth } from "./app/providers/useAuth";
import { useTheme } from "./app/providers/useTheme";
import HeaderView from "./app/ui/HeaderView";

export default function App() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-dvh flex flex-col bg-white text-black dark:bg-neutral-900 dark:text-white">
      <HeaderView
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
