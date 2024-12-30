import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        productName : {
            type : String,
            required : true
        },
        productImage : {
            type : String,
            required : true
        },
        productSize : {
            type : String,
            required : true
        },
        productColor : {
            type : String,
            required : true
        },
        productDetails : {
            type : String,
            required : true
        },
        productPrice : {
            type : Number,
            required : true
        },
        productStockQty : {
            type : Number,
            required : true
        },
        productStatus :{
            type : String,
            enum : ["avaliable", "soldout"],
            default : "avaliable"
        },
        reviews : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }],
        offers : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Offer"
        }
    },{timestamps : true}
)

export const Product = mongoose.model("Product", productSchema)