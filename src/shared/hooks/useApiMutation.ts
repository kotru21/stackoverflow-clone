import { useMutation } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { toAppError, isAppError } from "@/shared/api/app-error";
import { emitNotification } from "@/shared/notifications";

// Обёртка над useMutation: единообразный onError (toast + возврат AppError)
export function useApiMutation<
  TData = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, unknown, TVariables, TContext> & {
    notifySuccessMessage?: string | ((data: TData) => string | undefined);
    suppressErrorToast?: boolean;
  }
): UseMutationResult<TData, unknown, TVariables, TContext> {
  const {
    onError,
    onSuccess,
    notifySuccessMessage,
    suppressErrorToast,
    ...rest
  } = options;
  return useMutation<TData, unknown, TVariables, TContext>({
    ...rest,
    onError: (error, vars, onMutateResult, ctx) => {
      const appErr = toAppError(error);
      if (!suppressErrorToast) {
        emitNotification({ type: "error", message: appErr.message });
      }
      onError?.(appErr, vars, onMutateResult, ctx);
    },
    onSuccess: (data, vars, onMutateResult, ctx) => {
      let msg: string | undefined;
      if (typeof notifySuccessMessage === "string") msg = notifySuccessMessage;
      else if (typeof notifySuccessMessage === "function")
        msg = notifySuccessMessage(data);
      if (msg) emitNotification({ type: "success", message: msg });
      onSuccess?.(data, vars, onMutateResult, ctx);
    },
  } as UseMutationOptions<TData, unknown, TVariables, TContext>);
}

export function getErrorMessage(e: unknown) {
  if (isAppError(e)) return e.message;
  if (e instanceof Error) return e.message;
  return String(e);
}
