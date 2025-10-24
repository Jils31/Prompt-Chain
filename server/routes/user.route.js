import express from 'express'
import { deleteUser, getUser, getUserbyId, postUser, updateUser } from "../controllers/user.controller.js";
import isAuth from '../middleware/isAuth.js';

const userRouter = express.Router()
userRouter.post('/', postUser)

userRouter.use(isAuth)

userRouter
.get('/', getUser)
.get('/:id', getUserbyId)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter