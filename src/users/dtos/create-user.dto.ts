import {IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(4)
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    readonly password: string;
}