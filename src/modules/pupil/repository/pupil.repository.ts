import { PupilModel, PupilSubjectModel } from "../../../prisma/prisma.provider.ts";
import {Prisma} from "@prisma/client";
import type { Pupil, PupilOnSubject, SubjectGrade } from "../interface/pupil.interface.ts";
import type { Subject } from "../../subject/interface/subject.interface.ts";



export interface IPupilRepository {
    findPupils(): Promise<Pupil[]>;
    findPupilById(pupilId: number): Promise<Pupil>;
    createPupil(pupilAccountId: number): Promise<Pupil>;
    deletePupil(pupilId: number): Promise<Partial<Pupil>>;
    findPupilByAccountId(accountId: number): Promise<Pupil>;
}


export interface IPupilSubjectRepository {
    getPupilSubjects(pupilId: number): Promise<SubjectGrade[]>
    assignSubjectsToPupil(pupilId: number, subjects: Subject[]): Promise<Subject[]>
    setSubjectGrade(pupilId: number, subjectId: number, grade: number): Promise<SubjectGrade>
    removeSubjectFromPupil(pupilId: number, subjectId: number): Promise<Subject[]>
}





export class PrismaPupilRepository implements IPupilRepository {
    private pupilModel: Prisma.PupilDelegate;

    constructor() {
        this.pupilModel = new PupilModel().getModel();
    }

    public async findPupils(): Promise<Pupil[]> {
        const pupils: Pupil[] = await this.pupilModel.findMany({
            include: {
                account: {
                    select: {
                        accountId: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    }
                },
                pupilSubjects: {select: {subject: true}}
            }
        });
        return pupils;
    }

    public async findPupilById(pupilId: number): Promise<Pupil> {
        const pupil = await this.findPupilByField('pupilId', pupilId);
        return pupil;
    }

    public async findPupilByAccountId(accountId: number): Promise<Pupil> {
        const pupil = await this.findPupilByField('accountId', accountId);
        return pupil;
    }

    public async createPupil(pupilAccountId: number): Promise<Pupil> {
        const createdPupil: Pupil = await this.pupilModel.create({
            data: {
                accountId: pupilAccountId,
            },
            include: {
                account: {
                    select: {
                        accountId: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    }
                },
                pupilSubjects: {select: {subject: true}}
            }
        });
        return createdPupil;
    }


    public async deletePupil(pupilId: number): Promise<Partial<Pupil>> {
        const deletedPupil: Partial<Pupil> = await this.pupilModel.delete({
            where: {
                pupilId,
            }
        });
        return deletedPupil;
    }


    private async findPupilByField(field: string, value: number | string): Promise<Pupil> {
        const pupil: Pupil = await this.pupilModel.findFirst({
            where: {
                [field]: value,
            },
            include: {
                account: {
                    select: {
                        accountId: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    }
                },
                pupilSubjects: {
                    select: {
                        subject: true
                    }
                }
            }
        });
        return pupil;
    }
}





export class PrismaPupilSubjectRepository implements IPupilSubjectRepository {
    private pupilSubjectModel: Prisma.PupilOnSubjectDelegate;

    constructor() {
        this.pupilSubjectModel = new PupilSubjectModel().getModel();
    }

    public async getPupilSubjects(pupilId: number): Promise<SubjectGrade[]> {
        const pupilSubjects: SubjectGrade[] = await this.pupilSubjectModel.findMany({
            where: {
                pupilId,
            },
            select: {
                grade: true,
                subject: true,
            }
        });
        return pupilSubjects
    }

    public async assignSubjectsToPupil(pupilId: number, subjects: Subject[]): Promise<Subject[]> {
        await this.pupilSubjectModel.createMany({
            skipDuplicates: true,
            data: subjects.map((subject: Subject) => ({
                subjectId: subject.subjectId,
                pupilId,
                grade: 0,
            })),
        });

        const updatedPupilSubjects: Partial<PupilOnSubject>[] = await this.pupilSubjectModel.findMany({
            where: { pupilId },
            select: {
                grade: true,
                subject: true,
            }
        }); 
        return updatedPupilSubjects.map((p_on_sub) => {
            return p_on_sub.subject
        });
    }


    public async setSubjectGrade(pupilId: number, subjectId: number, grade: number): Promise<SubjectGrade> {
        const targetSubject = await this.pupilSubjectModel.findFirst({
            where: {
                pupilId,
                subjectId,
            },
            select: {
                id: true
            }
        });

        const updatedSubject = await this.pupilSubjectModel.update({
            where: {
                pupilId,
                subjectId,
                id: targetSubject.id
            },
            data: {
                grade
            },
            select: {
                grade: true,
                subject: true,
            }
        });
        return updatedSubject;
    }



    public async removeSubjectFromPupil(pupilId: number, subjectId: number): Promise<Subject[]> {
        await this.pupilSubjectModel.findFirst({
            where: {
                pupilId,
                subjectId,
            },
            select: {
                id: true,
            }
        });


        const pupilOnSubject = await this.pupilSubjectModel.findMany({
            where: {
                pupilId,
                subjectId,
            },
            select: {
                subject: true,
            }
        })
        return pupilOnSubject.map((p_on_sub) => {
           return p_on_sub.subject
        })
    }
}