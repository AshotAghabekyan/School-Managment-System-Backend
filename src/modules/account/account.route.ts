import { Router } from "express";
import { AccountController } from "./account.controller.ts";
import { errorHandler } from "../../middleware/exception-handler.middleware.ts";
import type { NextFunction, Request, Response } from "express";
import { AuthGuard } from "../auth/auth.guard.ts";
import { DtoValidator } from "../../middleware/dto-validator.middleware.ts";



const controller: AccountController = new AccountController();
const authenticationGuard = new AuthGuard();
const dtoValidator = new DtoValidator();
const router = Router();
export default router;


router.post("/", (req: Request, res: Response, next: NextFunction) =>
     controller.createAccount(req, res, next));


router.use((req: Request, res: Response, next: NextFunction) => 
    authenticationGuard.checkJwt(req, res, next));


router.get("/", (req: Request, res: Response, next: NextFunction) =>
     controller.findAccounts(req, res, next));

router.get("/:accountId", (req: Request, res: Response, next: NextFunction) => 
    controller.findAccountById(req, res, next));


router.get("/account/currentAccount", (req: Request, res: Response, next: NextFunction) =>
     controller.getAccountByToken(req, res, next))


router.put("/:accountId", (req: Request, res: Response, next: NextFunction) =>
     controller.updateAccount(req, res, next));

router.delete("/:accountId", (req: Request, res: Response, next: NextFunction) =>
     controller.deleteAccount(req, res, next));

router.use(errorHandler)