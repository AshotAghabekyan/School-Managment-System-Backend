import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '../../../exception/unauthorized.exception';



export class AuthGuard {
    private authService: AuthService
    constructor() {
        this.authService = new AuthService();
    }


    public checkJwt(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing')
        }

        const token = authHeader.split(' ')[1]; 
        if (!token) {
            throw new UnauthorizedException('Token is missing')
        }

        const payload = this.authService.verifyToken(token);
        if (!payload) {
            throw new UnauthorizedException('Invalid token')
        }

        req['user'] = payload;
        next();
    }
}