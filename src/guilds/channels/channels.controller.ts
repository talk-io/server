import {Body, Controller, Param, Post} from "@nestjs/common";
import {CreateChannelDto} from "./dto/create-channel.dto";

@Controller()
export class ChannelsController {
  @Post()
  async create(@Param("guildID") guildID: string, @Body() channel: CreateChannelDto) {
    return guildID;
  }
}
