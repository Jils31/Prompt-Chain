import express from "express"
import { deleteChain, getChain, getChainbyId, postChain, updateChain } from "../controllers/chain.controller.js"
import isAuth from "../middleware/isAuth.js"

const chainRouter = express.Router()

chainRouter.use(isAuth)

chainRouter.post('/', postChain)
chainRouter
.get('/', getChain)
.get('/:id', getChainbyId)
chainRouter.put('/:id', updateChain)
chainRouter.delete('/:id', deleteChain)

export default chainRouter