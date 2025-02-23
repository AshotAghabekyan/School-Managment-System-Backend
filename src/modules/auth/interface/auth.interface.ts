


export interface SignInDto {
    email: string;
    password: string
}


export interface JwtPayload {
    email: string;
    accountId: number;
}


export interface JwtToken {
    token: string
}