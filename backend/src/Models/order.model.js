import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        items : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Cart"
        }],
        totalAmount : {
            type : Number,
            required : true
        },
        shippingAddress : {
            type : String,
            required : true
        },
        paymentDetails : {
            method : {
            type : String,
            enum : ["COD", "KHALTI"],
            default : "COD"
            },
            Status : {
            type : String,
            enum : ["pending", "paid", "unpaid"],
            default : "pending"
            }
        },
        orderStatus : {
            type :String,
            enum : ["packing", "shipping", "delivered"],
            default : "packing"
    }

    },{timestamps : true}
)

export const Order = mongoose.model("Order", orderSchema)