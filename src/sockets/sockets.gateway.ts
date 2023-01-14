import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketWithUser } from "../types/socket";
import { SocketsService } from "./sockets.service";
import { CurrentUserType } from "../decorators/current-user.decorator";
import { Events } from "../types/events";
import { UsersService } from "../users/users.service";
import { plainToInstance } from "class-transformer";
import { GuildUserDto } from "../users/dtos/guild-user.dto";

const { JOIN_GUILD, LEAVE_GUILD } = Events.GuildUserEvents;

@WebSocketGateway()
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly socketsService: SocketsService,
    private readonly usersService: UsersService
  ) {}
  @WebSocketServer() public io: Server;

  afterInit(server: Server): void {
    this.socketsService.socket = server;
  }

  async handleConnection(client: SocketWithUser): Promise<void> {
    const clientID = client.id;
    const userID = client.user.id;
    this.socketsService.addUserSocket(userID, clientID);

    client.join(client.user.guilds);

    const userInitialData = await this.socketsService.getUserInitialData(
      userID
    );

    client.emit("init", userInitialData);
  }

  handleDisconnect(client: SocketWithUser): void {
    const userID = client.user.id;
    this.socketsService.removeUserSocket(userID);
    // client.user.guilds.forEach((guildID) => {
    //   client.leave(guildID);
    // });
  }

  async addUserToGuildRoom(guildID: string, user: CurrentUserType) {
    const clientID = this.socketsService.getUserSockets(user._id);
    if (!clientID) return false;

    const detailedUser = await this.usersService.findOne(user._id);

    const serializedUser = plainToInstance(
      GuildUserDto,
      detailedUser.toObject(),
      {
        excludeExtraneousValues: true,
      }
    );

    this.io.sockets.sockets.get(clientID).join(guildID);
    this.io.sockets.to(guildID).emit(JOIN_GUILD, serializedUser);
  }

  async removeUserFromGuildRoom(guildID: string, user: CurrentUserType) {
    const clientID = this.socketsService.getUserSockets(user._id);
    if (!clientID) return false;

    const detailedUser = await this.usersService.findOne(user._id);

    const serializedUser = plainToInstance(
      GuildUserDto,
      detailedUser.toObject(),
      {
        excludeExtraneousValues: true,
      }
    );

    this.io.sockets.sockets.get(clientID).leave(guildID);
    this.io.sockets.to(guildID).emit(LEAVE_GUILD, serializedUser);
  }
}
