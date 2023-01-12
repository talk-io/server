import { IoAdapter } from "@nestjs/platform-socket.io";
import {INestApplicationContext, Injectable} from "@nestjs/common";
import { Server, ServerOptions } from "socket.io";
import { NextFunction } from "express";
import { SocketWithUser } from "../types/socket";
import { WsException } from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SocketIoAdapter extends IoAdapter {
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, options);

    const jwtService = this.app.get(JwtService)

    server.use(verifyUserMiddleware(jwtService));

    return server;
  }
}

const verifyUserMiddleware =
  (jwtService: JwtService) =>
  async (socket: SocketWithUser, next: NextFunction) => {
    const { authorization } = socket.handshake.headers;
    const [_, token] = authorization.split(" ");

    if (!token) next(new Error("No Token provided!"));

    try {
      socket.user = await jwtService.verify(token);
      console.log({ user: socket.user });
      next();
    } catch (e) {
      console.log(e);
      next(new WsException("Unauthorized"));
    }
  };
