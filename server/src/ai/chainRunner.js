import { PrismaClient } from "@prisma/client";
import { callGeminiWithRetry } from "../services/geminiService.js";

const prisma = new PrismaClient();
export async function runChain(chainId, inputValues) {
  const startTime = Date.now();

  try {
    const chain = await prisma.promptChain.findUnique({
      where: { id: chainId },
    });

    if (!chain) throw new Error("Chain not found");

    const nodes = chain.nodes || [];
    const nodeDescriptions = nodes
      .map((n, i) => `${i + 1}. (${n.type}) → ${n.text}`)
      .join("\n");

    const prompt = `
        You are an AI chain executor. A user has provided a set of nodes from a chain.

        Each node has a "type" and a "text" content.
        Using this information, understand the intent and respond naturally as if you are running the chain.

        Here are the nodes:
        ${nodeDescriptions}

        Now, based on these, generate the final coherent output.
   `;

    const output = await callGeminiWithRetry(prompt);

    const totalTime = Date.now() - startTime;

    return {
      success: true,
      logs: nodes.map((n) => ({
        nodeId: n.id,
        nodeName: n.text,
        type: n.type,
      })),
      finalOutput: output,
      totalTime,
    };
  } catch (error) {
    const totalTime = Date.now() - startTime;

    return {
      success: false,
      logs: [
        {
          nodeId: "error",
          nodeName: "Chain Execution Error",
          output: null,
          error: error.message,
          executionTime: totalTime,
        },
      ],
      finalOutput: null,
      totalTime,
    };
  }
}
