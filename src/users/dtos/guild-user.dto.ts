import {Expose} from "class-transformer";

export class GuildUserDto {
    @Expose()
    _id: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    discriminator: string;
}