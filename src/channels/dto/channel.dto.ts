import { Expose, Type } from "class-transformer";
import { ChannelType } from "../../types/channel.type";
import { BasicGuildDto } from "../../guilds/dto/basic-guild.dto";

export class ChannelDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  guildID: string;

  @Expose()
  parentID: string;

  @Expose()
  type: ChannelType;

  @Expose()
  position: number;

  @Expose()
  nsfw: boolean;

  @Expose()
  @Type(() => BasicGuildDto)
  guild: BasicGuildDto;
}
