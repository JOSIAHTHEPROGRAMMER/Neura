import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'

const app = express()

await connectDB()


// Stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middleware
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req,res)=>res.send('Server is running....'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server is running on port ${process.env.PORT || 5000}`)
})
