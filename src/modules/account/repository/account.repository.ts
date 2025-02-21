import type { CreateAccountDto, UpdateAccountDto, Account } from "../interface/account.interface.ts"
import { Prisma } from "@prisma/client";
import { AccountModel } from "../../../prisma/prisma.provider.ts";



export interface IAccountRepository {
    createAccount(accountDto: CreateAccountDto): Promise<Account>;
    updateAccount(updateAccountDto: UpdateAccountDto, account_id: number): Promise<Account>;
    deleteAccount(accountId: number): Promise<Account>
    findAccountByEmail(email: string): Promise<Account>
    findAccountById(accountId: number): Promise<Account>
    findAccounts(): Promise<Account[]>
}


export class PrismaAccountRepository implements IAccountRepository {
    private accountModel: Prisma.AccountDelegate;
    constructor() {
        this.accountModel = new AccountModel().getModel();
    }


    public async createAccount(accountDto: CreateAccountDto): Promise<Account> {
        const account = await this.accountModel.create({
            data: {...accountDto}
        })
        return account;
    }


    public async deleteAccount(accountId: number): Promise<Account> {
        const deletedAccount = await this.accountModel.delete({where: {"accountId": accountId}})
        return deletedAccount;
    }

    public async updateAccount(updateAccountDto: UpdateAccountDto, accountId: number): Promise<Account> {
        const updatedAccount = await this.accountModel.update({
            where: {accountId: accountId},
            "data": updateAccountDto
        })
        return updatedAccount
    }


    public async findAccountByEmail(email: string): Promise<Account> {
        const account: Account = await this.findAccountByField('email', email);
        return account;
    }


    public async findAccountById(accountId: number): Promise<Account> {
        const account: Account = await this.findAccountByField('accountId', accountId);
        return account;
    }


    private async findAccountByField(field: string, value: number | string) {
        const account: Account = await this.accountModel.findFirst({
            where: {[field]: value},
        });
        return account;
    }


    public async findAccounts(): Promise<Account[]> {
        const accounts: Account[] = await this.accountModel.findMany();
        return accounts || [];
    }
}