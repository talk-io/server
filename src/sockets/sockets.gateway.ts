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
import { Events } from "../types/events";
import { UsersService } from "../users/users.service";
import { plainToInstance } from "class-transformer";
import { GuildUserDto } from "../users/dtos/guild-user.dto";
import { Message } from "../channels/messages/message.schema";
import { PresenceStatus } from "../types/enums";

const { JOIN_GUILD, LEAVE_GUILD } = Events.GuildUserEvents;
const { INIT, UPDATE_STATUS } = Events.UserEvents;
const { USER_TYPING_START, USER_TYPING_END } = Events.ChannelEvents;
const { MESSAGE_CREATED } = Events.MessageEvents;

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
    const {
      id: clientID,
      initialRooms: { channels, guilds },
      user,
    } = client;

    const { _id: userID, status } = user;

    // this.socketsService.addUserSocket(userID, clientID);

    client.join(channels.concat(guilds));
    console.log("Client connected: ", clientID);

    const guildsAndMembers = this.socketsService.guildsWithMembers(user.guilds);

    const userEntries = Object.values(guildsAndMembers).flat();

    const usersMap = new Map();
    userEntries.forEach((user) => {
      if (usersMap.has(user._id)) return;
      usersMap.set(user._id, user);
    });

    this.io.sockets.to(clientID).emit(INIT, {
      user,
      users: [...usersMap.values()],
      guildsWithMembers: guildsAndMembers,
    });
    console.log({
      weee: this.socketsService.getUserSockets("3047579137902231553"),
    });
    this.io.sockets.to(guilds).emit(UPDATE_STATUS, userID, status);
  }

  handleDisconnect(client: SocketWithUser): void {
    const {
      user: { _id: userID },
      id: clientID,
      initialRooms: { guilds },
    } = client;

    this.socketsService.removeUserSocket(userID, clientID);

    console.log("Client disconnected: ", clientID);
    this.io.sockets
      .to(guilds)
      .emit(UPDATE_STATUS, userID, PresenceStatus.Offline);
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

  @SubscribeMessage(MESSAGE_CREATED)
  async handleCreateMessage(
    @MessageBody() message: Message,
    @ConnectedSocket() client: SocketWithUser
  ) {
    client.broadcast.to(message.channelID).emit(MESSAGE_CREATED, message);
  }
}
