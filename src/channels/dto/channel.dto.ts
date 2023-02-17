import { Expose } from "class-transformer";
import { ChannelType } from "../../types/channel.type";

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
}
