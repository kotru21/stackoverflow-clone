# WebSocket (Socket.io) сервер комментариев

Запуск dev:

```bash
cd websocket-server
npm run dev
```

Сборка и запуск prod:

```bash
npm run build
npm start
```

Эндпоинт: ws://localhost:4000 (socket.io протокол)

События:

- join (room: string) – подписка на `snippet:{id}` или `question:{id}`
- leave (room: string)
- comment:create { content, snippetId? , questionId? }
- comment:created (payload комментария)
- comment:error { message }

Поток:

1. Клиент делает HTTP POST /comments (persist) -> 201
2. Клиент (или сервер после повторного подтверждения) вызывает socket emit comment:create
3. Сервер сохраняет (saveComment) и рассылает comment:created в соответствующую комнату

Отладка: в dev включены логи join/leave и connect.
