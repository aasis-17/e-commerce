import { User } from "../Models"
import { asyncHandler, ApiError, ApiResponse} from "../Utils"

const signup = asyncHandler(async (req, res) => {
    try {
        const {fullname, lastname, email, username, gender, role } = req.body

        if([fullname, lastname, email, username, gender, role].some(field => field?.trim() === "")){
            return res.status(400).json(new ApiError(400, "All fields are required!!"))
        }
    
        const existingUser = await User.findOne({email})

        if(existingUser){
            throw new ApiError(400, "User already exists!!")
        }

        const userAvatarLocalPath = req.file?.userAvatar[0].path

        //in production we save this file in third party server which returns its public-path 
        //and we save that in database

        


    } catch (error) {
        
    }


})