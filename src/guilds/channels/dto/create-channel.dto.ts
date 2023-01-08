import {IsEnum, IsNotEmpty, IsString, ValidateIf} from "class-validator";
import {ChannelType} from "../../../types/channel.type";

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsEnum(ChannelType)
  type: ChannelType;

  @ValidateIf((o) => o.type !== ChannelType.GUILD_CATEGORY)
  @IsNotEmpty()
  parentID: string;
}
