import mongoose from "mongoose";

const connectionDB = async (URI) => {
    try {
        await mongoose.connect(URI)
        console.log("MongoDB connected successfully!!")
    } catch (error) {
        console.log("MongoDB connection failed!!", error)
        process.exit(1)
    }    
}

export default connectionDB