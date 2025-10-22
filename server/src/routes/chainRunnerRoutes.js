import express from 'express';
import { runChain } from '../ai/chainRunner.js';

const router = express.Router();

router.post('/run-chain/:chainId', async (req, res) => {
  try {
    const { chainId } = req.params;
    const inputValues = req.body || {};
    
    console.log(`Running chain ${chainId} with inputs:`, inputValues);
    
    const result = await runChain(chainId, inputValues);
    
    res.json(result);
  } catch (error) {
    console.error('Chain execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;