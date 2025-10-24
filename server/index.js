import "./src/config/redis.js";
import express from 'express';
import cors from 'cors';

import userRouter from "./routes/user.route.js";
import chainRouter from "./routes/chain.routes.js";
import executionRouter from "./routes/execution.routes.js";
import chainRunnerRoutes from "./src/routes/chainRunnerRoutes.js"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'https://prompt-chain-eight.vercel.app/'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/users',userRouter )
app.use('/api/chains', chainRouter)
app.use('/api/execute', executionRouter)
app.use('/api', chainRunnerRoutes);
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 5000

app.get('/', (req,res) =>{
    res.send("Hello world")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
