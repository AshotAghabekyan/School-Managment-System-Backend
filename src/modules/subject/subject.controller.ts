import type { Subject } from "./interface/subject.interface.ts";
import { SubjectService } from "./subject.service.ts";
import type { SubjectType } from "./interface/subject.interface.ts";
import type { ICreateSubjectDto } from "./dto/subject.dto.ts";
import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../global/types/api/api.types.ts";




export class SubjectController {
    private service: SubjectService;
    constructor() {
        this.service = new SubjectService();
    }

    public async createSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const subjectDto: ICreateSubjectDto = req.body;
            const createdSubject: Subject = await this.service.createSubject(subjectDto);
            const apiResponse = new ApiResponse(createdSubject, 201, true, 'The subject has been created');
            res.status(201).json(apiResponse);
        }
        catch(error) {
            next(error)
        }
    };


    public async deleteSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const subjectTitle: SubjectType = req.params.subject;
            const deletedSubject: Subject = await this.service.deleteSubject(subjectTitle)
            const apiResponse = new ApiResponse(deletedSubject, 200, true, 'The subject has been deleted');
            res.status(200).json(apiResponse)
        }
        catch(error) {
            next(error);
        }
    };


    public async findSubjects(req: Request, res: Response, next: NextFunction) {
        try {
            const allSubjects: Subject[] = await this.service.findSubjects();
            const apiResponse = new ApiResponse(allSubjects, 200, true);
            res.status(200).json(apiResponse);
        }
        catch(error) {
            next(error) 
        }
    };
}