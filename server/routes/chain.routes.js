import express from "express"
import { deleteChain, getChain, getChainbyId, postChain, updateChain } from "../controllers/chain.controller.js"

const chainRouter = express.Router()

chainRouter.post('/', postChain)
chainRouter
.get('/', getChain)
.get('/:id', getChainbyId)
chainRouter.put('/:id', updateChain)
chainRouter.delete('/:id', deleteChain)

export default chainRouter