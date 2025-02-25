import { PupilModel, PupilSubjectModel } from "../../../prisma/prisma.provider.ts";
import {Prisma} from "@prisma/client";
import type { Pupil, PupilSubject } from "../interface/pupil.interface.ts";
import type { Subject } from "../../subject/interface/subject.interface.ts";



export interface IPupilRepository {
    findPupils(): Promise<Pupil[]>;
    findPupilById(pupilId: number): Promise<Pupil>;
    createPupil(pupilAccountId: number): Promise<Pupil>;
    deletePupil(pupilId: number): Promise<Partial<Pupil>>;
    findPupilByAccountId(accountId: number): Promise<Pupil>;
}


export interface IPupilSubjectRepository {
    getPupilSubjects(pupilId: number): Promise<PupilSubject[]>
    assignSubjectsToPupil(pupilId: number, subjects: Subject[]): Promise<Subject[]>
    setSubjectGrade(pupilId: number, subjectId: number, grade: number): Promise<PupilSubject>
    removeSubjectFromPupil(pupilId: number, subjectId: number): Promise<Subject[]>
}





export class PrismaPupilRepository implements IPupilRepository {
    private pupilModel: Prisma.PupilDelegate;

    constructor() {
        this.pupilModel = new PupilModel().getModel();
    }

    public async findPupils(): Promise<Pupil[]> {
        const pupils = await this.pupilModel.findMany({
            include: {
                account: {
                    select: {
                        accountId: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    }
                },
                subjects: {
                    select: {
                        subject: true,
                        grade: true
                    }
                },
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
                    omit: {password: true, createdAt: true}
                },
                subjects: {
                    select: {
                        subject: true,
                        grade: true,
                    }
                }
            }
        });
        return createdPupil;
    }


    public async deletePupil(pupilId: number): Promise<{}> {
        const deletedPupil = await this.pupilModel.delete({
            where: {
                pupilId,
            }
        });
        return {deletedPupilId: deletedPupil.pupilId};
    }


    private async findPupilByField(field: string, value: number | string): Promise<Pupil> {
        const pupil: Pupil = await this.pupilModel.findFirst({
            where: {
                [field]: value,
            },
            include: {
                account: {
                    omit: {password: true, createdAt: true}
                },
                subjects: {
                    select: {
                        grade: true,
                        subject: true,
                    }
                }
            }
        });
        return pupil;
    }
}





export class PrismaPupilSubjectRepository implements IPupilSubjectRepository {
    private pupilSubjectModel: Prisma.PupilSubjectDelegate;

    constructor() {
        this.pupilSubjectModel = new PupilSubjectModel().getModel();
    }

    public async getPupilSubjects(pupilId: number): Promise<PupilSubject[]> {
        const pupilSubjects: PupilSubject[] = await this.pupilSubjectModel.findMany({
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

        const updatedPupilSubjects = await this.pupilSubjectModel.findMany({
            where: { pupilId },
            select: {
                subject: true
            }
        }); 
        return updatedPupilSubjects.map((p_on_sub: PupilSubject) => {
            return p_on_sub.subject
        })
    }


    public async setSubjectGrade(pupilId: number, subjectId: number, grade: number): Promise<PupilSubject> {
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


        const PupilSubject: PupilSubject[] = await this.pupilSubjectModel.findMany({
            where: {
                pupilId,
                subjectId,
            },
            select: {
                subject: true,
                grade: true
            }
        })
        return PupilSubject.map((p_on_sub: PupilSubject) => {
           return p_on_sub.subject
        })
    }
}