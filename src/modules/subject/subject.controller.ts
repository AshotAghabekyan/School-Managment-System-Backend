import type { Subject } from "./interface/subject.interface.ts";
import { SubjectService } from "./subject.service.ts";
import type { SubjectDto, SubjectType } from "./interface/subject.interface.ts";
import type { NextFunction, Request, Response } from "express";




export class SubjectController {
    private service: SubjectService;
    constructor() {
        this.service = new SubjectService();
    }

    public async createSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const subjectDto: SubjectDto = req.body;
            const createdSubject: Subject = await this.service.createSubject(subjectDto);
            res.status(201).json({subject: createdSubject});
        }
        catch(error) {
            next(error)
        }
    };


    public async deleteSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const subjectTitle: SubjectType = req.params.subject;
            const deletedSubject: Subject = await this.service.deleteSubject(subjectTitle)
            res.status(200).json({deletedSubject})
        }
        catch(error) {
            next(error);
        }
    };


    public async findSubjects(req: Request, res: Response, next: NextFunction) {
        try {
            const allSubjects: Subject[] = await this.service.findSubjects();
            res.status(200).json({subjects: allSubjects});
        }
        catch(error) {
            next(error) 
        }
    };
}