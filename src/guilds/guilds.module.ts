import { Module } from "@nestjs/common";
import { GuildsController } from "./guilds.controller";
import { GuildsService } from "./guilds.service";
import { MongooseModule } from "@nestjs/mongoose";
import { SocketsGateway } from "../sockets/sockets.gateway";
import { UsersService } from "../users/users.service";
import { jwtModule } from "../config/configuration";
import { ChannelsModule } from "../channels/channels.module";

@Module({
  imports: [MongooseModule, ChannelsModule, jwtModule],
  controllers: [GuildsController],
  providers: [GuildsService, UsersService, SocketsGateway],
  exports: [GuildsService],
})
export class GuildsModule {}
