import { WSServer } from "./modules/core/server";
import { registerCommentsGateway } from "./modules/comments/commentsGateway";

const PORT = Number(process.env.PORT) || 4000;
const wsServer = new WSServer({
  port: PORT,
  // Разрешаем и http, и https (локальные самоподписанные сертификаты)
  corsOrigin: ["http://localhost:5173", "https://localhost:5173"],
});
registerCommentsGateway(wsServer);

console.log(`Socket.io server started on ws://localhost:${PORT}`);
