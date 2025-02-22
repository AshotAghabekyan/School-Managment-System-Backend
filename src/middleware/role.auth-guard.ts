import type { NextFunction, Request , Response} from "express";
import { AccountService } from "../modules/account/account.service.ts";
import type { Role } from "../modules/account/interface/account.interface.ts";
import { ForbiddenException } from "../exception/forbidden.exception.ts";
import { UnauthorizedException } from "../exception/unauthorized.exception.ts";



export class RoleGuard {
    public checkRole(validRoles: Role[]) {
        return async function(req: Request, res: Response, next: NextFunction) {
            try {
                const accountService: AccountService = new AccountService();
                const reqUserEmail = req['user']?.email;
                if (!reqUserEmail) {
                    throw new UnauthorizedException()
                }
                const accountCredentials = await accountService.getAccountWithPrivateData(reqUserEmail);
                
                if (!validRoles.includes(accountCredentials.role)) {
                    throw new ForbiddenException('Requested resource is forbidden');
                }
                next();
            }
            catch(error) {
                next(error);
            }
        }
    }

}