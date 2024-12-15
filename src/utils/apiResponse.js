export class ApiResponse {
    constructor(
        statusCode,
        data,
        message = "success",
        isSuccess = true,

    ) {
       
        this.statusCode = statusCode;
        this.data = data
        this.message = message;
        this.isSuccess = isSuccess;
    }


}

