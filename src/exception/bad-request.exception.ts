import { HttpException } from "./base.exception.ts";



export class BadRequestException extends HttpException {
    constructor(message: string = 'Bad Request', details?: any) {
        super(message, 400, details);
    }
}