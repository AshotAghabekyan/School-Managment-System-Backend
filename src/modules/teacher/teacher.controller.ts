import type { NextFunction, Request, Response } from "express";
import { TeacherService, TeacherSubjectService } from "./teacher.service.ts";
import type { ICreateTeacherDto } from "./dto/teacher.dto.ts";




export class TeacherController {
    private service: TeacherService;

    constructor() {
        this.service = new TeacherService();
    }

    public async createTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const teacherDto: ICreateTeacherDto = req.body;
            const teacher = await this.service.createTeacher(teacherDto);
            res.status(201).json(teacher);
        } catch (error) {
            next(error)
        }
    }


    public async findTeachers(req: Request, res: Response, next: NextFunction) {
        try {
            const teachers = await this.service.findTeachers();
            res.status(200).json({teachers: teachers});
        } catch (error) {
            next(error)
        }
    }


    public async findTeacherById(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const teacher = await this.service.findTeacherById(Number(teacherId));
            res.status(200).json(teacher);
        } catch (error) {
            next(error);
        }
    }
    

    public async deleteTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const deletedTeacher = await this.service.deleteTeacher(Number(teacherId));
            res.status(200).json({ deletedTeacher });
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
            res.status(200).json({ subjects });
        } catch (error) {
            next(error)
        }
    }
    

    public async assignSubjectToTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const subjects: string[] = req.body.subjects
            const result = await this.service.assignSubjectToTeacher(Number(teacherId), subjects);
            res.status(201).json(result);
        } catch (error) {
            next(error)
        }
    }

    public async removeSubjectFromTeacher(req: Request, res: Response, next: NextFunction) {
        try {
            const { teacherId } = req.params;
            const subjects: string[] = req.body.subjects;
            const result = await this.service.removeSubjectFromTeacher(Number(teacherId), subjects);
            res.status(200).json({ message: "Subject removed", result });
        } catch (error) {
            next(error)
        }
    }
}