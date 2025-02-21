import type {Request, Response, NextFunction } from "express";
import { Router } from "express";
import { PupilController, PupilSubjectController } from "./pupil.controller.ts";


const router: Router = Router();
const controller: PupilController = new PupilController();
const subController: PupilSubjectController = new PupilSubjectController();
export default router

router.get("/", (req: Request, res: Response, next: NextFunction) => 
    controller.getPupils(req, res, next))

router.get("/:pupilId", (req: Request, res: Response, next: NextFunction) => 
    controller.getPupilById(req, res, next))

router.post('/', (req: Request, res: Response, next: NextFunction) => 
    controller.createPupil(req, res, next))

router.delete('/:pupilId', (req: Request, res: Response, next: NextFunction) => 
    controller.deletePupil(req, res, next))



router.get('/:pupilId/subjects', (req: Request, res: Response, next: NextFunction) => 
    subController.getPupilSubjects(req, res, next))

router.put("/:pupilId/subjects/:subjectId/grade", (req: Request, res: Response, next: NextFunction) => 
    subController.updateSubjectGrade(req, res, next))

router.post('/:pupilId/subjects', (req: Request, res: Response, next: NextFunction) => 
    subController.assignSubjectsToPupil(req, res, next))

router.delete("/:pupilId/subjects/:subjectId", (req: Request, res: Response, next: NextFunction) => 
    subController.removeSubjectFromPupil(req, res, next))


