import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateGuildDto } from "./dto/create-guild.dto";
import { GuildsService } from "./guilds.service";
import {
  CurrentUser,
  CurrentUserType,
} from "../decorators/current-user.decorator";
import { Serialize } from "../interceptors/serialize.interceptor";
import { GuildDto } from "./dto/guild.dto";
import { JwtAuthGuard } from "../guards/auth.guard";
import { SocketsService } from "../sockets/sockets.service";
import { ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Events } from "../types/events";
import { Client } from "socket.io/dist/client";
import { SocketsGateway } from "../sockets/sockets.gateway";
import { SocketWithUser } from "../types/socket";

const { JOIN } = Events.GuildUserEvents;

@Controller()
@UseGuards(JwtAuthGuard)
@Serialize(GuildDto)
export class GuildsController {
  constructor(
    private readonly guildsService: GuildsService,
    private readonly socketsGateway: SocketsGateway
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
    this.socketsGateway.addUserToGuildRoom(guild._id, user._id);
    return guild;
  }

  @Get("/:guildID")
  async findOne(@Param("guildID") guildID: string) {
    return this.guildsService.findOne(guildID);
  }

  @Post("/:guildID/leave")
  async leave(
    @Param("guildID") guildID: string,
    @CurrentUser() user: CurrentUserType,
    @ConnectedSocket() client: SocketWithUser
  ) {
    await this.guildsService.leave(guildID, user);
    this.socketsGateway.removeUserFromGuildRoom(guildID, user._id);
    this.socketsGateway.io.sockets.to(guildID).emit(JOIN, user);
  }
}
