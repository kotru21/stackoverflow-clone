import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

http.interceptors.response.use(
  (r) => r,
  (error) => {
    return Promise.reject(error);
  }
);

export type HttpError = {
  status?: number;
  message?: string;
};

export function toHttpError(e: unknown): HttpError {
  if (typeof e === "object" && e !== null) {
    const errObj = e as Record<string, unknown>;
    const hasResponse =
      "response" in errObj &&
      typeof errObj.response === "object" &&
      errObj.response !== null;
    const res = hasResponse ? (errObj.response as Record<string, unknown>) : undefined;
    const status = res && "status" in res ? (res.status as number | undefined) : undefined;
    const data = res && "data" in res ? (res.data as unknown) : undefined;

    const extractMessage = (val: unknown): string | undefined => {
      if (typeof val === "string") return val;
      if (Array.isArray(val)) return (val as unknown[]).map(String).join("\n");
      if (val && typeof val === "object") {
        const obj = val as Record<string, unknown>;
        if (typeof obj.message === "string") return obj.message as string;
        if (Array.isArray(obj.message)) return (obj.message as unknown[]).map(String).join("\n");
        if (Array.isArray(obj.errors)) return (obj.errors as unknown[]).map(String).join("\n");
      }
      return undefined;
    };

    const message = extractMessage(data) ?? (typeof errObj.message === "string" ? (errObj.message as string) : undefined);
    return { status, message };
  }
  return { message: String(e) };
}
