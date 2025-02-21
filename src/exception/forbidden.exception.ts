import { HttpException } from "./base.exception.ts";


export class ForbiddenException extends HttpException {
    constructor(message: string = "Forbidden", details?: any) {
        super(message, 403, details);
    }
}