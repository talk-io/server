import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Channel, ChannelDocument } from "./channel.schema";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelType } from "../types/channel.type";
import { Model } from "mongoose";
import { Invite } from "./invite.schema";
import { CreateInviteDto } from "./dto/create-invite.dto";
import * as dayjs from "dayjs";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel("Channel")
    private readonly channelModel: Model<Channel>,
    @InjectModel("Invite")
    private readonly inviteModel: Model<Invite>
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

  _generateString(len) {
    // credits to https://stackoverflow.com/a/1349426
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < len) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async _generateInvite() {
    const inviteCodeLength = 10;
    const inviteExists = (code: string) => this.inviteModel.find({ code });

    let code = this._generateString(inviteCodeLength);
    let invitesWithCode = await inviteExists(code);

    while (invitesWithCode.length) {
      code = this._generateString(inviteCodeLength);
      invitesWithCode = await inviteExists(code);
    }

    return code;
  }

  async getInvite(
    channelID: string,
    userID: string,
    inviteData: CreateInviteDto
  ) {
    const inviteCode = await this._generateInvite();
    const { maxUses, maxAge, temporary } = inviteData;

    const expiresAt = dayjs().add(maxAge, "seconds").toISOString();

    const inv = new this.inviteModel({
      code: inviteCode,
      channelID,
      inviterID: userID,
      maxUses,
      maxAge,
      temporary,
      expiresAt,
    });

    const invite = await inv.save();
    const populatedInvite = await invite.populate(["channel", "inviter"]);

    return populatedInvite.toObject();
  }
}
