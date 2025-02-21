import type { Subject } from "../../subject/interface/subject.interface.ts";
import type { PublicAccount } from "../../account/interface/account.interface.ts";




export interface Pupil {
    pupilId: number;
    accountId: number;
    account: PublicAccount,
    pupilSubjects: {
        subject: Subject
    }[]
}


export interface PupilOnSubject {
    id: number;
    pupilId: number;
    accountId: number;
    grade: number;
    subject: Subject
    pupil: Pupil
    
}


export interface createPupilDto {
    email: string;
}