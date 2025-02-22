import type {NextFunction, Request, Response} from "express";
import type { ICreatePupilDto } from "./dto/pupil.dto.ts";
import { PupilService, PupilSubjectService } from "./pupil.service.ts";
import { BadRequestException } from "../../exception/bad-request.exception.ts";
import type { SubjectType } from "../subject/interface/subject.interface.ts";


export class PupilController {
    private pupilService: PupilService;
    constructor() {
        this.pupilService = new PupilService();
    }

    
    public async createPupil(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilDto: ICreatePupilDto = req.body;
            const createdPupil = await this.pupilService.createPupil(pupilDto);
            res.status(201).json({pupil: createdPupil});
        }
        catch(error) {
            next(error);
        }
    };


    public async deletePupil(req: Request, res: Response, next: NextFunction) {
        try {
            const targetPupilId: number = +req.params.pupilId;
            if (!targetPupilId) {
                throw new BadRequestException("the `pupilId` param required");
            }
            const deletedPupil = await this.pupilService.deletePupil(targetPupilId);
            res.status(200).json({deletedPupil});
        }
        catch(error) {
            next(error)
        }
    };


    public async getPupils(req: Request, res: Response, next: NextFunction) {
        try {
            const allPupils = await this.pupilService.findPupils();
            res.status(200).json({pupils: allPupils});
        }
        catch(error) {
            next(error);
        }
    };


    public async getPupilById(req: Request, res: Response, next: NextFunction) {
        try {
            const targetPupilId: number = +req.params.pupilId;
            if (!targetPupilId) {
                throw new BadRequestException("the `pupilId` param required");
            }
            
            const targetPupil = await this.pupilService.findPupilById(targetPupilId);
            res.status(200).json({pupil: targetPupil});
        }
        catch(error) {
            next(error);
        }
    };
}




export class PupilSubjectController {
    private pupilSubjectService: PupilSubjectService;

    constructor() {
        this.pupilSubjectService = new PupilSubjectService();
    }

    public async assignSubjectsToPupil(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilId: number = +req.params.pupilId;
            const subjects: SubjectType[] = req.body.subjects;
            console.log(pupilId, subjects);
            const response = await this.pupilSubjectService.assignSubjectsToPupil(pupilId, subjects);
            res.status(200).json({ message: response });
        } catch (error) {
            next(error);
        }
    }

    public async updateSubjectGrade(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilId: number = +req.params.pupilId;
            const subjectId: number = +req.params.subjectId;
            const grade: number = +req.body.grade;

            const updatedSubject = await this.pupilSubjectService.updateSubjectGrade(pupilId, subjectId, grade);
            res.status(200).json({ updatedSubject });
        } catch (error) {
            next(error);
        }
    }

    public async getPupilSubjects(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilId: number = +req.params.pupilId;

            const pupilSubjects = await this.pupilSubjectService.getPupilSubjects(pupilId);
            res.status(200).json({ pupilSubjects });
        } catch (error) {
            next(error);
        }
    }

    public async removeSubjectFromPupil(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilId: number = +req.params.pupilId;
            const subjectId: number = +req.params.subjectId;

            await this.pupilSubjectService.removeSubjectFromPupil(pupilId, subjectId);
            res.status(200).json({ message: "Subject removed successfully" });
        } catch (error) {
            next(error);
        }
    }
}