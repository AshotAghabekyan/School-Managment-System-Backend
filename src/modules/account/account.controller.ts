import type { Request, Response, NextFunction } from "express";
import type { CreateAccountDto, PublicAccount, UpdateAccountDto } from "./interface/account.interface.ts";
import { AccountService } from "./account.service.ts";
import { NotFoundException } from "../../exception/not-found.exception.ts";
import { InternalServerErrorException } from "../../exception/internal-server-error.exception.ts";
import { ForbiddenException } from "../../exception/forbidden.exception.ts";
import { UnauthorizedException } from "../../exception/unauthorized.exception.ts";

export class AccountController {
    private service: AccountService;

    constructor() {
        this.service = new AccountService();
    }

    public async createAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const accountDto: CreateAccountDto = req.body;
            const createdAccount: PublicAccount = await this.service.createAccount(accountDto);
            res.status(201).json(createdAccount);
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
            res.status(200).json({ deletedUser: deletedUserProfile });
        } catch (error) {
            next(error);
        }
    }

    public async updateAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const profileFields: UpdateAccountDto = req.body;
            const reqUserId: number = req["user"].id;

            if (!profileFields) {
                throw new ForbiddenException("Body is empty or invalid");
            }

            const updatedProfile: PublicAccount = await this.service.updateAccount(profileFields, reqUserId);
            res.status(200).json({ profile: updatedProfile });
        } catch (error) {
            next(error);
        }
    }

    public async findAccounts(req: Request, res: Response, next: NextFunction) {
        try {
            const allProfiles: PublicAccount[] = await this.service.findAccounts();
            res.status(200).json({ profiles: allProfiles });
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
            res.status(200).json({ profile: targetProfile });
        } catch (error) {
            next(error);
        }
    }
}
