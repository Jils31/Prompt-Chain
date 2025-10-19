import "./src/config/redis.js";
import express from 'express';
import cors from 'cors';

const app = express()

app.use(cors())
app.use(express.json())



const PORT = process.env.PORT || 5000

app.get('/', (req,res) =>{
    res.send("Hello world")
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
