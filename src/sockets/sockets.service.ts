import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class SocketsService {
  public socket: Server = null;
  // server: {users: client_id}
  userSockets: Map<string, Map<string, string>> = new Map();

  public addUserSocket(
    guildIDs: string | Array<string>,
    userID: string,
    clientID: string
  ) {
    if (!Array.isArray(guildIDs)) {
      guildIDs = [guildIDs];
    }
    guildIDs.forEach((guildID) => {
      if (!this.userSockets.has(guildID)) {
        this.userSockets.set(guildID, new Map());
      }
      this.userSockets.get(guildID).set(userID, clientID);
    });
  }

  public removeUserSocket(guildIDs: string | Array<string>, userID: string) {
    if (!Array.isArray(guildIDs)) {
      guildIDs = [guildIDs];
    }
    guildIDs.forEach((guildID) => {
      if (this.userSockets.has(guildID)) {
        this.userSockets.get(guildID).delete(userID);
      }
    });
  }

  public getUserSockets(guildID: string, userID: string) {
    if (this.userSockets.has(guildID)) {
      return this.userSockets.get(guildID).get(userID);
    }
  }
}
