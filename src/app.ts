import type {Express, Request, Response} from "express";
import express from "express";
import cors from "cors";
import httpConfig from "./configuration/config.http.ts"
import accountRouter from "./modules/account/account.route.ts"
import teacherRouter from "./modules/teacher/teacher.route.ts"
import subjectRouter from "./modules/subject/subject.route.ts"
import pupilRouter from "./modules/pupil/pupil.route.ts"
import { errorHandler } from "./middleware/errorHandler.middleware.ts";
import { AuthGuard } from "./modules/global/auth/auth.guard.ts";


const app: Express = express();
const guard = new AuthGuard();

app.use(express.json());
app.use(cors())
app.use("/accounts", accountRouter);

app.use(guard.checkJwt)
app.use('/teachers', teacherRouter);
app.use("/subjects", subjectRouter);
app.use('/pupils', pupilRouter);


app.get("/", (req: Request, res: Response) => {
    res.status(200);
    res.write('response from server');
    res.end();
})
app.use(errorHandler);

app.listen(httpConfig.port, () => console.log('server running'));