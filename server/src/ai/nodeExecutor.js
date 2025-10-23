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

function buildPromptWithContext(nodeText, previousContext, hasPreviousContext) {

  const conciseInstruction =  `IMPORTANT: Provide a concise response in 2-3 short paragraphs maximum. Focus only on the most important information. Be direct and avoid unnecessary elaboration.`;
  
  if (!previousContext || previousContext.trim() === "") {
    return `${conciseInstruction}

${nodeText}`;
  }

  return `${conciseInstruction}

Previous context from the chain:
${previousContext}

---

Current instruction:
${nodeText}`;
}

export async function executeNode(node, context) {
  const startTime = Date.now();
  
  try {
    let output;
    
    const processedText = replaceVariables(node.text, context);
    const hasPreviousContext = context.previousContext && context.previousContext.trim() !== "";
    
    switch (node.type) {
      case NODE_TYPES.INPUT:
        output = processedText;
        break;
        
      case NODE_TYPES.LLM:
        const promptWithContext = buildPromptWithContext(
          processedText,
          context.previousContext,
          hasPreviousContext
        );
        output = await callGeminiWithRetry(promptWithContext);
        break;
        
      case NODE_TYPES.TRANSFORM:
        output = processedText;
        
        if (context.previousContext) {
          output = output.replace('{{previousContext}}', context.previousContext);
        }
        break;
        
      case NODE_TYPES.OUTPUT:
        output = processedText;
        
        if (context.previousContext) {
          output = output.replace('{{previousContext}}', context.previousContext);
        }
        break;
        
      default:
        const defaultPromptWithContext = buildPromptWithContext(
          processedText,
          context.previousContext,
          hasPreviousContext
        );
        output = await callGeminiWithRetry(defaultPromptWithContext);
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