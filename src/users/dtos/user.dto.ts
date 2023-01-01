import {Expose} from "class-transformer";

export class UserDto {
    @Expose()
    id: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    token: string;

    @Expose()
    discriminator: string;
}