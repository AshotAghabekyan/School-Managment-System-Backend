import { errorHandler } from "../../middleware/exception-handler.middleware.ts";
import { TeacherController, TeacherSubjectController } from "./teacher.controller.ts";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

const controller: TeacherController = new TeacherController();
const subController: TeacherSubjectController = new TeacherSubjectController();
const router = Router();
export default router;





router.get("/", (req: Request, res: Response, next: NextFunction) => 
    controller.findTeachers(req, res, next));

router.get("/:teacherId", (req: Request, res: Response, next: NextFunction) => 
    controller.findTeacherById(req, res, next)
);

router.post("/", (req: Request, res: Response, next: NextFunction) => 
    controller.createTeacher(req, res, next)
);

router.delete("/:teacherId", (req: Request, res: Response, next: NextFunction) => 
    controller.deleteTeacher(req, res, next)
);



// Teacher Subject Endpoints
router.get("/:teacherId/subjects/", (req: Request, res: Response, next: NextFunction) => 
    subController.getTeacherSubjectsList(req, res, next)
);

router.post("/:teacherId/subjects/", (req: Request, res: Response, next: NextFunction) => 
    subController.assignSubjectToTeacher(req, res, next)
);

router.delete("/:teacherId/subjects/:subject", (req: Request, res: Response, next: NextFunction) => 
    subController.removeSubjectFromTeacher(req, res, next)
);


router.use(errorHandler)