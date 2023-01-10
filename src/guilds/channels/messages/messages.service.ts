import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "./message.schema";
import { Model } from "mongoose";
import { CreateMessageDto } from "./dto/create-message.dto";
import * as dayjs from "dayjs";

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

  async getAllMessagesInCurrentChannel(
    channelID: string,
    limit: number,
    before: number
  ) {
    const time = before ? dayjs.unix(before).toDate() : dayjs().toDate();
    return this.messageModel
      .find({ channelID, createdAt: { $lte: time } })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate(["author"]);
  }
}
