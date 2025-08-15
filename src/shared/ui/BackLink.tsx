import { memo } from "react";
import { Link } from "react-router-dom";

type BackLinkProps = {
  to?: string;
  label?: string;
  className?: string;
};

export const BackLink = memo(
  ({ to = "/", label = "← Назад", className }: BackLinkProps) => {
    return (
      <div className={"text-sm " + (className ?? "")}>
        <Link to={to} className="text-blue-600 dark:text-blue-400">
          {label}
        </Link>
      </div>
    );
  }
);

export default BackLink;
