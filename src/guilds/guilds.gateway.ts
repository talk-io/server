import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketWithUser } from "../types/socket";
import { UsersService } from "../users/users.service";
import { UseGuards } from "@nestjs/common";

@WebSocketGateway()
export class GuildsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor() {}
  @WebSocketServer() io: Server;

  afterInit(): void {
    console.log("Websocket Gateway Initialized!");
  }

  handleConnection(client: SocketWithUser): void {
    const sockets = this.io.sockets.sockets;
    console.log({ client });

    // console.log(`WS Client with ID: ${client.user.id} connected!`);
    // console.log(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: SocketWithUser): void {
    const sockets = this.io.sockets.sockets;

    console.log(`WS Client with ID: ${client.user.id} disconnected!`);
    console.log(`Number of connected clients: ${sockets.size}`);
  }
}
