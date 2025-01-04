import { User } from "../Models/user.model.js";
import { ApiError, asyncHandler } from "../Utils/index.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res, next) => {

    const encodedAccessToken = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

    if(!encodedAccessToken){
        throw new ApiError(401, "Unauthorized request!!")
    }

    const decodeAccessToken =  jwt.verify(encodedAccessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if(error){
            console.log(error)
            throw new ApiError(401, "Unauthorized request!!")
        }else{
            return decoded
        }
    })

    const user = await User.findById(decodeAccessToken._id)

    if(!user){
        throw new ApiError(400,"Invalid token!!")
    }

    req.user = user
    next()
})

