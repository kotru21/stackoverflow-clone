import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../app/providers/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";

const schema = z.object({
  username: z.string().min(5),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

type LocationState = { from?: { pathname?: string } };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const state = (loc.state || {}) as LocationState;
  const from = state.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.username, data.password);
      navigate(from, { replace: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ошибка входа";
      setError("root", { message });
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Вход</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-red-600 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {errors.root?.message && (
          <p className="text-xs text-red-600">{errors.root.message}</p>
        )}
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
