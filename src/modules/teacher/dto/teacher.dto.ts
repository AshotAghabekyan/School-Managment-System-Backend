import { SubjectType } from "../../subject/interface/subject.interface.ts";


export interface ICreateTeacherDto {
    accountId: number;
    email: string;
    subjects: SubjectType[];
}


export interface IUpdateTeacherDto {
    subjects: SubjectType[];
}
