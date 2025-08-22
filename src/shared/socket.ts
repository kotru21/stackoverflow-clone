import { io, type Socket } from "socket.io-client";

// Правильный доступ к Vite env
const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const isDev = import.meta.env.DEV;
const DEFAULT_PATH =
  API_BASE && API_BASE.startsWith("/api") ? "/api/socket.io" : "/socket.io";
const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined) ||
  (isDev ? "http://localhost:4000" : undefined);
const SOCKET_PATH =
  (import.meta.env.VITE_SOCKET_PATH as string | undefined) || DEFAULT_PATH;

let socketRef: Socket | null = null;

export function getSocket(): Socket {
  if (socketRef) return socketRef;
  socketRef = io(SOCKET_URL ?? window.location.origin, {
    path: SOCKET_PATH,
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket"],
  });
  if (isDev) {
    socketRef.on("connect", () => {
      console.log("[socket] connected", {
        id: socketRef?.id,
        url: SOCKET_URL,
        path: SOCKET_PATH,
      });
    });
    socketRef.io.on("error", (err) => {
      console.error("[socket] error", err);
    });
    socketRef.on("connect_error", (err) => {
      console.error("[socket] connect_error", err.message);
    });
  }
  return socketRef;
}

export function closeSocket() {
  if (socketRef) {
    socketRef.close();
    socketRef = null;
  }
}
