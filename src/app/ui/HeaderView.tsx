import { Link } from "react-router-dom";
import { memo } from "react";
import { Button } from "@/shared/ui/Button";
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
          <Button
            onClick={onToggleTheme}
            size="xs"
            variant="outline"
            aria-label="Toggle theme">
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          {user ? (
            <>
              <Link
                to="/account"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                aria-label="Открыть профиль">
                <Avatar username={user.username} size={24} />
                {user.username}
              </Link>
              <Link to="/create" className="contents">
                <Button size="xs">Создать</Button>
              </Link>
              <Link to="/my" className="contents">
                <Button size="xs">Мои</Button>
              </Link>
              <Button onClick={onLogout} size="xs">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="contents">
                <Button size="xs" variant="primary">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default memo(HeaderView);
