import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelsService } from "./channels.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { ChannelDto } from "./dto/channel.dto";
import { JwtAuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "../decorators/current-user.decorator";
import { CreateInviteDto } from "./dto/create-invite.dto";
import { InviteDto } from "./dto/invite.dto";

@Controller()
@UseGuards(JwtAuthGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post("/invites")
  @Serialize(InviteDto)
  async invite(
    @Body() invite: CreateInviteDto,
    @Param("channelID") channelID: string,
    @CurrentUser("_id") userID: string
  ) {
    return this.channelsService.getInvite(channelID, userID, invite);
  }
}
