import * as jwt from 'jsonwebtoken';
import { AccountService } from '../../account/account.service';
import { PublicAccount } from '../../account/interface/account.interface';
import { CryptoHasher } from '../cryptoHasher/cryptoHasher';
import { UnauthorizedException } from '../../../exception/unauthorized.exception';


export class AuthService {
    private jwtSecret: string = process.env.JWT_SECRET || 'your-secret-key';
    private accountService: AccountService
  
    constructor() {
        this.accountService = new AccountService();
    }

    public generateToken(payload: { accountId: number; email: string }): string {
        return jwt.sign(payload, this.jwtSecret, {"expiresIn": "1d"});
    }


    public verifyToken(token: string): { accountId: number; email: string } | null {
        try {
            return jwt.verify(token, this.jwtSecret) as { accountId: number; email: string };
        } 
        catch (error) {
            return null;
        }
    }


    public async authenticate(email: string, password: string): Promise<string | null> {
        const account = await this.accountService.getAccountWithPrivateData(email);
        if (!account) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const hasher = new CryptoHasher();
        const isPasswordValid = hasher.verify(password, account.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return this.generateToken({ accountId: account.accountId, email: account.email });
    }
}