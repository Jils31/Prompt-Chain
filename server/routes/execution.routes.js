import express from "express"
import { getExecutionResult,executeChain } from "../controllers/execution.controller.js"

const executionRouter = express.Router()

executionRouter.get('/:executionId', getExecutionResult)
executionRouter.post('/:chainId', executeChain)

export default executionRouter