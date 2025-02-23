import type {Express, Request, Response} from "express";
import express from "express";
import cors from "cors";
import httpConfig from "./configuration/config.http.ts"
import authRouter from "./modules/global/auth/auth.route.ts"
import accountRouter from "./modules/account/account.route.ts"
import teacherRouter from "./modules/teacher/teacher.route.ts"
import subjectRouter from "./modules/subject/subject.route.ts"
import pupilRouter from "./modules/pupil/pupil.route.ts"
import { errorHandler } from "./middleware/exception-handler.middleware.ts";
import { AuthGuard } from "./modules/global/auth/auth.guard.ts";
import { RoleGuard } from "./middleware/role.auth-guard.ts";


const app: Express = express();
const authenticationGuard = new AuthGuard();
const authorizationGuard = new RoleGuard();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.status(200);
    res.write('response from server');
    res.end();
})

app.use("/auth", authRouter)
app.use("/accounts", accountRouter);

app.use(authenticationGuard.checkJwt)
app.use(authorizationGuard.checkRole(['ADMIN']))
app.use('/teachers', teacherRouter);
app.use("/subjects", subjectRouter);
app.use('/pupils', pupilRouter);



app.use(errorHandler);

app.listen(httpConfig.port, () => console.log('server running'));