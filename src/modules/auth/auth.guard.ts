import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from './interface/auth.interface.ts';

import { AuthService } from './auth.service.ts';
import { UnauthorizedException } from '../../exception/unauthorized.exception.ts';


export class AuthGuard {
    // private authService: AuthService
    // constructor() {
    //     this.authService = new AuthService();
    // }


    public checkJwt(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new UnauthorizedException('Authorization header is missing')
            }
    
            const token: string = authHeader.split(' ')[1]; 
            if (!token) {
                throw new UnauthorizedException('Token is missing')
            }
            
            const authService = new AuthService();
            const payload: JwtPayload = authService.verifyToken(token);
            if (!payload) {
                throw new UnauthorizedException('Invalid token')
            }
    
            req['user'] = payload;
            next();
        }
        catch(error) {
            next(error)
        }
    }
}