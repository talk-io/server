import {Expose, Type} from "class-transformer";
import {ChannelDto} from "../channels/dto/channel.dto";

export class BasicGuildDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => ChannelDto)
  channels: Array<string>;
}
