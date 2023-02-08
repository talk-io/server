import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { SocketWithUser } from "../types/socket";
import { SocketsService } from "./sockets.service";
import { CurrentUserType } from "../decorators/current-user.decorator";
import { Events, UserTyping } from "../types/events";
import { UsersService } from "../users/users.service";
import { plainToInstance } from "class-transformer";
import { GuildUserDto } from "../users/dtos/guild-user.dto";

const { JOIN_GUILD, LEAVE_GUILD } = Events.GuildUserEvents;
const { INIT } = Events.UserEvents;
const { USER_TYPING_START, USER_TYPING_END } = Events.ChannelEvents;

@WebSocketGateway({ cors: { origin: "*" } })
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() public io: Server;

  constructor(
    private readonly socketsService: SocketsService,
    private readonly usersService: UsersService
  ) {}

  afterInit(server: Server): void {
    this.socketsService.socket = server;
  }

  async handleConnection(client: SocketWithUser): Promise<void> {
    const clientID = client.id;
    const userID = client.user._id;

    this.socketsService.addUserSocket(userID, clientID);
    client.join(client.channels);

    console.log("Client connected: ", clientID);

    const userData = await this.socketsService.getUserInitialData(userID);
    this.io.sockets.to(clientID).emit(INIT, userData);
  }

  handleDisconnect(client: SocketWithUser): void {
    const userID = client.user._id;
    const clientID = client.id;
    this.socketsService.removeUserSocket(userID, clientID);

    console.log("Client disconnected: ", clientID);
  }

  async addUserToGuildRoom(guildID: string, user: CurrentUserType) {
    const clientIDs = this.socketsService.getUserSockets(user._id);
    if (!clientIDs.length) return false;

    const detailedUser = await this.usersService.findOne(user._id);

    const serializedUser = plainToInstance(
      GuildUserDto,
      detailedUser.toObject(),
      {
        excludeExtraneousValues: true,
      }
    );

    clientIDs.forEach((clientID) => {
      this.io.sockets.sockets.get(clientID).join(guildID);
    });

    this.io.sockets.to(guildID).emit(JOIN_GUILD, serializedUser);
  }

  async removeUserFromGuildRoom(guildID: string, user: CurrentUserType) {
    const clientIDs = this.socketsService.getUserSockets(user._id);
    if (!clientIDs.length) return false;

    const detailedUser = await this.usersService.findOne(user._id);

    const serializedUser = plainToInstance(
      GuildUserDto,
      detailedUser.toObject(),
      {
        excludeExtraneousValues: true,
      }
    );

    clientIDs.forEach((clientID) => {
      this.io.sockets.sockets.get(clientID).leave(guildID);
    });
    this.io.sockets.to(guildID).emit(LEAVE_GUILD, serializedUser);
  }

  @SubscribeMessage(USER_TYPING_START)
  async handleUserTypingStart(
    @MessageBody() channelID: string,
    @ConnectedSocket() client: SocketWithUser
  ) {
    const serializedUser = plainToInstance(GuildUserDto, client.user, {
      excludeExtraneousValues: true,
    });

    const payload = {
      channelID,
      user: serializedUser,
    };

    client.broadcast.to(channelID).emit(USER_TYPING_START, payload);
  }

  @SubscribeMessage(USER_TYPING_END)
  async handleUserTypingEnd(
    @MessageBody() channelID: string,
    @ConnectedSocket() client: SocketWithUser
  ) {
    const payload = {
      channelID,
      userID: client.user._id,
    };
    client.broadcast.to(channelID).emit(USER_TYPING_END, payload);
  }
}
