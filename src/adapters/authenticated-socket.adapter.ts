import { IoAdapter } from "@nestjs/platform-socket.io";
import { UsersService } from "../users/users.service";
import { INestApplicationContext } from "@nestjs/common";
import { ServerOptions } from "socket.io";

export class AuthenticatedSocketAdapter extends IoAdapter {
  private readonly usersService: UsersService;
  constructor(private app: INestApplicationContext) {
    super(app);
    this.usersService = app.get(UsersService);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    options.allowRequest = async (req, allowFunction) => {
      const authorization: string | undefined = req.headers.authorization;
      if (!authorization) return allowFunction(null, false);

      const [_, token] = authorization.split(" ");

      try {
        const payload = await this.usersService.verifyUser(token);
        if (!payload) return allowFunction("Unauthorized", false);

        return allowFunction(null, true);
      } catch (e) {
        return allowFunction(e.message, false);
      }
    };

    return super.createIOServer(port, options);
  }
}
