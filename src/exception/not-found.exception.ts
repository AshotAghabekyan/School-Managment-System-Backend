import { HttpException } from "./base.exception.ts";



export class NotFoundException extends HttpException {
    constructor(message: string = "Not Found", details?: any) {
        super(message, 404, details);
    }
}