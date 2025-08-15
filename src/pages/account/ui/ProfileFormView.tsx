import { memo } from "react";

export type ProfileFormViewProps = {
  username: string;
  onUsernameChange: (v: string) => void;
  onSave: () => void;
  isPending?: boolean;
};

export const ProfileFormView = memo(function ProfileFormView({
  username,
  onUsernameChange,
  onSave,
  isPending,
}: ProfileFormViewProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm">Имя пользователя</label>
      <input
        className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="username"
      />
      <button
        type="button"
        disabled={!!isPending}
        onClick={onSave}
        className="px-3 py-1.5 border rounded disabled:opacity-50">
        Сохранить профиль
      </button>
    </div>
  );
});

export default ProfileFormView;
