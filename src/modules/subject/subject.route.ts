import { errorHandler } from "../../middleware/errorHandler.middleware.ts";
import { SubjectController } from "./subject.controller.ts";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

const controller: SubjectController = new SubjectController();
const router: Router = Router();
export default router;


router.get('/', (req: Request, res: Response, next: NextFunction) => 
    controller.findSubjects(req, res, next));

router.post("/", (req: Request, res: Response, next: NextFunction) =>
     controller.createSubject(req, res, next));

router.delete('/:subject', (req: Request, res: Response, next: NextFunction) =>
     controller.findSubjects(req, res, next));


router.use(errorHandler)