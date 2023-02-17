import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { ChannelsController } from "./channels.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "../users/users.service";
import { jwtModule } from "../config/configuration";

@Module({
  imports: [jwtModule, MongooseModule],
  providers: [ChannelsService, UsersService],
  controllers: [ChannelsController],
  exports: [ChannelsService],
})
export class ChannelsModule {}
