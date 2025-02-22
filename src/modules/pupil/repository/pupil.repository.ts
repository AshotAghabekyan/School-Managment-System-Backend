import { PupilModel, PupilSubjectModel } from "../../../prisma/prisma.provider.ts";
import {Prisma} from "@prisma/client";
import type { Pupil, PupilOnSubject } from "../interface/pupil.interface.ts";
import type { Subject } from "../../subject/interface/subject.interface.ts";



export interface IPupilRepository {
    findPupils(): Promise<Partial<Pupil>[]>;
    findPupilById(pupilId: number): Promise<Partial<Pupil>>;
    createPupil(pupilAccountId: number): Promise<Partial<Pupil>>;
    deletePupil(pupilId: number): Promise<Partial<Pupil>>;
    findPupilByAccountId(accountId: number): Promise<Partial<Pupil>>;
}


export interface IPupilSubjectRepository {
    getPupilSubjects(pupilId: number): Promise<Partial<PupilOnSubject>[]>;
    assignSubjectsToPupil(pupilId: number, subjects: Subject[]): Promise<Partial<PupilOnSubject>[]>;
    setSubjectGrade(pupilId: number, subjectId: number, grade: number): Promise<Partial<PupilOnSubject>>;
    removeSubjectFromPupil(pupilId: number, subjectId: number): Promise<Partial<PupilOnSubject>[]>;
}





export class PrismaPupilRepository implements IPupilRepository {
    private pupilModel: Prisma.PupilDelegate;

    constructor() {
        this.pupilModel = new PupilModel().getModel();
    }

    public async findPupils(): Promise<Partial<Pupil>[]> {
        const pupils: Partial<Pupil>[] = await this.pupilModel.findMany({
            include: {
                account: {
                    select: {
                        accountId: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    }
                }
            }
        });
        return pupils;
    }

    public async findPupilById(pupilId: number): Promise<Partial<Pupil>> {
        const pupil = await this.findPupilByField('pupilId', pupilId);
        return pupil;
    }

    public async findPupilByAccountId(accountId: number): Promise<Partial<Pupil>> {
        const pupil = await this.findPupilByField('accountId', accountId);
        return pupil;
    }

    public async createPupil(pupilAccountId: number): Promise<Partial<Pupil>> {
        const createdPupil: Partial<Pupil> = await this.pupilModel.create({
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
                }
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


    private async findPupilByField(field: string, value: number | string): Promise<Partial<Pupil>> {
        const pupil: Partial<Pupil> = await this.pupilModel.findFirst({
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

    public async getPupilSubjects(pupilId: number): Promise<Partial<PupilOnSubject>[]> {
        const pupilSubjects: Partial<PupilOnSubject>[] = await this.pupilSubjectModel.findMany({
            where: {
                pupilId,
            },
            select: {
                grade: true,
                subject: true,
            }
        });
        return pupilSubjects;
    }

    public async assignSubjectsToPupil(pupilId: number, subjects: Subject[]): Promise<Partial<PupilOnSubject>[]> {
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
        return updatedPupilSubjects;
    }

    public async setSubjectGrade(pupilId: number, subjectId: number, grade: number): Promise<Partial<PupilOnSubject>> {
        const targetSubject = await this.pupilSubjectModel.findFirst({
            where: {
                pupilId,
                subjectId,
            },
            select: {
                id: true
            }
        });

        const updatedSubject: Partial<PupilOnSubject> = await this.pupilSubjectModel.update({
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

    public async removeSubjectFromPupil(pupilId: number, subjectId: number): Promise<Partial<PupilOnSubject>[]> {
        const pupilSubjectId = await this.pupilSubjectModel.findFirst({
            where: {
                pupilId,
                subjectId,
            },
            select: {
                id: true,
            }
        });

        return await this.getPupilSubjects(pupilId);;
    }
}