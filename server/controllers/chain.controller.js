import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function getChain(req,res){
    try{
        const userId = req.userId
        const chains = await prisma.promptChain.findMany({where:{userId}})
        return res.status(200).json(chains)
    }catch(error){
        console.error("Execution error:", error)
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function postChain(req,res){
    try{
        const {title, description, nodes, edges} = req.body
        const userId = req.userId
        
        if(!title  || !nodes || !edges || !userId) return res.status(400).json({message:"All fields are required"})
        
        const user = await prisma.user.findUnique({where:{id:userId}})
        if(!user) return res.status(404).json({message:"User not found"})
        
        const newChain = await prisma.promptChain.create({data:{title, description, nodes, edges, userId}})
        return res.status(201).json(newChain)
    }catch(error){
        console.error("Execution error:", error)
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function getChainbyId(req,res){
    try{
        const id = req.params.id
        const chain = await prisma.promptChain.findUnique({where:{id}})

        if(!chain) return res.status(404).json({message:"Chain not found"})

        return res.status(200).json(chain)
        
    }catch(error){
        console.error("Execution error:", error)
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function updateChain(req,res){
    try{
        const id = req.params.id
        const {title, description, nodes, edges} = req.body
        const userId = req.userId

        const chain = await prisma.promptChain.findUnique({ where: { id } });
        if (!chain) return res.status(404).json({ message: "PromptChain not found" });
        
        const updatedChain = await prisma.promptChain.update({where:{id}, data:{title, description, nodes, edges, userId}})
        return res.status(200).json(updatedChain)
    }catch(error){
        console.error("Execution error:", error)
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function deleteChain(req,res){
    try{
        const id = req.params.id
        await prisma.promptChain.delete({where:{id}})
        return res.status(200).json({message:"Chain deleted successfully"})
    }catch(error){
        console.error("Execution error:", error)
        return res.status(500).json({message:"Internal server error"})
    }
}

