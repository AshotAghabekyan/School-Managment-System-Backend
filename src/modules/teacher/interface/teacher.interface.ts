import type { Subject } from "../../subject/interface/subject.interface.ts";
import type { PublicAccount } from "../../account/interface/account.interface";
import type { SubjectType } from "../../subject/interface/subject.interface";



export interface Teacher {
    teacherId: number;
    accountId: number;
    teacherSubjects: {
        subject: Subject
    }[],
    account: PublicAccount
}


export interface TeacherOnSubject {
    id: number;
    teacherId: number;
    subjectId: number;
    subject: Subject;
    teacher: Teacher | Partial<Teacher>;
}


