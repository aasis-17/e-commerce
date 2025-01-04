import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            trim : true,
            lowercase : true
        },
        lastName : {
            type : String,
            required : true,
            trim : true,
            lowercase : true
        },
        username : {
            type : String,
            required : true,
            trim : true,
            lowercase : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
        },
        password : {
            type : String,
            required : true,       
        },
        address : {
            type : String,
        },
        userAvatar : {
            type : String
        },
        userAvatarPublicId : {
            type : String
        },
        gender : {
            type : String,
            enum : ["male, female"]
        },
        contactNo : {
            type : Number,
        },
        userCart : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Cart"
        }],
        role : {
            type : String,
            enum : ["customer", "admin"],
            default : "customer"
        },
        refreshToken : {
            type : String,
        }

    },{timeStamps : true}


)

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_Expiry
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)