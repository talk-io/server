import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Guild } from "../guilds/guild.schema";
import { HydratedDocument, Model } from "mongoose";
import { ChannelType } from "../types/channel.type";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({
  timestamps: true,
  _id: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  virtuals: true,
})
export class Channel {
  @Prop({
    index: true,
    default: () => new SnowflakeGenerator().generateSnowflake(),
  })
  _id: string;

  @Prop({
    set: (name: string) => name.trim(),
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  guildID: string;

  @Prop()
  parentID: string;

  @Prop({
    set: (topic: string) => topic.trim(),
  })
  topic: string;

  @Prop({
    required: true,
  })
  type: ChannelType;

  @Prop({
    required: true,
  })
  position: number;

  @Prop({
    default: false,
    required: true,
  })
  nsfw: boolean;

  addPosition: () => Promise<number>;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

ChannelSchema.virtual("guild", {
  ref: "Guild",
  localField: "guildID",
  foreignField: "_id",
  justOne: true,
});

ChannelSchema.virtual("category", {
  ref: "Channel",
  localField: "parentID",
  foreignField: "_id",
  justOne: true,
});

ChannelSchema.methods.addPosition = async function () {
  if (!this.isNew) return;
  if (Object.hasOwn(this.toObject(), "position")) return this.position;

  const ChannelObjects = this.$model("Channel");

  const { guildID, type } = this;
  const allChannels = await ChannelObjects.find({ guildID, type });

  return allChannels.length;
};
