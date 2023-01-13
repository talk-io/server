import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketWithUser } from "../types/socket";
import { SocketsService } from "./sockets.service";

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
    const clientID = client.id;
    const userID = client.user.id;
    this.socketsService.addUserSocket(client.user.guilds, userID, clientID);
    client.join(client.user.guilds);
  }

  handleDisconnect(client: SocketWithUser): void {
    const userID = client.user.id;
    this.socketsService.removeUserSocket(client.user.guilds, userID);
    client.user.guilds.forEach((guildID) => {
      client.leave(guildID);
    });
  }

  addUserToGuildRoom(
    guildID: string,
    userID: string,
  ) {
    const clientID = this.socketsService.getUserSockets(guildID, userID);
    if (!clientID) return false;
    this.io.sockets.sockets.get(clientID).join(guildID);
  }

  removeUserFromGuildRoom(
    guildID: string,
    userID: string,
  ) {
    const clientID = this.socketsService.getUserSockets(guildID, userID);
    if (!clientID) return false;
    this.io.sockets.sockets.get(clientID).leave(guildID);
  }
}
