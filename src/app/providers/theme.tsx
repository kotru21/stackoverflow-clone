import { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./theme-context";

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;
  const isDark = theme === "dark";
  root.toggleAttribute("data-theme", true);
  root.setAttribute("data-theme", theme);
  if (isDark) root.classList.add("dark");
  else root.classList.remove("dark");
  if (body) {
    body.toggleAttribute("data-theme", true);
    body.setAttribute("data-theme", theme);
    if (isDark) body.classList.add("dark");
    else body.classList.remove("dark");
  }
}

function readInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    // По умолчанию уважаем системную настройку
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
  } catch {
    // ignore
  }
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    applyThemeClass(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
