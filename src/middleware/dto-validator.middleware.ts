

import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";
import { BadRequestException } from "../exception/bad-request.exception.ts";



export class DtoValidator {
    public validate(schema: ObjectSchema) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const { error } = schema.validate(req.body, { abortEarly: false });
                if (error) {
                    throw new BadRequestException('bad request');
                }
                
                next();
            }
            catch(error) {
                next(error)
            }
        };
    };
}


