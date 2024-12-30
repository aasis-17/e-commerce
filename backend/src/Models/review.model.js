import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
    {
        rating : {
            type : Number,
        },
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        },
        message : {
            type : String,
        },
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    }
)

export const Review = mongoose.model("Review", reviewSchema)