import { SubjectModel } from "../../../prisma/prisma.provider.ts";
import type { ICreateSubjectDto } from "../dto/subject.dto.ts";
import type { Subject, SubjectType } from "../interface/subject.interface.ts";
import { Prisma } from "@prisma/client";



export interface ISubjectRepository {
    createSubject(subjectDto: ICreateSubjectDto): Promise<Subject>;
    findSubjects(): Promise<Subject[]>
    deleteSubject(subjectTitle: SubjectType): Promise<Subject>;   
    bulkFindSubjectsByTitle(subjectsTitles: string[]): Promise<Subject[]> 
    findSubjectByTitle(string: string): Promise<Subject>
}




export class PrismaSubjectRepository implements ISubjectRepository {
    private subjectModel: Prisma.SubjectDelegate;
    constructor() {
        this.subjectModel = new SubjectModel().getModel();
    }

    public async createSubject(subjectDto: ICreateSubjectDto): Promise<Subject> {
        const createdSubject: Subject = await this.subjectModel.create({
            data: {
                title: subjectDto.title
            }
        })
        return createdSubject;
    }


    public async findSubjects(): Promise<Subject[]> {
        const allSubjects: Subject[] = await this.subjectModel.findMany();
        return allSubjects;
    }



    public async deleteSubject(subjectTitle: SubjectType): Promise<Subject> {
        const deletedSubject: Subject = await this.subjectModel.delete({
            where: {
                title: subjectTitle
            }
        })
        return deletedSubject;
    }



    public async findSubjectByTitle(title: string): Promise<Subject> {
        const targetSubject: Subject = await this.subjectModel.findFirst({
            where: {
                title
            }
        })
        return targetSubject;
    }


    public async bulkFindSubjectsByTitle(subjectsTitles: string[]): Promise<Subject[]> {
        const promiseSubjects: Promise<Subject>[] = [];

        subjectsTitles.map(async (subjectTitle: string) => {
            const promiseSubject: Promise<Subject> = this.findSubjectByTitle(subjectTitle);
            promiseSubjects.push(promiseSubject);
        })

        const subjects: Subject[] = await Promise.all(promiseSubjects);
        return subjects;
    }


}