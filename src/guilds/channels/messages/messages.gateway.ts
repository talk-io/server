import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {UseGuards} from "@nestjs/common";
import {WsAuthGuard} from "../../../guards/ws-auth.guard";

@WebSocketGateway()
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    console.log(createMessageDto)
    return "Hiya!"
    // return this.messagesService.create(createMessageDto);
  }

  // @SubscribeMessage('findAllMessages')
  // findAll() {
  //   return this.messagesService.findAll();
  // }
}
