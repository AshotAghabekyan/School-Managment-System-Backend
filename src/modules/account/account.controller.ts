import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../global/auth/interface/auth.interface.ts";
import type { ICreateAccountDto, IUpdateAccountDto } from "./dto/account.dto.ts";
import type { PublicAccount } from "./interface/account.interface.ts";
import { AccountService } from "./account.service.ts";
import { NotFoundException } from "../../exception/not-found.exception.ts";
import { ForbiddenException } from "../../exception/forbidden.exception.ts";




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
            res.status(201).json({data: {account: createdAccount}});
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
            res.status(200).json({data: { deletedAccount: deletedUserProfile}});
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
            res.status(200).json({data: { profile: updatedProfile }});
        } catch (error) {
            next(error);
        }
    }

    public async findAccounts(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = req.query.limit;
            const offset = req.query.offset;
            const allProfiles: PublicAccount[] = await this.service.findAccounts();
            res.status(200).json({data: { profiles: allProfiles }});
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
            res.status(200).json({data: { profile: targetProfile }});
        } catch (error) {
            next(error);
        }
    }
}
