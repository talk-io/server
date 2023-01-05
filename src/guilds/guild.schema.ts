import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {User, UserSchema} from "../users/user.schema";
import {Channel, ChannelSchema} from "../channels/channel.schema";
import {HydratedDocument, Types} from "mongoose";

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

  @Prop({
    type: [{type: String, ref: "User"}],
  })
  members: Array<string>;

  @Prop({
    type: [{type: String, ref: "Channel"}]
  })
  channels: Array<string>;
}

export const GuildSchema = SchemaFactory.createForClass(Guild);
