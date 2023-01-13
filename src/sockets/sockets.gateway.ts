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
import {SocketsService} from "./sockets.service";

@WebSocketGateway()
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly socketsService: SocketsService) {}
  @WebSocketServer() public io: Server;

  afterInit(server: Server): void {
    this.socketsService.socket = server;
  }

  handleConnection(client: SocketWithUser): void {
    // join the guilds the user is in
    client.join(client.user.guilds);
    // console.log(`WS Client with ID: ${client.user._id} connected!`);
  }

  handleDisconnect(client: SocketWithUser): void {
    const sockets = this.io.sockets.sockets;

    // console.log(`WS Client with ID: ${client.user._id} disconnected!`);
    // console.log(`Number of connected clients: ${sockets.size}`);
  }
}
