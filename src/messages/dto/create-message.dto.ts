import {IsNotEmpty, IsString} from "class-validator";

export class CreateMessageDto {
    @IsString()
    authorID: string;

    @IsString()
    channelID: string;

    @IsString()
    guildID: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
