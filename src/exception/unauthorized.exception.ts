import { HttpException } from "./base.exception.ts";



export class UnauthorizedException extends HttpException {
    constructor(message: string = "Unauthorized", details?: any) {
        super(message, 401, details);
    }
}