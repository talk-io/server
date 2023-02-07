import { IoAdapter } from "@nestjs/platform-socket.io";
import { INestApplicationContext, Injectable } from "@nestjs/common";
import { Server, ServerOptions } from "socket.io";
import { NextFunction } from "express";
import { SocketWithUser } from "../types/socket";
import { WsException } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";

@Injectable()
export class SocketIoAdapter extends IoAdapter {
  private readonly usersService: UsersService;
  constructor(private readonly app: INestApplicationContext) {
    super(app);
    this.usersService = this.app.get(UsersService);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, options);

    const jwtService = this.app.get(JwtService);

    server.use(verifyUserMiddleware(jwtService, this.usersService));

    return server;
  }
}

const verifyUserMiddleware =
  (jwtService: JwtService, usersService: UsersService) =>
  async (socket: SocketWithUser, next: NextFunction) => {
    const { authorization } = socket.handshake.headers;
    try {
      const [_, token] = authorization.split(" ");
      if (!token) next(new WsException("Unauthorized"));

      const data = await usersService.verifyToken(token);
      if (!data) next(new WsException("Unauthorized"));

      // @ts-ignore
      socket.user = data.user;
      socket.channels = data.channels;

      next();
    } catch (e) {
      next(new WsException("Unauthorized"));
    }
  };
