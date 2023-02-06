import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { GuildDocument } from "../guilds/guild.schema";
import { ChannelDocument } from "../guilds/channels/channel.schema";
import { plainToInstance } from "class-transformer";
import { UserDto } from "../users/dtos/user.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class SocketsService {
  public socket: Server = null;
  userSockets: Map<string, string> = new Map();
  constructor(private readonly usersService: UsersService) {}

  public addUserSocket(userID: string, clientID: string) {
    this.userSockets.set(userID, clientID);
  }

  public removeUserSocket(userID: string) {
    this.userSockets.delete(userID);
    // guildIDs.forEach((guildID) => {
    //   if (this.userSockets.has(guildID)) {
    //     this.userSockets.get(guildID).delete(userID);
    //   }
    // });
  }

  public getUserSockets(userID: string) {
    return this.userSockets.get(userID);
  }

  public async getUserInitialData(userID: string) {
    const user = await this.usersService.findOne(userID);
    const userWithGuilds = await user.populate<{
      guilds: Array<GuildDocument & { channels: Array<ChannelDocument> }>;
    }>({
      path: "guilds",
      populate: ["owner", "members", "channels"],
    });

    return plainToInstance(UserDto, userWithGuilds.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
