import { Server, Socket } from "socket.io";
import { createServer } from "http";

export interface WSServerOptions {
  port: number;
  corsOrigin?: string | string[];
}

export class WSServer {
  public io: Server;

  constructor(opts: WSServerOptions) {
    const httpServer = createServer();
    this.io = new Server(httpServer, {
      cors: {
        origin: opts.corsOrigin || true,
        credentials: true,
      },
    });

    this.io.on("connection", (socket) => this.onConnection(socket));
    httpServer.listen(opts.port);
  }

  private onConnection(socket: Socket) {
    socket.on("join", (room: string) => {
      if (typeof room === "string") {
        socket.join(room);
        if (process.env.NODE_ENV !== "production") {
          console.log(`[ws] ${socket.id} joined ${room}`);
        }
      }
    });
    socket.on("leave", (room: string) => {
      if (typeof room === "string") {
        socket.leave(room);
        if (process.env.NODE_ENV !== "production") {
          console.log(`[ws] ${socket.id} left ${room}`);
        }
      }
    });
  }
}
