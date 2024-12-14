export class ApiResponse {
    constructor(
        message = "success",
        isSuccess = true,
        statusCode,
        data,

    ) {
        super(message);
        this.message = message;
        this.isSuccess = isSuccess;
        this.statusCode = statusCode;
        this.data = data
    }


}

