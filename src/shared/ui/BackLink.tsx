import { memo } from "react";
import { Link, useLocation } from "react-router-dom";

type BackLinkProps = {
  to?: string;
  label?: string;
  className?: string;
};

export const BackLink = memo(
  ({ to = "/", label = "← Назад", className }: BackLinkProps) => {
    const location = useLocation() as { state?: unknown };
    // Try to preserve the 'mode' when navigating back to Home
    const stateObj =
      location.state && typeof location.state === "object"
        ? (location.state as Record<string, unknown>)
        : undefined;
    const rawFromMode = stateObj?.["fromMode"];
    const fromMode = typeof rawFromMode === "string" ? rawFromMode : undefined;
    const search = new URLSearchParams();
    if (fromMode === "snippets" || fromMode === "questions")
      search.set("mode", fromMode);
    const toWithMode =
      to === "/" && search.toString() ? `${to}?${search.toString()}` : to;
    return (
      <div className={"text-sm " + (className ?? "")}>
        <Link to={toWithMode} className="text-blue-600 dark:text-blue-400">
          {label}
        </Link>
      </div>
    );
  }
);

export default BackLink;
