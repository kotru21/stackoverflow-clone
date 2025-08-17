import { Link } from "react-router-dom";
import { memo } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";

export type LoginFormViewProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  usernameInputProps: InputHTMLAttributes<HTMLInputElement>;
  passwordInputProps: InputHTMLAttributes<HTMLInputElement>;
  errors?: {
    username?: string;
    password?: string;
    root?: string;
  };
  isSubmitting?: boolean;
};

function LoginFormView({
  onSubmit,
  usernameInputProps,
  passwordInputProps,
  errors,
  isSubmitting,
}: LoginFormViewProps) {
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Вход</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...usernameInputProps}
          />
          {errors?.username && (
            <p className="text-xs text-red-600 mt-1">{errors.username}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...passwordInputProps}
          />
          {errors?.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>
        {errors?.root && <p className="text-xs text-red-600">{errors.root}</p>}
        <button
          disabled={isSubmitting}
          className="w-full bg-black text-white dark:bg-white dark:text-black rounded py-2 disabled:opacity-50">
          {isSubmitting ? "Вход..." : "Войти"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-3">
        Нет аккаунта?{" "}
        <Link
          to="/register"
          className="underline text-blue-600 dark:text-blue-400">
          Зарегистрируйтесь
        </Link>
      </p>
    </div>
  );
}

export default memo(LoginFormView);
