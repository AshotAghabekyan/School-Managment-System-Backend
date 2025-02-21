

export type SubjectType = "Math" | "History" | "Geography" | "English" | "Computer Science" | "Art" | string


export interface SubjectDto {
    title: SubjectType;
}


export interface Subject {
    title: string;
    subjectId: number;
}