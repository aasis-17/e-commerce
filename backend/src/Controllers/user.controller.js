import { User } from "../Models/index.js"
import { asyncHandler, ApiError, ApiResponse} from "../Utils/index.js"
import { removeFileFromCloudinary, uploadFileOnCloudinary } from "../Utils/fileHandler.js"
import { isValidObjectId } from "mongoose"

const signup = asyncHandler(async (req, res) => {

        const {firstName, lastName,password, email, username, gender, role } = req.body
        console.log(req.body)

        const userAvatarLocalPath = req.file.path
        console.log(userAvatarLocalPath)

        if([firstName, lastName, email, username,password, gender, role].some(field => field?.trim() === "")){
            throw new ApiError(400, "All fields are required!!")
        }
    
        const existingUser = await User.findOne({email})

        if(existingUser){
            throw new ApiError(400, "User already exists!!")
        }

        const userAvatarLocalFilePath = req.file?.path
        console.log(userAvatarLocalFilePath)

        //in production we save this file in third party server which returns its public-path 
        //and we save that in database

        const userAvatar = await uploadFileOnCloudinary(userAvatarLocalPath, "image")

        if(!userAvatar){
            throw new ApiError(500, "Something went wrong on cloudinary server!")
        }
        
        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            password,
            role,
            gender,
            userAvatar : userAvatarLocalPath.url || "",
            userAvatarPublicId : userAvatarLocalPath.public_id || ""
        })

        if(!user){
            throw new ApiError(500, "Something went wrong while registering user!")
        }

        return res.status(201).json(new ApiResponse(201, user, "User registered successfully!!"))

})

const login = asyncHandler(async(req, res) => {

    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "field missing!!")
    }

    const existingUser = await User.findOne({
        email
       // $or : [{email}, {contactNo : email}]
    })

    if(!existingUser) throw new ApiError(400, "User doesnot exists!!")

    const isPasswordCorrect = await existingUser.verifyPassword(password)

    if(!isPasswordCorrect) throw new ApiError(400, "Email or password doesnot match!!")

    const accessToken = await existingUser.generateAccessToken()
    const refreshToken = await existingUser.generateRefreshToken()

    if(!accessToken || !refreshToken){
        throw new ApiError(500, "Server error while creating token!!")
    }
    existingUser.refreshToken = refreshToken
    await existingUser.save({validateBeforeSave : false})

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : "none"       
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {accessToken, refreshToken}, "User Logged in successfully!!"))

})

const logout = asyncHandler(async(req, res) => {

    const user = await User.findByIdAndUpdate(req.user._id, {
        $unset : {
            refreshToken : 1
        }
    },{ new : true })

    const options = {
        httpOnly : true,
        sameSite : "none",
        secure : true

    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!!"))

})

const updateUserPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    if(!newPassword || !oldPassword) throw new ApiError(400, "Password missing!!")

    const existingUser = await User.findByIdAndUpdate(req.user._id)

    if(!existingUser) throw new ApiError(404, "User not found!!")
    
    const verifyOldPassword = await existingUser.verifyPassword(oldPassword)

    if(!verifyOldPassword) throw new ApiError(400, "Invalid old password!!")

    existingUser.password = newPassword
    await existingUser.save({validateBeforeSave : false})

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully!!"))
    
})

const updateUserDetails = asyncHandler(async(req, res) => {

    const {firstName, lastName, username, contactNo, address, gender} = req.body

    if([firstName, lastName, username, contactNo, gender].some(field => field?.trim() === "")){
        throw new ApiError(400, "Fields missing!!")
    }

    const existingUser = await User.findByIdAndUpdate(req.user._id,{
        $set : {
            firstName,
            lastName,
            username,
            contactNo,
            gender,
            address : address || ""
        }, 
    },{ new : true })

    if(!existingUser) throw new ApiError(500, "Server error!!")
    
    return res.status(200).json(new ApiResponse(200, existingUser, "User details updated successfully!!"))
})

const updateUserAvatar = asyncHandler(async(req, res) => {

    const userAvatarlocalFilePath = req.file?.path

    if(!localFilePath) throw new ApiError(400, "File missing!!")
    
    const removeExistingFile = await removeFileFromCloudinary(req.user?.userAvatarPublicId)
    
    if(!removeExistingFile) throw new ApiError(500, "problem while removing file from cloudinary!!")
    
    const newUserAvatar = await uploadFileOnCloudinary(userAvatarlocalFilePath, "image")

    if(!newUserAvatar) throw new ApiError(500, "problem while uploading file on cloudinary")

    const updatedUser = await User.findByIdAndUpdate(req.user._id,{
        $set : {
            userAvatar : newUserAvatar.url || "" ,
            userAvatarPublicId : newUserAvatar.public_id || ""
        }
    }, { new : true })

    return res.status(200).json(new ApiResponse(200, updatedUser, "User avatar updated successfully!!"))
})

const getUserById = asyncHandler(async(req, res) =>{
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId!!")
    }

    const user = await User.findById(userId).select("-password -refreshToken ")

    if(!user){
        throw new ApiError(404, "User doesnot exists!!")
    }

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully!!"))

})

const deactivateAccount = asyncHandler(async(req, res) => {
    // later
})

export {
    signup,
    login,
    logout,
    updateUserPassword, 
    updateUserDetails, 
    updateUserAvatar,
    getUserById,
    deactivateAccount
}