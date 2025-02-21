import type { PublicAccount } from "../account/interface/account.interface.ts";
import type { Subject } from "../subject/interface/subject.interface.ts";
import type { CreateTeacherDto, Teacher, TeacherOnSubject } from "./interface/teacher.interface.ts";
import type { ITeacherRepository, ITeacherSubjectRepository } from "./repository/teacher.repository.ts";
import { PrismaTeacherRepository, PrismaTeacherSubjectRepository } from "./repository/teacher.repository.ts";
import { AccountService } from "../account/account.service.ts";
import { NotFoundException } from "../../exception/not-found.exception.ts";
import { BadRequestException } from "../../exception/bad-request.exception.ts";
import { SubjectService } from "../subject/subject.service.ts";





export class TeacherService {
    private repository: ITeacherRepository;
    private accountService: AccountService;

    constructor() {
        this.repository = new PrismaTeacherRepository();
        this.accountService = new AccountService();
    }

    public async createTeacher(teacherDto: CreateTeacherDto): Promise<Partial<Teacher> > {
        const isAccountExist: PublicAccount = await this.accountService.findAccountById(teacherDto.accountId);
        if (!isAccountExist) {
            throw new NotFoundException("Associated account not found");
        }

        const createdTeacher: Partial<Teacher> = await this.repository.createTeacher(teacherDto);
        if (!createdTeacher) {
            throw new BadRequestException("Failed to create teacher");
        }
        return createdTeacher;
    }

    public async findTeachers(): Promise<Teacher[]> {
        const allTeachers: Teacher[] = await this.repository.findTeachers();
        if (!allTeachers.length) {
            throw new NotFoundException("No teachers found");
        }
        return allTeachers;
    }

    public async findTeacherById(teacherId: number): Promise<Teacher> {
        const targetTeacher: Teacher = await this.repository.findTeacherById(teacherId);
        if (!targetTeacher) {
            throw new NotFoundException("Teacher not found");
        }
        return targetTeacher;
    }

    public async deleteTeacher(teacherId: number): Promise<Partial<Teacher>> {
        const deletedTeacher: Partial<Teacher> = await this.repository.deleteTeacher(teacherId);
        if (!deletedTeacher) {
            throw new BadRequestException("Failed to delete teacher");
        }
        return deletedTeacher;
    }
}




export class TeacherSubjectService {
    private repository: ITeacherSubjectRepository;

    constructor() {
        this.repository = new PrismaTeacherSubjectRepository();
    }

    public async getTeacherSubjectsList(teacherId: number) {
        const subjects = await this.repository.findSubjectsByTeacherId(teacherId);
        if (!subjects.length) {
            throw new NotFoundException("No subjects found for this teacher");
        }
        return subjects;
    }


    public async assignSubjectToTeacher(teacherId: number, subjects: string[]) {
        const subjectsOfTeacher = await this.getTeacherSubjectsList(teacherId);
        const subjectService: SubjectService = new SubjectService();
        let newSubjects: Subject[] = await subjectService.bulkFindSubjectsByTitle(subjects);

        const uniqueSubjects: Subject[] = newSubjects.filter((newSubject: Subject) => {
            return !subjectsOfTeacher.some(teacherSubject => teacherSubject.subjectId === newSubject.subjectId);
        });
        
        const updatedTeacher: Partial<TeacherOnSubject>[] = await this.repository.assignSubjectToTeacher(teacherId, uniqueSubjects);
        if (!updatedTeacher) {
            throw new BadRequestException("Failed to update teacher");
        }

        return updatedTeacher;
    }


    public async removeSubjectFromTeacher(teacherId: number, subjects: string[]) {
        return this.repository.removeSubjectFromTeacher(teacherId, subjects);
    }
}