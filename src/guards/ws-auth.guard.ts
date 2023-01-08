import { CanActivate, ExecutionContext } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../users/user.schema";
import { Model } from "mongoose";

export class WsAuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToWs().getClient().handshake.headers;
    console.log({ request });

    return true;
  }
}
