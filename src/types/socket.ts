import { Socket } from "socket.io";
import { PopulatedUser } from "../users/user.schema";

export type SocketWithUser = Socket & {
  user: PopulatedUser;
  initialRooms: {
    channels: Array<string>;
    guilds: Array<string>;
  };
};
