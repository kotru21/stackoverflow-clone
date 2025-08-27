import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/providers/useAuth";
import { toAppError } from "@/shared/api/app-error";
import { emitNotification } from "@/shared/notifications";
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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.username, data.password);
      navigate(from, { replace: true });
    } catch (e) {
      const appErr = toAppError(e);
      emitNotification({
        type: "error",
        message: appErr.message || "Ошибка входа",
      });
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
      }}
      isSubmitting={isSubmitting}
    />
  );
}
