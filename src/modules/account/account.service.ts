import type { CreateAccountDto,Account, PublicAccount, UpdateAccountDto } from "./interface/account.interface.ts";
import type { IAccountRepository } from "./repository/account.repository.ts";
import { PrismaAccountRepository } from "./repository/account.repository.ts";
import { CryptoHasher } from "../global/cryptoHasher/cryptoHasher.ts";
import { NotFoundException } from "../../exception/not-found.exception.ts";
import { BadRequestException } from "../../exception/bad-request.exception.ts";



export class AccountService {
    private repository: IAccountRepository

    constructor() {
        this.repository = new PrismaAccountRepository();
    }


    public async findAccounts(): Promise<PublicAccount[]> {
        const allAccounts: Account[] = await this.repository.findAccounts();
        if (!allAccounts.length) {
            throw new NotFoundException("account dont found")
        }
        allAccounts.map((account: Account) => delete account.password);
        return allAccounts;
    }


    public async findAccountById(accountId: number): Promise<PublicAccount> {
        const targetAccount: Account = await this.repository.findAccountById(+accountId);
        if (!targetAccount) {
            throw new NotFoundException("account dont found")
        }
        delete targetAccount.password;
        return targetAccount;
    }


    public async findAccountByEmail(email: string): Promise<PublicAccount> {
        const targetAccount: Account = await this.repository.findAccountByEmail(email);
        if (!targetAccount) {
            throw new NotFoundException("account dont found")
        }
        delete targetAccount.password;
        return targetAccount;
    }


    public async createAccount(accountDto: CreateAccountDto): Promise<PublicAccount> {
        const isAccountExist: Account = await this.repository.findAccountByEmail(accountDto.email);
        if (isAccountExist) {
            throw new BadRequestException('the account with that email already exist')
        }
        const hasher: CryptoHasher = new CryptoHasher();
        accountDto.password = hasher.hash(accountDto.password);
        const createdAccount: Account = await this.repository.createAccount(accountDto);
        delete createdAccount.password
        return createdAccount;
    }




    public async getAccountWithPrivateData(email: string) {
        const account: Account = await this.repository.findAccountByEmail(email);
        if (!account) {
            throw new NotFoundException("account dont exist")
        }
        return account;
    }





    public async updateAccount(updateAccountDto: UpdateAccountDto, account_id: number): Promise<PublicAccount> {
        const updatedAccount: Account = await this.repository.updateAccount(updateAccountDto, account_id);
        if (!updatedAccount) {
            throw new BadRequestException("the user's profile has not been updated");
        }
        delete updatedAccount.password
        return updatedAccount
    }

    public async deleteAccount(accountId: number): Promise<PublicAccount> {
        const deletedAccount: Account = await this.repository.deleteAccount(accountId);
        if (!deletedAccount) {
            throw new BadRequestException("The account has not been deleted")
        }
        delete deletedAccount.password;
        return deletedAccount
    }
} 