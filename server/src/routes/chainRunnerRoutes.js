import express from "express";
import { runChain } from "../ai/chainRunner.js";
import isAuth from "../../middleware/isAuth.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient()

router.post("/run-chain/:chainId", isAuth, async (req, res) => {
  try {
    const { chainId } = req.params;
    const inputValues = req.body.inputValues || {};

    console.log(`Running chain ${chainId} with inputs:`, inputValues);

    const chain = await prisma.promptChain.findUnique({
      where: { id: chainId },
    });

    if (!chain) {
      return res
        .status(404)
        .json({ success: false, message: "Chain not found" });
    }

    if (chain.userId !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to run this chain" });
    }

    const result = await runChain(chainId, inputValues);

    res.json(result);
  } catch (error) {
    console.error("Chain execution error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
