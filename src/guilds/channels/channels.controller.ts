import {Body, Controller, Param, Post} from "@nestjs/common";
import {CreateChannelDto} from "./dto/create-channel.dto";
import {ChannelsService} from "./channels.service";
import {Serialize} from "../../interceptors/serialize.interceptor";
import {ChannelDto} from "./dto/channel.dto";

@Controller()
@Serialize(ChannelDto)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async create(@Param("guildID") guildID: string, @Body() channel: CreateChannelDto) {
    return this.channelsService.create(guildID, channel);
  }
}
