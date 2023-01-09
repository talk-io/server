import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../../users/user.schema";
import { Channel } from "../channel.schema";
import { HydratedDocument } from "mongoose";
import { SnowflakeGenerator } from "../../../utils/generate-snowflake.util";
import { Guild } from "../../guild.schema";

@Schema({
  timestamps: true,
  _id: false,
  toJSON: {
    virtuals: true,
  }
})
export class Message {
  @Prop({
    index: true,
    default: () => new SnowflakeGenerator().generateSnowflake(),
  })
  _id: string;

  @Prop({
    ref: User.name,
    type: String,
    required: true,
  })
  authorID: string;

  @Prop({
    set: (content: string) => content.trim(),
    required: true,
  })
  content: string;

  @Prop({
    ref: Channel.name,
    type: String,
    required: true,
  })
  channelID: string;
}
export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);

// MessageSchema.virtual("author", {
//   ref: "User",
//   localField: "authorID",
//   foreignField: "_id",
// });
//
// MessageSchema.virtual("channel", {
//   ref: "Channel",
//   localField: "channelID",
//   foreignField: "_id",
// });
