

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


export interface CreateAccountDto {
    firstname: string;
    lastname: string;
    email: string;
    age: number;
    password: string
}


export interface UpdateAccountDto {
    firstname?: string;
    lastname?: string;
    email?: string;
    age?: number;
}


