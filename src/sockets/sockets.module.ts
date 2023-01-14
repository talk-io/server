import { Global, Module, ValidationPipe } from "@nestjs/common";
import { SocketsService } from "./sockets.service";
import { APP_PIPE } from "@nestjs/core";
import { UsersService } from "../users/users.service";
import { jwtModule } from "../config/configuration";

@Global()
@Module({
  imports: [jwtModule],
  providers: [
    UsersService,
    SocketsService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
  exports: [SocketsService],
})
export class SocketsModule {}
