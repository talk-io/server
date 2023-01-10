import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";
import { AuthGuard } from "../../../guards/auth.guard";
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { UserDto } from "../../../users/dtos/user.dto";
import { Serialize } from "../../../interceptors/serialize.interceptor";
import { MessageDto } from "./dto/message.dto";

@Controller()
@Serialize(MessageDto)
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Param("channelID") channelID: string,
    @CurrentUser("_id") user: string
  ) {
    return this.messagesService.create(createMessageDto, channelID, user);
  }

  @Get()
  async getAllMessagesInCurrentChannel(
    @Param("channelID") channelID: string,
    @Query("limit") limit: number,
    @Query("before") before: number
  ) {
    return this.messagesService.getAllMessagesInCurrentChannel(
      channelID,
      limit,
      before
    );
  }
}
