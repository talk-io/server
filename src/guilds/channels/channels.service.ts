import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Channel, ChannelDocument } from "./channel.schema";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelType } from "../../types/channel.type";
import { Model } from "mongoose";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel("Channel")
    private readonly channelModel: Model<Channel>
  ) {}

  async create(guildID: string, channel: CreateChannelDto) {
    let newChannel: ChannelDocument;
    if (channel.type === ChannelType.GUILD_CATEGORY) {
      newChannel = new this.channelModel({ ...channel, guildID });
    } else {
      const category = await this.channelModel.findOne({
        _id: channel.parentID,
        guildID,
        type: ChannelType.GUILD_CATEGORY,
      });

      if (!category) throw new NotFoundException("Parent ID is invalid");

      newChannel = new this.channelModel({ ...channel, guildID });
    }

    return newChannel.save();
  }

  async findOne(channelID: string) {
    return this.channelModel.findById(channelID);
  }
}
