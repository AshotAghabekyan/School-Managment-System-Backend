


export class ApiResponse<T> {
    data: T | T[];
    message?: string;
    status: number;
    success: boolean

    constructor(data: T | T[], status: number, success: boolean, message?: string) {
        this.data = data;
        this.status = status;
        this.success = success;
        this.message = message;
    }

}