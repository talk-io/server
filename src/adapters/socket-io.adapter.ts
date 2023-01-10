import { IoAdapter } from "@nestjs/platform-socket.io";
import { INestApplicationContext } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Server, ServerOptions, Socket } from "socket.io";
import { NextFunction } from "express";
import { UserDocument } from "../users/user.schema";
import { SocketWithUser } from "../types/socket";

export class SocketIoAdapter extends IoAdapter {
  private readonly usersService: UsersService;
  constructor(private readonly app: INestApplicationContext) {
    super(app);
    this.usersService = app.get(UsersService);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, options);

    server.use(verifyUserMiddleware(this.usersService));

    return server;
  }
}

const verifyUserMiddleware =
  (usersService: UsersService) =>
  async (socket: SocketWithUser, next: NextFunction) => {
    const { authorization } = socket.handshake.headers;
    const [_, token] = authorization.split(" ");

    if (!token) next(new Error("No Token provided!"));

    try {
      socket.user = await usersService.verifyUser(token);
      next();
    } catch (e) {
      console.log(e);
      next(new Error("Unauthorized"));
    }
  };
