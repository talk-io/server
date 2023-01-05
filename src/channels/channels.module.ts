import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { ChannelsGateway } from "./channels.gateway";
import { ChannelsController } from "./channels.controller";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./message.schema";
import { Channel, ChannelSchema } from "./channel.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: Channel.name,
        schema: ChannelSchema,
      },
    ]),
  ],
  providers: [ChannelsGateway, ChannelsService, SnowflakeGenerator],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
