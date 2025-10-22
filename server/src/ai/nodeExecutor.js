import { NODE_TYPES } from './nodeTypes.js';
import { callGeminiWithRetry } from '../services/geminiService.js';


function replaceVariables(text, context) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    if (context.variables[varName] !== undefined) {
      return context.variables[varName];
    }
    if (context.nodeOutputs[varName] !== undefined) {
      return context.nodeOutputs[varName];
    }
    return match; 
  });
}

export async function executeNode(node, context) {
  const startTime = Date.now();
  
  try {
    let output;
    
    switch (node.type) {
      case NODE_TYPES.INPUT:
        const varName = node.text.replace(/\{\{|\}\}/g, '').trim();
        output = context.variables[varName] || node.text;
        break;
        
      case NODE_TYPES.LLM:
        const prompt = replaceVariables(node.text, context);
        output = await callGeminiWithRetry(prompt);
        break;
        
      case NODE_TYPES.TRANSFORM:
        output = replaceVariables(node.text, context);
        break;
        
      case NODE_TYPES.OUTPUT:
        output = replaceVariables(node.text, context);
        break;
        
      default:
        const defaultPrompt = replaceVariables(node.text, context);
        output = await callGeminiWithRetry(defaultPrompt);
    }
    
    const executionTime = Date.now() - startTime;
    
    return {
      nodeId: node.id,
      output,
      executionTime
    };
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    return {
      nodeId: node.id,
      output: null,
      error: error.message,
      executionTime
    };
  }
}