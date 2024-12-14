export class ApiError extends Error {
    constructor(
        statusCode,
        message = "Smoothing went wrong!",
        data = null,
        isSuccess = false,
        errors = [],
        stack = [],

    ) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.data = data;
        this.isSuccess = isSuccess;
        this.errors = errors
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }

    }
}
