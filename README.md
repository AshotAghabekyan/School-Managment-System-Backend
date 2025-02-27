
# SCHOOL MANAGMENT SYSTEM 


## HOW TO USE
  ### 1. Run `npm install` Command in CLI 
  ### 2. Setup `.env` file by `.env.example` template
  ### 3. Run `npm run dev` 
  ### 4. Go the `http://localhost:[YOUR-HTTP-PORT]/






## SCHEMAS | MODELS | INTERFACES

  ### API (Generic Type)
        model ApiResponse<T> {
            data: T | T[];
            message?: string;
            status: number;
            success: boolean
        }



  ### ACCOUNT 
        enum Role = 'GUEST' | 'PUPIL' | 'TEACHER' | 'ADMIN'

        model Account {
            accountId: number;
            firstname: string;
            lastname: string;
            email: string;
            age: number;
            role: Role;
            password: string;
        }

        model PublicAccount {
            accountId?: number;
            firstname?: string;
            lastname?: string;
            email?: string;
            age?: number;
        }

        model ICreateAccountDto {
            firstname: string;
            lastname: string;
            email: string;
            age: number;
            password: string
        }

        model IUpdateAccountDto {
            firstname?: string;
            lastname?: string;
            email?: string;
            age?: number;
        }

   

   ### AUTHENTICATION 
        model SignInDto {
            email: string;
            password: string
        }

        model JwtPayload {
            email: string;
            accountId: number;
        }

        model JwtToken {
            token: string
        }



   ### SUBJECT  
        enum SubjectType = "Math" | "History" | "Geography" | "English" | "Computer Science" | "Art";

        model Subject {
            title: SubjectType;
            subjectId: number;
        }

        model ICreateSubjectDto {
            title: SubjectType;
        }
   


   ### TEACHER 
        model Teacher {
            teacherId: number;
            accountId: number;
            subjects: Subject[];
            account: PublicAccount
        }

        model ICreateTeacherDto {
            accountId: number;
            email: string;
            subjects: SubjectType[];
        }

        model IUpdateTeacherDto {
            subjects: SubjectType[];
        }



   ### PUPIL
        model Pupil {
            pupilId: number;
            accountId: number;
            account: PublicAccount,
            subjects: PupilSubject[] 
        }

        model PupilSubject {
            grade: number;
            subject: Subject
        }

        model ICreatePupilDto {
            email: string;
        }







## API
  ## ROOT API

///////////////////////////////////////////
  ### ROOT ENDPOINT(`/`)
    Response {
        status: 200
        body: "response from server"
    }



///////////////////////////////////////////
  ## Account API(`/accounts`)
   ### ENDPOINT GET `/` 
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status: 200
            body : ApiResponse<PublicAccount[]>
        }
    

   ### ENDPOINT POST `/`
        Request {
            body: ICreateAccountDto
        }

        Response {
            status: 201
            body: ApiResponse<PublicAccount>
        }


   
   ### ENDPOINT GET `/:accountId`
        Request {
            Param: [accountId]: number
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        } 

        Response {
            status: 200
            body: ApiResponse<PublicAccount>
        }


   ### ENDPOINT GET `/account/currentAccount`
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status: 200
            body: ApiResponse<PublicAccount>
        }

    
   ### ENDPOINT PUT `/account/:accountId`
        Request {
            Param: [accountId]
            Body: IUpdateAccountDto
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status: 200
            body: ApiResponse<PublicAccount>
        } 



   ### ENDPOINT DELETE `/account/:accountId` 
        Request {
            Param: [accountId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status: 200
            body: ApiResponse<PublicAccount>
        }





///////////////////////////////////////////
  ## AUTHENTICATION API `/auth`
   ### ENDPOINT POST `/`
        Request {
            Body SignInDto
        }

        Response {
            status: 200
            body: JwtToken
        }






///////////////////////////////////////////
  ## SUBJECT API `/subjects`
   ### ENDPOINT GET `/`
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status: 200
            body: ApiResponse<Subject[]>
        }


   ### ENDPOINT DELETE `/:subjectId`
        Request {
            Param: [subjectId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status: 200
            body: ApiResponse<Subject>
        }


   ### ENDPOINT POST `/`
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
            Body: ICreateSubjectDto
        }

        Response {
            status: 201
            body: ApiResponse<Subject>
        }





///////////////////////////////////////////
  ## API TEACHER `/teachers`
   ### ENDPOINT GET `/`
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status: 200
            body: ApiResponse<Teacher[]>
        }



   ### ENDPOINT GET `/:teacherId`
        Request {
            Param: [teacherId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Teacher>
        }


   ### ENDPOINT GET `/pubAccount/:accountId`
        Request {
            Param: [accountId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Teacher>
        }


   ### ENDPOINT POST `/`
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
            Body: ICreateTeacherDto
        }

        Response {
            status: 201
            body: ApiResponse<Teacher>
        }



   ### ENDPOINT DELETE `/:teacherId`
        Request {
            Param: [teacherId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
            Body: ICreateTeacherDto
        }

        Response {
            status: 200
            body: ApiResponse<Partial<Teacher>>
        }




   ### ENDPOINT GET `/:teacherId/subjects`
        Request {
            Param: [teacherId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Subject[]>
        }



   ### ENDPOINT POST `/:teacherId/subjects`
        Request {
            Param: [teacherId]
            Body: {subject: String}
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:201
            body: ApiResponse<Subject[]>
        }



   ### ENDPOINT DELETE `/:teacherId/subjects/:subject`
        Request {
            Param: [teacherId, subject]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Subject[]>
        }






///////////////////////////////////////////
  ## PUPIL API `/pupils`
   ### ENDPOINT GET `/`
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Pupil[]>
        }


   ### ENDPOINT GET `/:pupilId`
        Request {
            Param: [pupilId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Pupil>
        }



   ### ENDPOINT GET `/pubAccount/:accountId`
        Request {
            Param: [accountId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Pupil>
        }



   ### ENDPOINT POST `/`
        Request {
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
            Body: ICreatePupilDto
        }

        Response {
            status:201
            body: ApiResponse<Pupil>
        }


   ### ENDPOINT DELETE `/:pupilId`
        Request {
            Param: [pupilId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Pupil>
        }



   ### ENDPOINT GET `/:pupilId/subjects`
        Request {
            Param: [pupilId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<PupilSubject[]>
        }



   ### ENDPOINT POST `/:pupilId/subjects`
        Request {
            Param: [pupilId]
            Body: SubjectType | SubjectType[]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:201
            body: ApiResponse<Subject[]>
        }




   ### ENDPOINT PUT `/:pupilId/subjects/:subjectId/grade`
        Request {
            Param: [pupilId, subjectId]
            Body: {grade: Number}
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<PupilSubject[]>
        }



   ### ENDPOINT DELETE `/:pupilId/subjects/:subjectId/`
        Request {
            Param: [pupilId, subjectId]
            Headers: {
                Authorization: `Bearer [JWT_TOKEN]`
            }
        }

        Response {
            status:200
            body: ApiResponse<Subject[]>
        }



////////////////###### THANKS ######///////////////////////////
    


