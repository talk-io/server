import { Socket } from "socket.io";
import { User, UserDocument } from "../users/user.schema";
import { LeanDocument } from "mongoose";

export type SocketWithUser = Socket & {
  user: LeanDocument<User>;
  channels: string[];
  guilds: string[];
};
