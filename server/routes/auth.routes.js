import express from 'express'
import { logIn, signUp } from '../controllers/auth.controller.js'
import { PrismaClient } from '@prisma/client'
import isAuth from '../middleware/isAuth.js'

const prisma = new PrismaClient()

const authRouter = express.Router()

authRouter.post('/signup', signUp)
authRouter.post('/login', logIn)

authRouter.get('/me', isAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true } 
  });

  res.json({ success: true, user });
});

export default authRouter