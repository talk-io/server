import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { HydratedDocument } from "mongoose";
import * as dayjs from "dayjs";
import { GuildDocument } from "../guilds/guild.schema";

@Schema({
  timestamps: true,
  _id: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  virtuals: true,
})
export class Invite {
  @Prop({
    index: true,
    default: () => new SnowflakeGenerator().generateSnowflake(),
  })
  _id: string;

  @Prop({
    required: true,
  })
  code: string;

  @Prop()
  channelID: string;

  @Prop()
  inviterID: string;

  @Prop()
  uses: number;

  @Prop()
  maxUses: number;

  @Prop()
  maxAge: number;

  @Prop()
  temporary: boolean;

  @Prop()
  expiresAt: Date;

  @Prop()
  createdAt: Date;
}

export type InviteDocument = HydratedDocument<Invite>;

export const InviteSchema = SchemaFactory.createForClass(Invite);
InviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
InviteSchema.virtual("inviter", {
  ref: "User",
  localField: "inviterID",
  foreignField: "_id",
  justOne: true,
});

InviteSchema.virtual("channel", {
  ref: "Channel",
  localField: "channelID",
  foreignField: "_id",
  justOne: true,
  options: {
    populate: "guild",
  },
});
