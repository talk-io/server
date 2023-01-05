import {Expose, Type} from "class-transformer";
import {Guild} from "../../guilds/guild.schema";
import {BasicGuildDto} from "../../guilds/dto/basic-guild.dto";

export class UserDto {
    @Expose()
    _id: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    token: string;

    @Expose()
    discriminator: string;

    @Expose()
    @Type(() => BasicGuildDto)
    guilds: Array<Guild>;
}