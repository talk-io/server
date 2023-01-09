import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "./message.schema";
import { Model } from "mongoose";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>
  ) {}

  async create(message: CreateMessageDto, channelID: string, authorID: string) {
    const createdMessage = new this.messageModel({
      ...message,
      channelID,
      authorID,
    });

    const savedMessage = await createdMessage.save();

    return savedMessage.populate(["author", "channel"]);
  }
}
