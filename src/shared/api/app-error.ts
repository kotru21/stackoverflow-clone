// Централизованная модель ошибок приложения
// Позволяет единообразно классифицировать и отображать ошибки

export type ErrorKind =
  | "auth"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation"
  | "rate_limit"
  | "timeout"
  | "network"
  | "server"
  | "unknown";

export interface AppError {
  kind: ErrorKind;
  status?: number;
  message: string;
  details?: Record<string, string> | Array<{ field: string; message: string }>;
  raw?: unknown;
}

// Человекочитаемые дефолтные сообщения
const DEFAULT_MESSAGES: Record<ErrorKind, string> = {
  auth: "Нужна авторизация",
  forbidden: "Недостаточно прав",
  not_found: "Не найдено",
  conflict: "Уже существует",
  validation: "Исправьте ошибки в форме",
  rate_limit: "Слишком много запросов, попробуйте позже",
  timeout: "Сервер не ответил вовремя",
  network: "Нет соединения с сетью",
  server: "Внутренняя ошибка сервера",
  unknown: "Непредвиденная ошибка",
};

export function classifyStatus(status?: number): ErrorKind {
  if (!status) return "unknown";
  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422) return "validation";
  if (status === 429) return "rate_limit";
  if (status >= 500) return "server";
  return "unknown";
}

export function toAppError(err: unknown): AppError {
  if (isAppError(err)) return err;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { kind: "network", message: DEFAULT_MESSAGES.network, raw: err };
  }

  type PossibleAxios = {
    isAxiosError?: boolean;
    response?: { status?: number; data?: unknown };
    code?: string;
    message?: string;
  };
  const ax = err as PossibleAxios;
  const isAxios = !!ax?.isAxiosError;
  const status = ax?.response?.status;
  const data = ax?.response?.data;

  const extractMsg = (src: unknown): string | undefined => {
    if (src && typeof src === "object") {
      const r = src as Record<string, unknown>;
      const c = r.message || r.error || r.detail;
      if (typeof c === "string" && c.trim()) return c.trim();
    }
    return undefined;
  };
  const message =
    extractMsg(data) ||
    (typeof ax?.message === "string" ? ax.message : undefined);
  const kindBase = status ? classifyStatus(status) : undefined;

  if (ax?.code === "ECONNABORTED") {
    return {
      kind: "timeout",
      status,
      message: message || DEFAULT_MESSAGES.timeout,
      raw: err,
    };
  }

  if (isAxios && !ax?.response) {
    return {
      kind: "network",
      message: message || DEFAULT_MESSAGES.network,
      raw: err,
    };
  }

  let details: AppError["details"] | undefined;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const errors = d.errors as unknown;
    if (errors) {
      if (Array.isArray(errors)) {
        details = errors
          .filter(
            (e): e is Record<string, unknown> => !!e && typeof e === "object"
          )
          .map((e) => ({
            field: String(e.field || e.path || ""),
            message: String(e.message || ""),
          }));
      } else if (typeof errors === "object") {
        details = Object.entries(errors as Record<string, unknown>).reduce(
          (acc, [k, v]) => {
            if (typeof v === "string") acc[k] = v;
            return acc;
          },
          {} as Record<string, string>
        );
      }
    }
  }

  const kind = kindBase || "unknown";
  return {
    kind,
    status,
    message: message || DEFAULT_MESSAGES[kind],
    details,
    raw: err,
  };
}

export function isAppError(e: unknown): e is AppError {
  if (!e || typeof e !== "object") return false;
  return "kind" in e && "message" in e;
}

export function appErrorToLegacyHttpError(e: AppError) {
  return { status: e.status, message: e.message };
}
