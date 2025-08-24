import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/providers/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import LoginFormView from "./ui/LoginFormView";

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
    <LoginFormView
      onSubmit={handleSubmit(onSubmit)}
      usernameInputProps={register("username")}
      passwordInputProps={register("password")}
      errors={{
        username: errors.username?.message,
        password: errors.password?.message,
        root: errors.root?.message,
      }}
      isSubmitting={isSubmitting}
    />
  );
}
