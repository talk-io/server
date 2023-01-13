import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { UsersService } from "../../../users/users.service";
import { GuildsService } from "../../guilds.service";
import { jwtModule } from "../../../config/configuration";
import { ChannelsService } from "../channels.service";

@Module({
  imports: [jwtModule, MongooseModule],
  providers: [
    MessagesService,
    GuildsService,
    UsersService,
    ChannelsService,
  ],
  controllers: [MessagesController],
})
export class MessagesModule {}
