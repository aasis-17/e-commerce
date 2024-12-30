import mongoose from "mongoose"

const offerSchema = new mongoose.Schema(
    {
        offerName : {
            type : String,
        },
        off : {
            type : Number,
            required : true
        }
        
    }
)

export const Offer = mongoose.model("Offer", offerSchema)