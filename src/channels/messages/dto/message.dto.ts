import { Expose, Type } from "class-transformer";
import { GuildUserDto } from "../../../users/dtos/guild-user.dto";
import { ChannelDto } from "../../dto/channel.dto";

export class MessageDto {
  @Expose()
  _id: string;

  @Expose()
  authorID: string;

  @Expose()
  channelID: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => ChannelDto)
  channel: ChannelDto;

  @Expose()
  @Type(() => GuildUserDto)
  author: GuildUserDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
