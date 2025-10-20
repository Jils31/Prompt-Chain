import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function getChain(req,res){
    try{
        const chains = await prisma.promptChain.findMany({})
        return res.status(200).json(chains)
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function postChain(req,res){
    try{
        const {title, description, nodes, edges, userId} = req.body
        
        if(!title  || !nodes || !edges || !userId) return res.status(400).json({message:"All fields are required"})
        
        const user = await prisma.user.findUnique({where:{id:userId}})
        if(!user) return res.status(404).json({message:"User not found"})
        
        const newChain = await prisma.promptChain.create({data:{title, description, nodes, edges, userId}})
        return res.status(201).json(newChain)
    }catch(error){
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
        return res.status(500).json({message:"Internal server error"})
    }
}

export async function updateChain(req,res){
    try{
        const id = req.params.id
        const {title, description, nodes, edges, userId} = req.body

        const chain = await prisma.promptChain.findUnique({ where: { id } });
        if (!chain) return res.status(404).json({ message: "PromptChain not found" });
        
        const updatedChain = await prisma.promptChain.update({where:{id}, data:{title, description, nodes, edges, userId}})
        return res.status(200).json(updatedChain)
    }catch(error){
        return res.status(500).json({message:"Internal server error"})
    }
}

// export async function deleteUser(req,res){
//     try{
//         const id = req.params.id
//         await prisma.user.delete({where:{id}})
//         return res.status(200).json({message:"User deleted successfully"})
//     }catch(error){
//         return res.status(500).json({message:"Internal server error"})
//     }
// }

