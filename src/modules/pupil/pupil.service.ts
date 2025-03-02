import { BadRequestException } from "../../exception/bad-request.exception.ts";
import { NotFoundException } from "../../exception/not-found.exception.ts";
import { AccountService } from "../account/account.service.ts";
import type { PublicAccount } from "../account/interface/account.interface.ts";
import type { Pupil, PupilSubject } from "./interface/pupil.interface.ts";
import type { ICreatePupilDto } from "./dto/pupil.dto.ts";
import type { Subject, SubjectType } from "../subject/interface/subject.interface.ts";
import { PrismaPupilRepository, PrismaPupilSubjectRepository, type IPupilRepository, type IPupilSubjectRepository } from "./repository/pupil.repository.ts";
import { SubjectService } from "../subject/subject.service.ts";


export class PupilService {
    private pupilRepository: IPupilRepository;
    constructor() {
        this.pupilRepository = new PrismaPupilRepository()
    }


    public async createPupil(createPupilDto: ICreatePupilDto): Promise<Pupil> {
        const accountService: AccountService = new AccountService();
        const pupilProfile: PublicAccount = await accountService.findAccountByEmail(createPupilDto.email);
        const isPupilExist = await this.pupilRepository.findPupilByAccountId(pupilProfile.accountId);

        if (isPupilExist) {
            throw new BadRequestException("The pupil with this email already exist")
        }
        const createdPupil: Pupil = await this.pupilRepository.createPupil(pupilProfile.accountId);
        if (!createdPupil) {
            throw new BadRequestException("The pupil has not been created")
        }
        return createdPupil;
    };


    public async deletePupil(pupilId: number): Promise<Partial<Pupil>> {
        if (!this.isPupilExist(pupilId)) {
            throw new NotFoundException("The specified pupil ID does not exist")
        }

        const deletedPupil = await this.pupilRepository.deletePupil(pupilId);
        if (!deletedPupil) {
            throw new BadRequestException("The pupil has not been deleted");
        }
        return deletedPupil;
    };


    public async findPupils(): Promise<Pupil[]> {
        const pupils = await this.pupilRepository.findPupils();
        if (!pupils.length) {
            throw new NotFoundException("No pupils found")
        }
        return pupils;
    };

    public async findPupilById(pupilId: number): Promise<Pupil> {
        const targetPupil: Pupil = await this.pupilRepository.findPupilById(pupilId);
        if (!targetPupil) {
            throw new NotFoundException('No pupil found')
        }
        return targetPupil;
    }

    public async findPupilByAccountId(accountId: number): Promise<Pupil> {
        const targetPupil: Pupil = await this.pupilRepository.findPupilByAccountId(accountId);
        if (!targetPupil) {
            throw new NotFoundException("pupil with given accountId has not exist");
        }
        return targetPupil;
    }


    public async isPupilExist(pupilId: number): Promise<Pupil> {
        const pupil: Pupil = await this.findPupilById(pupilId);
        return pupil || null;
    }
};






export class PupilSubjectService {
    private pupilSubjectRepository: IPupilSubjectRepository;

    constructor() {
        this.pupilSubjectRepository = new PrismaPupilSubjectRepository();
    }

    public async assignSubjectsToPupil(pupilId: number, subjectTitles: SubjectType[]) {
        if (!pupilId || !subjectTitles.length) {
            throw new BadRequestException("Pupil ID and subjects are required");
        }
        const subjectService: SubjectService = new SubjectService();
        const subjectsToAdd: Subject[] = await subjectService.bulkFindSubjectsByTitle(subjectTitles);
        const pupilCurrSubjects = await this.getPupilSubjects(pupilId);
        const uniqueSubjects: Subject[] = subjectsToAdd.filter((subjectsToAdd: Subject) => {
            const isDublicate: boolean = pupilCurrSubjects.some((pupilSubject) => subjectsToAdd.subjectId == pupilSubject.subject.subjectId)
            return !isDublicate;
        })
        return await this.pupilSubjectRepository.assignSubjectsToPupil(pupilId, uniqueSubjects);
    }


    public async updatePupilGrade(pupilId: number, subjectId: number, grade: number): Promise<PupilSubject> {
        if (!pupilId || !subjectId || grade === undefined) {
            throw new BadRequestException("Pupil ID, Subject ID, and grade are required");
        }

        const updatedSubject = await this.pupilSubjectRepository.setSubjectGrade(pupilId, subjectId, grade);
        if (!updatedSubject) {
            throw new NotFoundException("Subject grade could not be updated");
        }

        return updatedSubject;
    }
    

    public async getPupilSubjects(pupilId: number): Promise<PupilSubject[]> {
        if (!pupilId) {
            throw new BadRequestException("Pupil ID is required");
        }

        const pupilSubjects = await this.pupilSubjectRepository.getPupilSubjects(pupilId);
        return pupilSubjects;
    }


    public async removeSubjectFromPupil(pupilId: number, subjectId: number): Promise<Subject[]> {
        if (!pupilId || !subjectId) {
            throw new BadRequestException("Pupil ID and Subject ID are required");
        }

        return await this.pupilSubjectRepository.removeSubjectFromPupil(pupilId, subjectId);
    }
}
