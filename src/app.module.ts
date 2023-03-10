import { Global, Module, ValidationPipe } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_PIPE, RouterModule } from "@nestjs/core";
import { ChannelsModule } from "./channels/channels.module";
import { GuildsModule } from "./guilds/guilds.module";
import { MessagesModule } from "./channels/messages/messages.module";
import { ConfigModule } from "@nestjs/config";
import { SocketsModule } from "./sockets/sockets.module";
import configuration, { jwtModule } from "./config/configuration";
import { Guild, GuildSchema } from "./guilds/guild.schema";
import { Channel, ChannelSchema } from "./channels/channel.schema";
import { Message, MessageSchema } from "./channels/messages/message.schema";
import { User, UserSchema } from "./users/user.schema";
import { Invite, InviteSchema } from "./channels/invite.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/talkio"),
    SocketsModule,
    UsersModule,
    GuildsModule,
    ChannelsModule,
    MessagesModule,
    RouterModule.register([
      {
        path: "/guilds",
        module: GuildsModule,
      },
      {
        path: "/channels/:channelID",
        module: ChannelsModule,
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
    SocketsModule,
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
      {
        name: Invite.name,
        useFactory: () => {
          return InviteSchema;
        },
      },
      {
        name: Guild.name,
        useFactory: () => {
          return GuildSchema;
        },
      },
      {
        name: Message.name,
        useFactory: () => {
          return MessageSchema;
        },
      },
      {
        name: User.name,
        useFactory: () => {
          return UserSchema;
        },
      },
    ]),
    jwtModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
  exports: [MongooseModule],
})
export class AppModule {}
