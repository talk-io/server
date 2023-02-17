import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateGuildDto } from "./dto/create-guild.dto";
import { GuildsService } from "./guilds.service";
import {
  CurrentUser,
  CurrentUserType,
} from "../decorators/current-user.decorator";
import { Serialize } from "../interceptors/serialize.interceptor";
import { GuildDto } from "./dto/guild.dto";
import { JwtAuthGuard } from "../guards/auth.guard";
import { SocketsGateway } from "../sockets/sockets.gateway";
import { CreateChannelDto } from "../channels/dto/create-channel.dto";
import { ChannelsService } from "../channels/channels.service";

@Controller()
@UseGuards(JwtAuthGuard)
@Serialize(GuildDto)
export class GuildsController {
  constructor(
    private readonly guildsService: GuildsService,
    private readonly socketsGateway: SocketsGateway,
    private readonly channelsService: ChannelsService
  ) {}

  @Post()
  async create(
    @Body() createGuildDto: CreateGuildDto,
    @CurrentUser() user: CurrentUserType
  ) {
    return this.guildsService.create(createGuildDto, user);
  }

  @Post("/:guildID")
  async join(
    @Param("guildID") guildID: string,
    @CurrentUser() user: CurrentUserType
  ) {
    const guild = await this.guildsService.join(guildID, user);

    await this.socketsGateway.addUserToGuildRoom(guild._id, user);
    return guild;
  }

  @Get("/:guildID")
  async findOne(@Param("guildID") guildID: string) {
    return this.guildsService.findOne(guildID);
  }

  @Post("/:guildID/leave")
  async leave(
    @Param("guildID") guildID: string,
    @CurrentUser() user: CurrentUserType
  ) {
    if (!guildID) throw new BadRequestException("Guild ID is required");
    await this.guildsService.leave(guildID, user);

    return this.socketsGateway.removeUserFromGuildRoom(guildID, user);
  }

  @Post("/:guildID/channels")
  async createChannel(
    @Param("guildID") guildID: string,
    @Body() channel: CreateChannelDto
  ) {
    return this.channelsService.create(guildID, channel);
  }
}
