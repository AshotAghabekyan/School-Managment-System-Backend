import { Router, type Request, type Response, type NextFunction } from "express";
import { AuthController } from "./auth.controller.ts";



const router = Router();
const controller = new AuthController();
export default router

router.post('/', (req: Request, res: Response, next: NextFunction) => controller.signIn(req, res, next))