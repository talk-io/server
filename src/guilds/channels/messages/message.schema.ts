import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../../users/user.schema";
import { Channel } from "../channel.schema";

@Schema({
  timestamps: true,
  _id: false
})
export class Message {
  @Prop({
    index: true,
  })
  _id: string;

  @Prop({
    ref: User.name,
  })
  authorID: string;

  @Prop({
    set: (content: string) => content.trim(),
  })
  content: string;

  @Prop({
    ref: Channel.name,
    type: String,
  })
  channelID: string;

  @Prop()
  guildID: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
