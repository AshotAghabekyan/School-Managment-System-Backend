import type {NextFunction, Request, Response} from "express";
import type { ICreatePupilDto } from "./dto/pupil.dto.ts";
import { PupilService, PupilSubjectService } from "./pupil.service.ts";
import { BadRequestException } from "../../exception/bad-request.exception.ts";
import type { SubjectType } from "../subject/interface/subject.interface.ts";
import { ApiResponse } from "../global/types/api/api.types.ts";
import type { PupilOnSubject } from "./interface/pupil.interface.ts";


export class PupilController {
    private pupilService: PupilService;
    constructor() {
        this.pupilService = new PupilService();
    }

    
    public async createPupil(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilDto: ICreatePupilDto = req.body;
            const createdPupil = await this.pupilService.createPupil(pupilDto);
            const apiResponse = new ApiResponse(createdPupil, 201, true, 'The pupil has been created');
            res.status(201).json(apiResponse);
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
            const apiResponse = new ApiResponse(deletedPupil, 200, true, 'The pupil has been deleted')
            res.status(200).json(apiResponse);
        }
        catch(error) {
            next(error)
        }
    };


    public async getPupils(req: Request, res: Response, next: NextFunction) {
        try {
            const allPupils = await this.pupilService.findPupils();
            const apiResponse = new ApiResponse(allPupils, 200, true);
            res.status(200).json(apiResponse);
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
            const apiResponse = new ApiResponse(targetPupil, 200, true);
            res.status(200).json(apiResponse);
        }
        catch(error) {
            next(error);
        }
    };



    public async getPupilByAccountId(req: Request, res: Response, next: NextFunction) {
        try {
            const targetPupilId: number = +req.params.accountId;
            if (!targetPupilId) {
                throw new BadRequestException("the `accountId` param required");
            }
            
            const targetPupil = await this.pupilService.findPupilByAccountId(targetPupilId);
            const apiResponse = new ApiResponse(targetPupil, 200, true);
            res.status(200).json(apiResponse);
        }
        catch(error) {
            next(error)
        }
    }
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
            const pupilSubjects = await this.pupilSubjectService.assignSubjectsToPupil(pupilId, subjects);
            const apiResponse = new ApiResponse(pupilSubjects, 201, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }


    public async removeSubjectFromPupil(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilId: number = +req.params.pupilId;
            const subjectId: number = +req.params.subjectId;

            const pupilSubjects = await this.pupilSubjectService.removeSubjectFromPupil(pupilId, subjectId);
            const apiResponse = new ApiResponse(pupilSubjects, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }


    public async updatePupilGrade(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilId: number = +req.params.pupilId;
            const subjectId: number = +req.params.subjectId;
            const grade: number = +req.body.grade;

            const updatedSubject: PupilOnSubject = await this.pupilSubjectService.updatePupilGrade(pupilId, subjectId, grade);
            const apiResponse = new ApiResponse(updatedSubject, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

    public async getPupilSubjects(req: Request, res: Response, next: NextFunction) {
        try {
            const pupilId: number = +req.params.pupilId;

            const pupilSubjects = await this.pupilSubjectService.getPupilSubjects(pupilId);
            const apiResponse = new ApiResponse(pupilSubjects, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }


}