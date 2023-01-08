import { UserDto } from "../../users/dtos/user.dto";
import { Expose, Type } from "class-transformer";
import { User } from "../../users/user.schema";
import { GuildUserDto } from "../../users/dtos/guild-user.dto";
import {ChannelDto} from "../channels/dto/channel.dto";

export class GuildDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => GuildUserDto)
  owner: User;

  @Expose()
  @Type(() => GuildUserDto)
  members: Array<User>;

  @Expose()
  @Type(() => ChannelDto)
  channels: Array<string>;
}
