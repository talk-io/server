import {NestInterceptor, ExecutionContext, CallHandler, UseInterceptors} from "@nestjs/common";
import {Observable} from "rxjs";

export function Timeout(seconds: number) {
    return UseInterceptors(new TimeoutInterceptor(seconds))
}

export class TimeoutInterceptor implements NestInterceptor {
    constructor(private seconds: number) {
    }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        console.log("TimeoutInterceptor");
        // @ts-ignore
        return new Promise(res => setTimeout(() => res(handler.handle()), this.seconds * 1000));
    }
}