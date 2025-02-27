


export class Validator {
    public isString() {};
    public isEmail() {};
    public isNumber() {};
    public minLength() {};
    public maxLength() {};
}


export class SchemaValidator<T> {
    constructor(schema: T) {
        
    }
}



class BookValidator {
    constructor(book: Book) {
        
    }
}



class Book {
    title: string;
    author: string;
}

let book = new Book()





export class ValidationPipe {

}