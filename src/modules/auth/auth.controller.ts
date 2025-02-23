import type {Request, Response, NextFunction} from "express";
import type { JwtToken, SignInDto } from "./interface/auth.interface.ts";
import { AuthService } from "./auth.service.ts";
import { ApiResponse } from "../global/types/api/api.types.ts";


export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService();
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const signInDto: SignInDto = req.body;
            const token: JwtToken = await this.authService.authenticate(signInDto);
            const apiResponse: ApiResponse<JwtToken> = new ApiResponse(token, 201, true);
            res.status(200).json(apiResponse);
        }
        catch(error) {
            next(error)
        }
    }
}