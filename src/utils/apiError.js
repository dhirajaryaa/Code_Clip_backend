export class ApiError extends Error {
    constructor(
        statusCode,
        data = null,
        message = "Smoothing went wrong!",
        isSuccess = false,
        errors = [],
        stack = [],

    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.message = message
        this.isSuccess = isSuccess;
        this.errors = errors
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }

    }
}
