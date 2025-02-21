import { HttpException } from "./base.exception.ts";



export class InternalServerErrorException extends HttpException {
    constructor(message: string = "Internal Server Error", details?: any) {
        super(message, 500, details);
    }
}