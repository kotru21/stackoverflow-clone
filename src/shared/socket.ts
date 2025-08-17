import { io, type Socket } from "socket.io-client";

// Автоконфигурация пути под Vite proxy: если API ходит на /api, сокеты ждём на /api/socket.io
const API_BASE = (import.meta as unknown as { env?: Record<string, string> })
  .env?.VITE_API_BASE_URL;

const DEFAULT_PATH =
  API_BASE && API_BASE.startsWith("/api") ? "/api/socket.io" : "/socket.io";

const SOCKET_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_SOCKET_URL || undefined; // undefined => текущий origin
const SOCKET_PATH =
  (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_SOCKET_PATH || DEFAULT_PATH;

let socketRef: Socket | null = null;

export function getSocket(): Socket {
  if (socketRef) return socketRef;
  socketRef = io(SOCKET_URL, {
    path: SOCKET_PATH,
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket", "polling"],
  });
  return socketRef;
}

export function closeSocket() {
  if (socketRef) {
    socketRef.close();
    socketRef = null;
  }
}
