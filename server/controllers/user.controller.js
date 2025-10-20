import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function getUser(req,res){
    try{
        const users = await prisma.user.findMany({})
        return res.status(200).json(users)
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function postUser(req,res){
    try{
        const {name, email} = req.body
        if(!name || !email) return res.status(400).json({message:"Name and email both are required"})

        const existingUser = await prisma.user.findUnique({where : {email}})
        if(existingUser) return res.status(400).json({message:"Email already exists"})
        
        const newUser = await prisma.user.create({data : {name, email}})
        return res.status(201).json(newUser)
        
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function getUserbyId(req,res){
    try{
        const id = req.params.id
        const user = await prisma.user.findUnique({where:{id}})

        if(!user) return res.status(404).json({message:"User not found"})

        return res.status(200).json(user)
        
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function updateUser(req,res){
    try{
        const id = req.params.id
        const {name, email} = req.body

        const existingUser = await prisma.user.findUnique({where:{email}})
        if(existingUser) return res.status(400).json({message:"Email already exists"})
        
        const updatedUser = await prisma.user.update({where:{id}, data:{name,email}})

        return res.status(200).json(updateUser)
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function deleteUser(req,res){
    try{
        const id = req.params.id
        await prisma.user.delete({where:{id}})
        return res.status(200).json({message:"User deleted successfully"})
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

