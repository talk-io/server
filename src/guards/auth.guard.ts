import {CanActivate, ExecutionContext} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../users/user.schema";
import {Model} from "mongoose";

const jwt = require("jsonwebtoken");

export class AuthGuard implements CanActivate {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const authorization: string | undefined = request.headers.authorization;
        if(!authorization) return false;

        const [_, token] = authorization.split(' ');

        const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await this.userModel.findOne({_id: payload._id, tokens: {$in: [token]}});

        request.currentUser = {_id: payload._id, token};

        return !!user;

    }
}