

interface ICreateBookDto {
    title: string;
    author: string;
}


class ValidationError extends Error {
    constructor(message: string) {
        super(message);
    }
}


interface ValidatorPipe {
    validate(): boolean
}


class DtoEntity<T = any> {
    value: T;
    constructor(value: T) {
        this.value = value;
    }

    public isString() {
        return this;
    };

    public isEmail() {
        return this;
    };

    public isNumber() {
        const isNan = !Number.isNaN(+this.value)
        if (typeof this.value != "number" || isNan) {
            throw new ValidationError(`value: ${this.value} not a number`)
        }
        return this;
    };

    public minLength(minLength: number) {
        if (typeof this.value == "number") {
            let valCopy = this.value;
        }
    };

    public maxLength(maxLength: number) {
        return this
    };
}


class BookValidator implements ValidatorPipe {
    title: DtoEntity<string>;
    author: DtoEntity<string>;
    id: DtoEntity<number>;

    constructor(dto: ICreateBookDto) {
        this.author = new DtoEntity(dto.author);
        this.title = new DtoEntity(dto.title);
    }


    validate(): boolean {
        this.author.isNumber().isEmail()
        this.title.isString().maxLength(30).minLength(5)
        return true;
    }
}


const validator = new BookValidator({title: 'Ashot book', author: 'Asshot'});
const isValid = validator.validate()
console.log(isValid);