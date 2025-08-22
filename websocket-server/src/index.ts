import { WSServer } from "./modules/core/server";
import { registerCommentsGateway } from "./modules/comments/commentsGateway";

const PORT = Number(process.env.PORT) || 4000;
const wsServer = new WSServer({
  port: PORT,
  corsOrigin: ["http://localhost:5173"],
});
registerCommentsGateway(wsServer);

console.log(`Socket.io server started on ws://localhost:${PORT}`);
