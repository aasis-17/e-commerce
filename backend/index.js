import app from "./src/app.js";
import dotenv from "dotenv"
import connectionDB from "./src/connectDB/index.js"

dotenv.config({
    path : "./.env"
})

const PORT = process.env.PORT || 8000
const URI = process.env.MONGODB_URI 

//Database connection
connectionDB(URI)
.then(() => {
    app.listen(PORT , () => {
        console.log(`**Server statrted at port ${PORT}**`)
    } )

    app.on("error", (error) => {
        console.log("error", error)
        throw error
    })
})
.catch(error => {
    console.log("Database connection failed!!", error)
})



