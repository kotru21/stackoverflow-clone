import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "../../shared/ui/Avatar";

export type HeaderViewProps = {
  user: { username: string } | null;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLogout: () => void;
};

export default function HeaderView({
  user,
  theme,
  onToggleTheme,
  onLogout,
}: HeaderViewProps) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY <= 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-50 px-4 border-b bg-white text-black dark:bg-neutral-900 dark:text-white transition-all duration-300 " +
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
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Avatar username={user.username} size={24} />
                {user.username}
              </span>
              <Link to="/account">Account</Link>
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
