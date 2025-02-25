import type { Subject } from "../../subject/interface/subject.interface.ts";
import type { PublicAccount } from "../../account/interface/account.interface";



export interface Teacher {
    teacherId: number;
    accountId: number;
    subjects: Subject[]
    account: PublicAccount
}



