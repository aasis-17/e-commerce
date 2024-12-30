import mongoose from "mongoose";
import bcrypt from "bcrypt"

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
            required : true
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
        }

    },{timeStamps : true}


)

userSchema.pre("save", async(next) => {
    if(!this.password.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.verifyPassword = async(password) => {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)