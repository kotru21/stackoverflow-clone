import { memo } from "react";
import { Button } from "@/shared/ui/Button";

export type ProfileFormViewProps = {
  username: string;
  onUsernameChange: (v: string) => void;
  onSave: () => void;
  isPending?: boolean;
  loading?: boolean;
};

import { Skeleton } from "@/shared/ui/Skeleton";

export const ProfileFormView = memo(function ProfileFormView({
  username,
  onUsernameChange,
  onSave,
  isPending,
  loading,
}: ProfileFormViewProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm">Имя пользователя</label>
      {loading ? (
        <>
          <Skeleton height={38} className="rounded" />
          <Skeleton width={160} height={36} className="rounded" />
        </>
      ) : (
        <>
          <input
            className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="username"
          />
          <Button
            type="button"
            disabled={!!isPending}
            loading={!!isPending}
            onClick={onSave}
            size="sm"
            variant="primary">
            Сохранить профиль
          </Button>
        </>
      )}
    </div>
  );
});

export default ProfileFormView;
