

export type Role = 'GUEST' | 'PUPIL' | 'TEACHER' | 'ADMIN'


export interface Account {
    accountId: number;
    firstname: string;
    lastname: string;
    email: string;
    age: number;
    role: Role;
    password: string;
}


export interface PublicAccount  {
    accountId?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    age?: number;
}


