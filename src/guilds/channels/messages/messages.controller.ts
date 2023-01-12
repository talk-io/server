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
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { Serialize } from "../../../interceptors/serialize.interceptor";
import { MessageDto } from "./dto/message.dto";
import { JwtAuthGuard } from "../../../guards/auth.guard";

@Controller()
@Serialize(MessageDto)
@UseGuards(JwtAuthGuard)
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
