import { Module, ValidationPipe } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_PIPE, RouterModule } from "@nestjs/core";
import { ChannelsModule } from "./guilds/channels/channels.module";
import { GuildsModule } from "./guilds/guilds.module";
import { MessagesModule } from "./guilds/channels/messages/messages.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/talkio", ),
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
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        // exceptionFactory: (errors) => {
        //     const modifiedErrors = {};
        //     errors.forEach(error => {
        //         modifiedErrors[error.property] = Object.values(error.constraints)[0];
        //     })
        //     return new BadRequestException({
        //         message: modifiedErrors,
        //     });
        // }
      }),
    },
  ],
  exports: [],
})
export class AppModule {}
