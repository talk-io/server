import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User, UserDocument } from "../users/user.schema";
import { Channel, ChannelDocument } from "../channels/channel.schema";
import { HydratedDocument, Model } from "mongoose";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { ChannelType } from "../types/channel.type";

export type GuildDocument = HydratedDocument<Guild>;

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  virtuals: true,
  _id: false,
})
export class Guild {
  @Prop({
    index: true,
    default: () => new SnowflakeGenerator().generateSnowflake(),
  })
  _id: string;

  @Prop({
    set: (name: string) => name.trim(),
  })
  name: string;

  @Prop({
    required: true,
  })
  ownerID: string;

  @Prop({
    set: (description: string) => description.trim(),
  })
  description: string;

  addDefaultChannels: () => Promise<void>;
}

export const GuildSchema = SchemaFactory.createForClass(Guild);

GuildSchema.virtual("channels", {
  ref: "Channel",
  localField: "_id",
  foreignField: "guildID",
});

GuildSchema.virtual("members", {
  ref: "User",
  localField: "_id",
  foreignField: "guilds",
  limit: 50,
});

GuildSchema.virtual("owner", {
  ref: "User",
  localField: "ownerID",
  foreignField: "_id",
  justOne: true,
});

GuildSchema.methods.addDefaultChannels = async function (): Promise<void> {
  const guild = this;
  if (!guild.isNew) return;

  const defaultChannels = [
    {
      name: "Text Channels",
      type: ChannelType.GUILD_CATEGORY,
      children: [
        {
          name: "channel-1",
          type: ChannelType.GUILD_TEXT,
        },
      ],
    },
    {
      name: "Voice Channels",
      type: ChannelType.GUILD_CATEGORY,
      children: [
        {
          name: "voice-1",
          type: ChannelType.GUILD_VOICE,
        },
      ],
    },
  ];

  const ChannelObjects = this.$model("Channel") as Model<ChannelDocument>;

  let currentChannelPosition = 0;
  // [{ [] }, { [] }]
  const channels = defaultChannels.flatMap(async (cat, idx) => {
    // Create Category
    const category = new ChannelObjects({
      name: cat.name,
      type: cat.type,
      guildID: guild._id,
      position: idx,
    });
    const savedCategory = await category.save();
    // For each children in category
    const categoryChildren = cat.children.map(async (childChannel) => {
      // create channel and save
      const channel = new ChannelObjects({
        name: childChannel.name,
        type: childChannel.type,
        parentID: savedCategory._id,
        guildID: guild._id,
        position: +currentChannelPosition,
      });

      currentChannelPosition++;
      return channel.save();
    });
    return [savedCategory, ...(await Promise.all(categoryChildren))];
  });
  await Promise.all(channels);
  return;
};
