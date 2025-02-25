import { Prisma } from "@prisma/client";
import type { Subject } from "../../subject/interface/subject.interface.ts";
import type {Teacher } from "../interface/teacher.interface.ts";
import type { ICreateTeacherDto } from "../dto/teacher.dto.ts";
import { TeacherModel } from "../../../prisma/prisma.provider.ts";


export interface ITeacherRepository {
    createTeacher(teacherDto: ICreateTeacherDto): Promise<Partial<Teacher>>;
    findTeachers(): Promise<Teacher[]>;
    findTeacherById(teacherId: number): Promise<Teacher>;
    findTeacherByAccountId(accountId: number): Promise<Teacher>
    findTeacherByEmail(email: string): Promise<Teacher>;
    deleteTeacher(teacherId: number): Promise<Partial<Teacher>>;
}



export interface ITeacherSubjectRepository {
    assignSubjectToTeacher(teacherId: number, subjectsTitle: Subject[]): Promise<Subject[]>
    removeSubjectFromTeacher(teacherId: number, subjectsTitle: string[]): Promise<Subject[]> 
    findSubjectsByTeacherId(teacherId: number): Promise<Subject[]>;
}






export class PrismaTeacherRepository implements ITeacherRepository {
    private teacherModel: Prisma.TeacherDelegate;
    constructor() {
        this.teacherModel = new TeacherModel().getModel();
    }


    public async createTeacher(teacherDto: ICreateTeacherDto): Promise<Partial<Teacher>> {
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
                subjects: true
            },
        });
        return allTeachers;
    }


    public async findTeacherById(teacherId: number): Promise<Teacher> {
        const targetTeacher: Teacher = await this.teacherModel.findFirst({
            where: {teacherId},
            include: {
                subjects: true,
                account: {
                    omit: {password: true, createdAt: true}
                }   
            }
        })

        return targetTeacher;
    }


    public async findTeacherByAccountId(accountId: number): Promise<Teacher> {
        const targetTeacher: Teacher = await this.teacherModel.findFirst({
            where: {
                account: {
                    accountId
                }
            },
            include: {
                subjects: true,
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
                subjects: true
            }

        });
        

        return targetTeacher;
    }

}







export class PrismaTeacherSubjectRepository implements ITeacherSubjectRepository{
    private teacherModel: Prisma.TeacherDelegate;
    constructor() {
        this.teacherModel = new TeacherModel().getModel();
    }    


    public async assignSubjectToTeacher(teacherId: number, subjects: Subject[]) {
        await this.teacherModel.update({
            where: {
                teacherId,
            },
            data: {
                subjects: {
                    connect: subjects.map((subject) => {
                        return {
                            subjectId: subject.subjectId
                        }
                    })
                }
            }
        })

        const teacherOnSubjects = await this.teacherModel.findFirst({
            where: {teacherId},
            select: {
                subjects: true
            }
        })
        return teacherOnSubjects.subjects
    }


    public async removeSubjectFromTeacher(teacherId: number, subjectsTitle: string[]): Promise<Subject[]> {
        const subjects = await this.teacherModel.findFirst({
            where: { teacherId },
            select: {
                subjects: {
                    where: {
                        title: { in: subjectsTitle }
                    },
                    select: { subjectId: true }
                }
            }
        });
    
        if (!subjects || subjects.subjects.length === 0) {
            return [];
        }
    
        await this.teacherModel.update({
            where: { teacherId },
            data: {
                subjects: {
                    disconnect: subjects.subjects.map(subject => ({ subjectId: subject.subjectId }))
                }
            }
        });
    
        const updatedSubjects = await this.teacherModel.findFirst({
            where: { teacherId },
            select: { subjects: true }
        });
    
        return updatedSubjects.subjects;
    }
    


    public async findSubjectsByTeacherId(teacherId: number): Promise<Subject[]> {
        const teacherOnSubjects = await this.teacherModel.findFirst({
            where: {
                teacherId
            },
            select: {
                subjects: true
            }
        })
        return teacherOnSubjects.subjects
    }
}