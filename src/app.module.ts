import { Module, ValidationPipe } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_PIPE, RouterModule } from "@nestjs/core";
import { ChannelsModule } from "./guilds/channels/channels.module";
import { GuildsModule } from "./guilds/guilds.module";
import { MessagesModule } from "./guilds/channels/messages/messages.module";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/talkio"),
    UsersModule,
    GuildsModule,
    ChannelsModule,
    MessagesModule,
    RouterModule.register([
      {
        path: "/guilds",
        module: GuildsModule,
        children: [
          {
            path: ":guildID/channels",
            module: ChannelsModule,
          },
        ],
      },
      {
        path: "/channels/:channelID/messages",
        module: MessagesModule,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
