import {IsEnum, IsNotEmpty, IsString, ValidateIf} from "class-validator";
import { Channel } from "../../../types/channel.type";

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsEnum(Channel)
  type: string;

  @ValidateIf((o) => o.type !== Channel.GUILD_CATEGORY)
  @IsNotEmpty()
  parentID: string;
}
