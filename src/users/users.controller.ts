import {Body, Controller, Get, HttpCode, Post, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dtos/create-user.dto";
import {UsersService} from "./users.service";
import {Serialize} from "../interceptors/serialize.interceptor";
import {UserDto} from "./dtos/user.dto";
import {AuthGuard} from "../guards/auth.guard";
import {CurrentUser, CurrentUserType} from "./decorators/current-user.decorator";
import {LoginUserDto} from "./dtos/login-user.dto";
import {Timeout} from "../interceptors/timeout.interceptor";

@Controller('auth')
// @Timeout(5)
@Serialize(UserDto)
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post("/signup")
    async create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

    @HttpCode(200)
    @Post("/login")
    async login(@Body() user: LoginUserDto) {
        return this.usersService.login(user)
    }

    @UseGuards(AuthGuard)
    @Get("/me")
    async findMe(@CurrentUser("_id") userID: string) {
        return this.usersService.findOne(userID)
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Post("/signout")
    async signOut(@CurrentUser() user: CurrentUserType) {
        return this.usersService.signOut(user);
    }
}
