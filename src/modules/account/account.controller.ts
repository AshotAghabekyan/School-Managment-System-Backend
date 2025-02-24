import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../auth/interface/auth.interface.ts";
import type { ICreateAccountDto, IUpdateAccountDto } from "./dto/account.dto.ts";
import type { PublicAccount } from "./interface/account.interface.ts";
import { AccountService } from "./account.service.ts";
import { NotFoundException } from "../../exception/not-found.exception.ts";
import { ForbiddenException } from "../../exception/forbidden.exception.ts";
import { ApiResponse } from "../global/types/api/api.types.ts";




export class AccountController {
    private service: AccountService;

    constructor() {
        this.service = new AccountService();
    }

    public async createAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const accountDto: ICreateAccountDto = req.body;
            accountDto.age = +accountDto.age
            const createdAccount: PublicAccount = await this.service.createAccount(accountDto);
            const apiResponse: ApiResponse<PublicAccount> = new ApiResponse<PublicAccount>(
                createdAccount,
                201,
                true,
                'The Account has been created'
            )
            res.status(201).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public async deleteAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const accountId: number = +req.params.accountId;
            if (!accountId) {
                throw new NotFoundException("accountId param is missing in params");
            }

            const deletedUserProfile: PublicAccount = await this.service.deleteAccount(accountId);
            const apiResponse: ApiResponse<PublicAccount> = new ApiResponse<PublicAccount>(
                deletedUserProfile,
                200,
                true,
                'The Account has been deleted'
            )
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public async updateAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const profileFields: IUpdateAccountDto = req.body;
            const reqUser: JwtPayload = req["user"];

            if (!profileFields) {
                throw new ForbiddenException("Body is empty or invalid");
            }

            const updatedProfile: PublicAccount = await this.service.updateAccount(profileFields, reqUser.accountId);
            const apiResponse: ApiResponse<PublicAccount> = new ApiResponse<PublicAccount>(
                updatedProfile,
                200,
                true,
                'The Account has been updated'
            )
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public async findAccounts(req: Request, res: Response, next: NextFunction) {
        try {
            const allProfiles: PublicAccount[] = await this.service.findAccounts();
            const apiResponse: ApiResponse<PublicAccount[]> = new ApiResponse<PublicAccount[]>(
                allProfiles,
                200,
                true,
            )
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public async findAccountById(req: Request, res: Response, next: NextFunction) {
        try {
            const accountId: number = +req.params.accountId;
            if (!accountId) {
                throw new NotFoundException("accountId param is missing in params");
            }

            const targetProfile: PublicAccount = await this.service.findAccountById(accountId);
            const apiResponse: ApiResponse<PublicAccount> = new ApiResponse<PublicAccount>(
                targetProfile,
                200,
                true,
            )
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }



    public async getAccountByToken(req: Request, res: Response, next: NextFunction) {
        try {
            const reqUser: JwtPayload = req['user'];
            const targetUser: PublicAccount = await this.service.findAccountById(reqUser.accountId);
            const apiResponse = new ApiResponse(targetUser, 200, true);
            res.status(200).json(apiResponse);
        }
        catch(error) {
            next(error);
        }
    }
}
