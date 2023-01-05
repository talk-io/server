import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../users/user.schema";
import { Channel } from "../channels/channel.schema";
import { HydratedDocument } from "mongoose";

export type GuildDocument = HydratedDocument<Guild>;

@Schema({
  timestamps: true,
  _id: false,
})
export class Guild {
  @Prop({
    index: true,
  })
  _id: string;

  @Prop({
    set: (name: string) => name.trim(),
  })
  name: string;

  @Prop({
    ref: "User",
    type: String,
  })
  owner: string;

  @Prop({
    set: (description: string) => description.trim(),
  })
  description: string;

  @Prop()
  members: Map<string, User>;

  @Prop()
  channels: Map<string, Channel>;
}

export const GuildSchema = SchemaFactory.createForClass(Guild);

