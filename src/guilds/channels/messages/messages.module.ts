import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./message.schema";
import { MessagesGateway } from "./messages.gateway";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { User, UserSchema } from "../../../users/user.schema";
import { UsersService } from "../../../users/users.service";
import { JwtStrategy } from "../../../users/strategies/jwt.strategy";
import {UsersModule} from "../../../users/users.module";
import {JwtModule} from "@nestjs/jwt";

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

          // schema.virtual("channel", {
          //   ref: "Channel",
          //   localField: "channelID",
          //   foreignField: "_id",
          //   justOne: true,
          // });
          //
          // schema.virtual("author", {
          //   ref: "User",
          //   localField: "authorID",
          //   foreignField: "_id",
          //   justOne: true,
          // });

          return schema;
        },
      },
    ]),
    JwtModule,
  ],
  providers: [MessagesGateway, MessagesService, UsersService, JwtStrategy],
  controllers: [MessagesController],
})
export class MessagesModule {}
