import {Body, Controller, Param, Post, UseGuards} from "@nestjs/common";
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

  @Post("/:serverID")
  async join(@Param("serverID") serverID: string, @CurrentUser() user: CurrentUserType) {
    return this.guildsService.join(serverID, user);
  }
}
