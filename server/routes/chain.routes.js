import express from "express"
import { getChain, getChainbyId, postChain, updateChain } from "../controllers/chain.controller.js"

const chainRouter = express.Router()

chainRouter.post('/', postChain)
chainRouter
.get('/', getChain)
.get('/:id', getChainbyId)
chainRouter.put('/:id', updateChain)

export default chainRouter