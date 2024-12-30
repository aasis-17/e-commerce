
export const asyncHandler = (handleRequest) => {
    return (req, res, next) => {
        Promise.resolve(handleRequest(req, res, next))
        .catch(error => next(error))
    }
}

