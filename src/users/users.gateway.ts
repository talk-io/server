import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { UsersService } from "./users.service";
import { SocketWithUser } from "../types/socket";

@WebSocketGateway()
export class UsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly usersService: UsersService) {}

  @WebSocketServer() io: Server;

  afterInit(): void {
    console.log("Websocket Gateway Initialized!");
  }

  handleConnection(client: SocketWithUser): void {
    const sockets = this.io.sockets.sockets;

    console.log(`WS Client with ID: ${client.user.id} connected!`);
    console.log(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: SocketWithUser): void {
    const sockets = this.io.sockets.sockets;

    console.log(`WS Client with ID: ${client.user.id} disconnected!`);
    console.log(`Number of connected clients: ${sockets.size}`);
  }
}
