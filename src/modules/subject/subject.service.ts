import type { Subject, SubjectType } from "./interface/subject.interface.ts";
import type { ICreateSubjectDto } from "./dto/subject.dto.ts";
import { type ISubjectRepository, PrismaSubjectRepository } from "./repository/subject.repository.ts";
import { BadRequestException } from "../../exception/bad-request.exception.ts";
import { NotFoundException } from "../../exception/not-found.exception.ts";





export class SubjectService {
    private repository: ISubjectRepository;
    constructor() {
        this.repository = new PrismaSubjectRepository();
    }

    public async createSubject(subjectDto: ICreateSubjectDto): Promise<Subject> {
        const createdSubject = await this.repository.createSubject(subjectDto);
        if (!createdSubject) {
            throw new BadRequestException("Failed to create subject");
        }
        return createdSubject;
    }

    public async deleteSubject(subjectTitle: SubjectType): Promise<Subject> {
        const deletedSubject = await this.repository.deleteSubject(subjectTitle);
        if (!deletedSubject) {
            throw new BadRequestException("Failed to delete subject");
        }
        return deletedSubject;
    }

    public async findSubjects(): Promise<Subject[]> {
        const subjects = await this.repository.findSubjects();
        if (!subjects.length) {
            throw new NotFoundException("No subjects found");
        }
        return subjects;
    }


    public async bulkFindSubjectsByTitle(subjectsTitles: string[]): Promise<Subject[]>  {
        let subjects = await this.repository.bulkFindSubjectsByTitle(subjectsTitles);
        if (!subjects.length) {
            throw new NotFoundException("Failed to fetch subjects by titles");
        }
        subjects = subjects.filter((subject: Subject) => subject != null);
        return subjects;
    }


    public async findSubjectByTitle(string: string): Promise<Subject> {
        const subject: Subject = await this.repository.findSubjectByTitle(string);
        if (!subject) {
            throw new NotFoundException("No subject found");
        }
        return subject;
    }
}
