import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./message.schema";
import { MessagesGateway } from "./messages.gateway";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { User, UserSchema } from "../../../users/user.schema";
import { UsersService } from "../../../users/users.service";
import { JwtStrategy } from "../../../users/strategies/jwt.strategy";
import { GuildsService } from "../../guilds.service";
import { GuildsModule } from "../../guilds.module";
import { jwtModule } from "../../../config/configuration";
import { Guild, GuildSchema } from "../../guild.schema";
import { ChannelsModule } from "../channels.module";
import { ChannelsService } from "../channels.service";
import {Channel, ChannelSchema} from "../channel.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Message.name,
        useFactory: () => {
          const schema = MessageSchema;

          return schema;
        },
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Guild.name,
        useFactory: () => {
          const schema = GuildSchema;

          // schema.pre("validate", async function (next) {
          //   if (this.isNew) this.addDefaultChannels.bind(this)();
          //   return next();
          // });

          return schema;
        },
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Channel.name,
        useFactory: () => {
          const schema = ChannelSchema;

          // Add Position
          schema.pre("validate", async function (next) {
            if (this.isNew) this.position = await this.addPosition.bind(this)();
            return next();
          });

          return schema;
        },
      },
    ]),
    jwtModule,
  ],
  providers: [
    MessagesGateway,
    MessagesService,
    GuildsService,
    UsersService,
    JwtStrategy,
    ChannelsService,
  ],
  controllers: [MessagesController],
})
export class MessagesModule {}
