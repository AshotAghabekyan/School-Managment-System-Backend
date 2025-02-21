import { Router } from "express";
import { AccountController } from "./account.controller.ts";
import { errorHandler } from "../../middleware/errorHandler.middleware.ts";
import type { NextFunction, Request, Response } from "express";

const controller: AccountController = new AccountController();
const router = Router();
export default router;

router.post("/", (req: Request, res: Response, next: NextFunction) => controller.createAccount(req, res, next));
router.get("/", (req: Request, res: Response, next: NextFunction) => controller.findAccounts(req, res, next));
router.get("/:accountId", (req: Request, res: Response, next: NextFunction) => controller.findAccountById(req, res, next));
router.put("/:accountId", (req: Request, res: Response, next: NextFunction) => controller.updateAccount(req, res, next));
router.delete("/:accountId", (req: Request, res: Response, next: NextFunction) => controller.deleteAccount(req, res, next));

router.use(errorHandler)