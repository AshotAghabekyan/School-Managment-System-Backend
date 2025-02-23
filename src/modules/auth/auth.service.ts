import jwt from 'jsonwebtoken';
import { AccountService } from '../account/account.service.ts';
import { CryptoHasher } from '../global/cryptoHasher/cryptoHasher.ts';
import { UnauthorizedException } from '../../exception/unauthorized.exception.ts';
import { InternalServerErrorException } from '../../exception/internal-server-error.exception.ts';

import type { SignInDto, JwtPayload, JwtToken } from './interface/auth.interface.ts';
import type { Account } from '../account/interface/account.interface.ts';

import configJwt from '../../configuration/config.jwt.ts';



export class AuthService {
    private jwtSecret: string = configJwt.jwtSecret
    private accountService: AccountService
  
    constructor() {
        this.accountService = new AccountService();
    }

    public generateToken(payload: { accountId: number; email: string }): JwtToken {
        const token: string = jwt.sign(payload, this.jwtSecret, {"expiresIn": "1d"});
        return {token};
    }


    public verifyToken(token: string): JwtPayload {
        try {
            const payload: JwtPayload = jwt.verify(token, this.jwtSecret) as JwtPayload;
            return payload
        } 
        catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    public async authenticate(dto: SignInDto): Promise<JwtToken> {
        const account: Account = await this.accountService.getAccountWithPrivateData(dto.email);
        if (!account) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const hasher = new CryptoHasher();
        const isPasswordValid = hasher.verify(dto.password, account.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return this.generateToken({ accountId: account.accountId, email: account.email });
    }
}