

export type SubjectType = "Math" | "History" | "Geography" | "English" | "Computer Science" | "Art" | string


export interface Subject {
    title: SubjectType;
    subjectId: number;
}