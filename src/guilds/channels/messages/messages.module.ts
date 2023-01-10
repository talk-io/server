import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./message.schema";
import { MessagesGateway } from "./messages.gateway";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { User, UserSchema } from "../../../users/user.schema";

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
  ],
  providers: [MessagesGateway, MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
