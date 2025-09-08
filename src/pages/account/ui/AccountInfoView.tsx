import { memo } from "react";
import Avatar from "@/shared/ui/Avatar";

export type AccountInfoViewProps = {
  id?: number;
  username?: string;
  role?: string;
  loading?: boolean;
};

import { Skeleton } from "@/shared/ui/Skeleton";

export const AccountInfoView = memo(function AccountInfoView({
  id,
  username,
  role,
  loading,
}: AccountInfoViewProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-3">
        {username && <Avatar username={username} size={44} />}
        <h1 className="text-2xl font-semibold">@{username}</h1>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton width={220} height={16} />
          <Skeleton width={160} height={16} />
          <Skeleton width={120} height={16} />
        </div>
      ) : typeof id === "number" && username && role ? (
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <div>
            Роль: <span className="font-mono">{role}</span>
          </div>
          <div>
            ID: <span className="font-mono">{id}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          Не удалось загрузить данные пользователя.
        </p>
      )}
    </section>
  );
});

export default AccountInfoView;
