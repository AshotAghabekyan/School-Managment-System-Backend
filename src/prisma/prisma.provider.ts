import { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";


export class PrismaProvider {
    private static instance: PrismaClient | null = null;

    protected constructor() {
        if (!PrismaProvider.instance) {
            PrismaProvider.instance = new PrismaClient()
        }
    }

    protected getPrismaClient(): PrismaClient {
        if (!PrismaProvider.instance) {
            throw new Error("PrismaClient is not initialized");
        }
        return PrismaProvider.instance;
    }
}




interface PrismaModelProvider {
    getModel(): Object
}




export class AccountModel extends PrismaProvider implements PrismaModelProvider {
    constructor() {
        super();
    }

    getModel(): Prisma.AccountDelegate<DefaultArgs, Prisma.PrismaClientOptions>  {
        const client = this.getPrismaClient();
        return client.account;
    }
}



export class TeacherModel extends PrismaProvider implements PrismaModelProvider {
    constructor() {
        super();
    }

    getModel(): Prisma.TeacherDelegate<DefaultArgs, Prisma.PrismaClientOptions> {
        const client = this.getPrismaClient();
        return client.teacher;
    }
}



export class SubjectModel extends PrismaProvider implements PrismaModelProvider {
    constructor() {
        super();
    }

    getModel(): Prisma.SubjectDelegate<DefaultArgs, Prisma.PrismaClientOptions> {
        const client = this.getPrismaClient();
        return client.subject;
    }
}




export class PupilModel extends PrismaProvider implements PrismaModelProvider {
    constructor() {
        super();
    }

    getModel(): Prisma.PupilDelegate<DefaultArgs, Prisma.PrismaClientOptions> {
        const client = this.getPrismaClient();
        return client.pupil;
    }
}




export class PupilSubjectModel extends PrismaProvider implements PrismaModelProvider {
    constructor() {
        super();
    }

    getModel(): Prisma.PupilSubjectDelegate<DefaultArgs, Prisma.PrismaClientOptions> {
        const client = this.getPrismaClient()
        return client.pupilSubject;
    }
}



