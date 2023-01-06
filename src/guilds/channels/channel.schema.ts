import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Guild } from "../guild.schema";

@Schema({
  timestamps: true,
  _id: false,
})
export class Channel {
  @Prop({
    index: true,
  })
  _id: string;

  @Prop({
    set: (name: string) => name.trim(),
  })
  name: string;

  @Prop({
    ref: Guild.name,
  })
  guildID: string;

  @Prop()
  categoryID: string;

  @Prop({
    set: (topic: string) => topic.trim(),
  })
  topic: string;

  @Prop()
  type: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
