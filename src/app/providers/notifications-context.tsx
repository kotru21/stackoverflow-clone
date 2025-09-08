import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  type NotificationPayload,
  subscribeNotifications,
  emitNotification,
} from "@/shared/notifications";

import {
  NotificationsContext,
  type NotificationsContextValue,
} from "./notifications-core.ts";

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<NotificationPayload[]>([]);
  const timeouts = useRef<Record<string | number, number>>({});

  const remove = (id: NotificationPayload["id"]) => {
    if (id == null) return;
    setItems((prev) => prev.filter((n) => n.id !== id));
    const tid = timeouts.current[id];
    if (tid) {
      clearTimeout(tid);
      delete timeouts.current[id];
    }
  };

  const add = useCallback((p: NotificationPayload) => {
    setItems((prev) => [...prev, p]);
    if (p.ttlMs) {
      const tid = window.setTimeout(() => remove(p.id), p.ttlMs);
      timeouts.current[p.id!] = tid;
    }
  }, []);

  useEffect(() => subscribeNotifications(add), [add]);

  useEffect(
    () => () => {
      Object.values(timeouts.current).forEach(clearTimeout);
    },
    []
  );

  const notify: NotificationsContextValue["notify"] = (
    p: Omit<NotificationPayload, "id">
  ) => emitNotification(p);

  return (
    <NotificationsContext.Provider value={{ items, notify, remove }}>
      {children}
      <NotificationsPortal />
    </NotificationsContext.Provider>
  );
}

function NotificationsPortal() {
  // ленивый импорт через require чтобы избежать цикла типов (не обяз.) – оставим прямой доступ
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) return null;
  const { items, remove } = ctx;
  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2 max-w-sm">
      {items.map((n: NotificationPayload) => (
        <div
          key={n.id}
          className={
            "rounded shadow px-4 py-3 text-sm flex items-start gap-2 border " +
            (n.type === "error"
              ? "bg-red-600/90 text-white border-red-500"
              : n.type === "success"
              ? "bg-green-600/90 text-white border-green-500"
              : n.type === "warning"
              ? "bg-yellow-500/90 text-black border-yellow-400"
              : "bg-neutral-800/90 text-white border-neutral-700")
          }>
          <div className="flex-1 whitespace-pre-wrap">{n.message}</div>
          <button
            onClick={() => remove(n.id)}
            className="ml-2 opacity-70 hover:opacity-100 transition text-xs"
            aria-label="Close notification">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
