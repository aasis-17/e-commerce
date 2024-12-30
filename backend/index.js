import express from "express";
import connectionDB from "./connectDB/index.js";

const app = express()
const PORT = 7000
const URI = "mongodb://localhost:27017/e-commerce"


//Middlewares
app.use(express.urlencoded({extended : false}))
app.use(express.json())

//Database connection
connectionDB(URI)


app.listen(PORT, () => {
    console.log(`**Server statrted at port ${PORT}**`)
} )