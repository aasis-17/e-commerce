
export const asyncHandler = (handleRequest) => {
    return (req, res, next) => {
        Promise.resolve(handleRequest(req, res, next))
        .catch(error => {   
            console.error(error)   
            return res.status(error.statusCode).json(error)
        })
    }  
    
}

