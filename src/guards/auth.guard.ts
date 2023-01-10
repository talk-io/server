import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";

const jwt = require("jsonwebtoken");

export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authorization: string | undefined = request.headers.authorization;
    if (!authorization) return false;

    const [_, token] = authorization.split(" ");

    try {
      const user = await this.usersService.verifyUser(token);

      request.currentUser = { _id: user._id, token };

      return !!user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
