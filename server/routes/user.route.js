import express from 'express'
import { deleteUser, getUser, getUserbyId, postUser, updateUser } from "../controllers/user.controller.js";

const userRouter = express.Router()

userRouter
.get('/', getUser)
.get('/:id', getUserbyId)
userRouter.post('/', postUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter