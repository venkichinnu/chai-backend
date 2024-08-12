import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//This is a built-in middleware function in Express.js that parses incoming requests with JSON payloads and makes the data available under req.body.
app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({             // max limit of url encoded data will be 16kb from URL
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'



// routes declaration
app.use('/api/v1/users', userRouter)

// localhost:8000/api/v1/users/register
export { app }