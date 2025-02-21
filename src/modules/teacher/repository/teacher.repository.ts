import { Prisma } from "@prisma/client";
import type { Subject } from "../../subject/interface/subject.interface.ts";
import type {Teacher, TeacherOnSubject, CreateTeacherDto } from "../interface/teacher.interface.ts";
import { TeacherModel, TeacherSubjectModel } from "../../../prisma/prisma.provider.ts";


export interface ITeacherRepository {
    createTeacher(teacherDto: CreateTeacherDto): Promise<Partial<Teacher>>;
    findTeachers(): Promise<Teacher[]>;
    findTeacherById(teacherId: number): Promise<Teacher>;
    findTeacherByEmail(email: string): Promise<Teacher>;
    deleteTeacher(teacherId: number): Promise<Partial<Teacher>>;
}



export interface ITeacherSubjectRepository {
    assignSubjectToTeacher(teacherId: number, subjectsTitle: Subject[]): Promise<Partial<TeacherOnSubject>[]>
    removeSubjectFromTeacher(teacherId: number, subjectsTitle: string[]): Promise<TeacherOnSubject | Partial<TeacherOnSubject>> 
    findSubjectsByTeacherId(teacherId: number): Promise<Subject[]>;
}






export class PrismaTeacherRepository implements ITeacherRepository {
    private teacherModel: Prisma.TeacherDelegate;
    constructor() {
        this.teacherModel = new TeacherModel().getModel();
    }


    public async createTeacher(teacherDto: CreateTeacherDto): Promise<Partial<Teacher>> {
        const createdTeacher: Partial<Teacher> = await this.teacherModel.create({
            data: {
                accountId: +teacherDto.accountId,
            },    
        })
        return createdTeacher;
    }


    public async deleteTeacher(teacherId: number): Promise<Partial<Teacher>> {
        const deletedTeacher: Partial<Teacher> = await this.teacherModel.delete({
            where: {teacherId}
        })
        return deletedTeacher;
    }


    public async findTeachers(): Promise<Teacher[]> {
        const allTeachers: Teacher[] = await this.teacherModel.findMany({
            select: {
                teacherId: true,
                accountId: true,
                account: {
                    omit: {password: true, createdAt: true}
                },
                teacherSubjects: {
                    select: {subject: true},
                }
            },
        });
        return allTeachers;
    }


    public async findTeacherById(teacherId: number): Promise<Teacher> {
        const targetTeacher: Teacher = await this.teacherModel.findFirst({
            where: {teacherId},
            include: {
                teacherSubjects: {
                    select: {
                        subject: true
                    }
                },
                account: {
                    omit: {password: true, createdAt: true}
                }   
            }
        })

        return targetTeacher;
    }


    public async findTeacherByEmail(email: string): Promise<Teacher> {
        const targetTeacher: Teacher = await this.teacherModel.findFirst({
            where: {
                account: {email},
            },
            include: {
                account: {
                    omit: {password: true, createdAt: true}
                },
                teacherSubjects: {
                    select: {
                        subject: true
                    }
                },
            }

        });
        

        return targetTeacher;
    }

}







export class PrismaTeacherSubjectRepository implements ITeacherSubjectRepository{
    private teacherSubjectModel: Prisma.TeacherOnSubjectDelegate;
    constructor() {
        this.teacherSubjectModel = new TeacherSubjectModel().getModel();
    }    


    public async assignSubjectToTeacher(teacherId: number, subjects: Subject[]) {
        await this.teacherSubjectModel.createMany({
            skipDuplicates: true,
            data: subjects.map((subject: Subject) => {
                return {
                    subjectId: subject.subjectId,
                    teacherId
                }
            }),
        });

        const teacherOnSubjects: Partial<TeacherOnSubject>[] = await this.teacherSubjectModel.findMany({
            where: {teacher: {teacherId}},
            select: {
                subject: true,
            },
        })
        return teacherOnSubjects
    }


    public async removeSubjectFromTeacher(teacherId: number, subjectsTitle: string[]): Promise<TeacherOnSubject | Partial<TeacherOnSubject>> {
        await this.teacherSubjectModel.deleteMany({
            where: {
                subject: {title: {in: subjectsTitle}}
            }
        })

        const teacher: Partial<TeacherOnSubject> = await this.teacherSubjectModel.findFirst({
            where: {teacher: {teacherId}},
            select: {teacher: true},
        })
        return teacher
    }


    public async findSubjectsByTeacherId(teacherId: number): Promise<Subject[]> {
        const teacherOnSubjects = await this.teacherSubjectModel.findMany({
            where: {
                teacherId
            },
            select: {
                subject: true
            }
        })
        return teacherOnSubjects.map((currSubject) => currSubject.subject)
    }
}