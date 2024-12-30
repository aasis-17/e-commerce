import mongoose from "mongoose"

const cartSchema = new mongoose.Schema(
    {
        user :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        item : {
            quantity : {
                type : Number,
                required : true
            },
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product",
                required : true
            },
            size : {
                type : String,
                required : true
            },
            color : {
                type : String,
                required : true
            }            
        }
    }
)

export const Cart = mongoose.model("Cart", cartSchema)