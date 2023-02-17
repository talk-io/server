import { Expose, Type } from "class-transformer";
import { GuildUserDto } from "../../users/dtos/guild-user.dto";
import { ChannelDto } from "./channel.dto";

export class InviteDto {
  @Expose()
  code: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => GuildUserDto)
  inviter: string;

  @Expose()
  @Type(() => ChannelDto)
  channel: string;

  @Expose()
  inviterID: string;

  @Expose()
  channelID: string;

  @Expose()
  uses: number;

  @Expose()
  maxUses: number;

  @Expose()
  maxAge: number;

  @Expose()
  temporary: boolean;

  @Expose()
  expiresAt: Date;

  @Expose()
  guild: string;
}
