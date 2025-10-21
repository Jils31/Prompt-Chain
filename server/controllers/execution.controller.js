import express from "express";
import redis from "../src/config/redis.js";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function executeChain(req, res) {
  try {
    const chainId = req.params.chainId;
    // console.log(chainId)
    // Logic to execute the chain with the given chainId
    const chain = await prisma.promptChain.findUnique({
      where: { id: chainId },
    });
    if (!chain) return res.status(404).json({ message: "Chain not found" });

    const nodes = chain.nodes;
    const edges = chain.edges;

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      return res.status(400).json({ message: "Invalid or empty nodes" });
    }

    const adjacency = {};
    edges.forEach((edge) => {
      if (!adjacency[edge.from]) adjacency[edge.from] = [];
      adjacency[edge.from].push(edge.to);
    });

    const orderedNodes = nodes
    const results = {};
    const executionId = uuidv4()

    for (const node of orderedNodes) {
      const output = `Output for ${node.text}`
      results[node.id] = output
      await redis.set(
        `execution:${executionId}:node:${node.id}`,
        JSON.stringify({ nodeId: node.id, output })
      );
    } 

     await redis.set( `execution:${executionId}:final`, JSON.stringify(results) ) 
     return res.status(200).json({ executionId, results })
  } catch (error) {
    console.error("Execution error:", error)
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getExecutionResult(req, res) {
  try {
    const executionId = req.params.executionId
    // console.log(executionId)
    const finalResult = await redis.get(`execution:${executionId}:final`)
    if (!finalResult) {
      return res.status(404).json({ message: "Execution not found" });
    }
    return res.status(200).json({ executionId, results: JSON.parse(finalResult) })
  } catch (error) {
    console.error("Execution error:", error)
    return res.status(500).json({ message: "Internal server error" });
  }
}
