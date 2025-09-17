import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'

const app = express()

await connectDB()

// Middleware
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req,res)=>res.send('Server is running....'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message',messageRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server Status: Online\nPort number: ${PORT}`)
})