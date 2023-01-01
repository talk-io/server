import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export type CurrentUserType = {
    _id: string;
    token: string;
}

export const CurrentUser = createParamDecorator((data: string | null, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser[data] || request.currentUser;
})