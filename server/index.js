import "./src/config/redis.js";
import express from 'express';
import cors from 'cors';

import userRouter from "./routes/user.route.js";
import chainRouter from "./routes/chain.routes.js";
import executionRouter from "./routes/execution.routes.js";

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users',userRouter )
app.use('/api/chains', chainRouter)
app.use('/api/execute', executionRouter)

const PORT = process.env.PORT || 5000

app.get('/', (req,res) =>{
    res.send("Hello world")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
