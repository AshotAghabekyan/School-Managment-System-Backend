import type { NextFunction, Request, Response } from "express";
import { TeacherService, TeacherSubjectService } from "./teacher.service.ts";
import type { ICreateTeacherDto } from "./dto/teacher.dto.ts";
import { ApiResponse } from "../global/types/api/api.types.ts";
import type { Teacher } from "./interface/teacher.interface.ts";
import type { Subject } from "../subject/interface/subject.interface.ts";
import { PublicAccount } from "../account/interface/account.interface.ts";




export class TeacherController {
    private service: TeacherService;

    constructor() {
        this.service = new TeacherService();
    }

    public async createTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const teacherDto: ICreateTeacherDto = req.body;
            const teacher = await this.service.createTeacher(teacherDto);
            const apiResponse = new ApiResponse<PublicAccount>(teacher, 201, true, 'The teacher has been created');
            res.status(201).json(apiResponse);
        } catch (error) {
            next(error)
        }
    }


    public async findTeachers(req: Request, res: Response, next: NextFunction) {
        try {
            const teachers = await this.service.findTeachers();
            const apiResponse = new ApiResponse<Teacher[]>(teachers, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error)
        }
    }


    public async findTeacherById(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const teacher = await this.service.findTeacherById(Number(teacherId));
            const apiResponse = new ApiResponse<Teacher>(teacher, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }
    

    public async findTeacherByAccountId(req: Request, res: Response, next: NextFunction) {
        try {
            const { accountId } = req.params;
            const teacher = await this.service.findTeacherByAccountId(Number(accountId));
            const apiResponse = new ApiResponse<Teacher>(teacher, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error);
        }
    }

     


    public async deleteTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const deletedTeacher = await this.service.deleteTeacher(Number(teacherId));
            const apiResponse = new ApiResponse<Partial<Teacher>>(deletedTeacher, 200, true, "The teacher has been deleted");
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error)
        }
    }
}





export class TeacherSubjectController {
    private service: TeacherSubjectService;

    constructor() {
        this.service = new TeacherSubjectService();
    }

    public async getTeacherSubjectsList(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const subjects = await this.service.getTeacherSubjectsList(Number(teacherId));
            const apiResponse = new ApiResponse<Subject>(subjects, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error)
        }
    }
    

    public async assignSubjectToTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const subjects: string[] = req.body.subjects
            const updatedSubjects = await this.service.assignSubjectToTeacher(Number(teacherId), subjects);
            const apiResponse = new ApiResponse(updatedSubjects, 201, true, 'The subjects has been assigned to the teacher')
            res.status(201).json(apiResponse);
        } catch (error) {
            next(error)
        }
    }

    public async removeSubjectFromTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const subjects: string[] = req.body.subjects;
            const updatedSubjects = await this.service.removeSubjectFromTeacher(Number(teacherId), subjects);
            const apiResponse = new ApiResponse(updatedSubjects, 200, true);
            res.status(200).json(apiResponse);
        } catch (error) {
            next(error)
        }
    }
}