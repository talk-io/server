import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import { CreateGuildDto } from "./dto/create-guild.dto";
import { GuildsService } from "./guilds.service";
import { AuthGuard } from "../guards/auth.guard";
import {
  CurrentUser,
  CurrentUserType,
} from "../decorators/current-user.decorator";
import { Serialize } from "../interceptors/serialize.interceptor";
import { GuildDto } from "./dto/guild.dto";

@Controller()
@UseGuards(AuthGuard)
@Serialize(GuildDto)
export class GuildsController {
  constructor(private readonly guildsService: GuildsService) {}

  @Post()
  async create(
    @Body() createGuildDto: CreateGuildDto,
    @CurrentUser() user: CurrentUserType
  ) {
    return this.guildsService.create(createGuildDto, user);
  }

  @Post("/:guildID")
  async join(@Param("guildID") guildID: string, @CurrentUser() user: CurrentUserType) {
    return this.guildsService.join(guildID, user);
  }
  
  @Get("/:guildID")
  async findOne(@Param("guildID") guildID: string) {
    return this.guildsService.findOne(guildID)
  }
}
