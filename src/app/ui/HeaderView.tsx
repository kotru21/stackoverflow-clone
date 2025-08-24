import { Link } from "react-router-dom";
import { memo } from "react";
import Avatar from "../../shared/ui/Avatar";

export type HeaderViewProps = {
  user: { username: string } | null;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
  atTop: boolean;
};

function HeaderView({
  user,
  theme,
  onToggleTheme,
  onLogout,
  atTop,
}: HeaderViewProps) {
  return (
    <header
      className={
        "sticky top-0 z-50 px-4 border-b bg-white text-black dark:bg-neutral-900 dark:text-white transition-all duration-200 ease-in-out " +
        (atTop ? "py-5" : "py-2")
      }>
      <nav className="mx-auto max-w-6xl flex items-center gap-4">
        <Link to="/" className="font-semibold">
          kinda StackOverflow
        </Link>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <button
            onClick={onToggleTheme}
            className="px-2 py-1 border rounded"
            aria-label="Toggle theme">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user ? (
            <>
              <Link
                to="/account"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                aria-label="Открыть профиль">
                <Avatar username={user.username} size={24} />
                {user.username}
              </Link>
              <Link to="/create" className="px-2 py-1 border rounded">
                Создать
              </Link>
              <Link to="/my" className="px-2 py-1 border rounded">
                Мои
              </Link>
              <button onClick={onLogout} className="px-2 py-1 border rounded">
                Logout +{" "}
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

export default memo(HeaderView);
