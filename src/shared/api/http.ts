import axios from "axios";
import { toAppError, isAppError } from "./app-error";

//  /api (Vite proxy) или переопределение через VITE_API_BASE_URL
const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_BASE_URL || "/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

// Axios interceptor
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const appErr = toAppError(error);
    if (appErr.status === 401) {
      try {
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const isPublic =
            path === "/" ||
            /^\/questions\//.test(path) ||
            /^\/snippets\//.test(path) ||
            /\/login|\/register/.test(path);
          if (!isPublic) {
            const search = window.location.search || "";
            const from = encodeURIComponent(path + search);
            window.location.assign(`/login?from=${from}`);
          }
        }
      } catch {
        // ignore redirect failures
      }
    }
    return Promise.reject(appErr);
  }
);

export function asAppError(e: unknown) {
  return isAppError(e) ? e : toAppError(e);
}
