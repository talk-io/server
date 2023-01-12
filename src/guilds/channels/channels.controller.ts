import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelsService } from "./channels.service";
import { Serialize } from "../../interceptors/serialize.interceptor";
import { ChannelDto } from "./dto/channel.dto";
import { JwtAuthGuard } from "../../guards/auth.guard";

@Controller()
@Serialize(ChannelDto)
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async create(
    @Param("guildID") guildID: string,
    @Body() channel: CreateChannelDto
  ) {
    return this.channelsService.create(guildID, channel);
  }
}
