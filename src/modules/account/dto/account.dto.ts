
export interface ICreateAccountDto {
    firstname: string;
    lastname: string;
    email: string;
    age: number;
    password: string
}


export interface IUpdateAccountDto {
    firstname?: string;
    lastname?: string;
    email?: string;
    age?: number;
}

