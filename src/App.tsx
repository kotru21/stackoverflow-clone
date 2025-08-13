import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./app/providers/useAuth";
import { useTheme } from "./app/providers/useTheme";

function Header() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <header className="px-4 py-3 border-b bg-white text-black dark:bg-neutral-900 dark:text-white">
      <nav className="mx-auto max-w-6xl flex items-center gap-4">
        <Link to="/" className="font-semibold">
          kinda StackOverflow
        </Link>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <button
            onClick={toggle}
            className="px-2 py-1 border rounded"
            aria-label="Toggle theme">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user ? (
            <>
              <span className="text-gray-600 dark:text-gray-300">
                {user.username}
              </span>
              <Link to="/account">Account</Link>
              <button
                onClick={() => void logout()}
                className="px-2 py-1 border rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="px-2 py-1 border rounded">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-black dark:bg-neutral-900 dark:text-white">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
