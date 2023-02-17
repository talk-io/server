import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import type { GuildDocument } from "../guilds/guild.schema";
import type { ChannelDocument } from "../channels/channel.schema";
import { plainToInstance } from "class-transformer";
import { UserDto } from "../users/dtos/user.dto";
import { UsersService } from "../users/users.service";
import type { UserDocument } from "../users/user.schema";
import { PresenceStatus } from "../types/enums";

@Injectable()
export class SocketsService {
  public socket: Server = null;
  userSockets: Map<string, Array<string>> = new Map();
  constructor(private readonly usersService: UsersService) {}

  public addUserSocket(userID: string, clientID: string) {
    if (!this.userSockets.has(userID)) this.userSockets.set(userID, []);
    this.userSockets.get(userID).push(clientID);
  }

  public removeUserSocket(userID: string, clientID: string) {
    const userSockets = this.userSockets.get(userID);
    if (!userSockets) return;

    const index = userSockets.indexOf(clientID);
    if (index === -1) return;

    userSockets.splice(index, 1);
    if (!userSockets.length) this.userSockets.delete(userID);
  }

  public getUserSockets(userID: string) {
    return this.userSockets.get(userID);
  }

  public async getUserInitialData(userID: string) {
    const user = await this.usersService.findOne(userID);
    const userWithGuilds = await user.populate<{
      guilds: Array<
        GuildDocument & {
          channels: Array<ChannelDocument>;
          members: Array<UserDocument>;
        }
      >;
    }>({
      path: "guilds",
      populate: [
        "owner",
        {
          path: "members",
          transform: (doc: UserDocument) => {
            const isOnline = this.getUserSockets(doc._id);
            doc.status = isOnline ? doc.status : PresenceStatus.Offline;
            return doc;
          },
        },
        "channels",
      ],
    });

    return plainToInstance(UserDto, userWithGuilds.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
