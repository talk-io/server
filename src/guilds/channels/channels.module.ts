import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { ChannelsController } from "./channels.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "../../users/users.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule, MongooseModule],
  providers: [ChannelsService, UsersService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
