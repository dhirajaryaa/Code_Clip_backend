export const AsyncHandler = (requitedFunc) => (
    (req, res, next) => {
        Promise.resolve(requitedFunc(req, res, next)).catch((err) => next(err));
    }
)