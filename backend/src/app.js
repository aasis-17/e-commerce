import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

//Middlewares
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(express.static("Public"))
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(cookieParser())


//routes
import { userRouter } from "./Routes/index.js";

app.use("/api/v1/user", userRouter)

export default app;