import { Socket } from "socket.io";
import { UserDocument } from "../users/user.schema";

export type SocketWithUser = Socket & {
  user: UserDocument;
};
