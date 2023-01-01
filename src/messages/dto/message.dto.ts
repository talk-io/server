import {Expose} from "class-transformer";

export class MessageDto {
    @Expose()
    id: string;

    @Expose()
    authorID: string;

    @Expose()
    channelID: string;

    @Expose()
    guildID: string;

    @Expose()
    content: string;
}