
import type { Request, Response, NextFunction } from "express";
import { HttpException } from "../exception/base.exception.ts";

export function errorHandler(
    err: Error | HttpException,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    if (err instanceof HttpException) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            details: err.details,
        });
        return;
    }

    console.error(err); 
    res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
    });
}