import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import type { PopulatedGuild } from "../guilds/guild.schema";
import { GuildUserDto } from "../users/dtos/guild-user.dto";

@Injectable()
export class SocketsService {
  public socket: Server = null;
  userSockets: Map<string, Array<string>> = new Map();

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

  guildsWithMembers(
    guilds: Array<PopulatedGuild>
  ): Record<string, Array<GuildUserDto>> {
    const holder = {};
    guilds.forEach((guild) => {
      holder[guild._id] = guild.members;
    });
    return holder;
  }
}
