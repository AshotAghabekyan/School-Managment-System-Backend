import type { Subject } from "../../subject/interface/subject.interface.ts";
import type { PublicAccount } from "../../account/interface/account.interface.ts";




export interface Pupil {
    pupilId: number;
    accountId: number;
    account: PublicAccount,
    subjects: PupilSubject[]
}




export interface PupilSubject {
    grade: number;
    subject: Subject;
}

