import { NODE_TYPES } from './nodeTypes.js';
import { callGeminiWithRetry } from '../services/geminiService.js';

/**
 * Replaces variables in text with values from context
 */
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

/**
 * Builds the final prompt by combining previous context with current node text
 */
function buildPromptWithContext(nodeText, previousContext, hasPreviousContext) {
  // Add instruction for concise responses
  const conciseInstruction = hasPreviousContext 
    ? `IMPORTANT: Previous context is available from earlier steps. Provide a brief, focused response (2-3 sentences maximum) that adds new information without repeating what was already covered. Be concise and actionable.`
    : `IMPORTANT: Provide a concise response in 2-3 short paragraphs maximum. Focus only on the most important information. Be direct and avoid unnecessary elaboration.`;
  
  if (!previousContext || previousContext.trim() === "") {
    return `${conciseInstruction}

${nodeText}`;
  }
  
  // Combine previous context with current instruction
  return `${conciseInstruction}

Previous context from the chain:
${previousContext}

---

Current instruction:
${nodeText}`;
}

/**
 * Executes a single node with context from previous nodes
 */
export async function executeNode(node, context) {
  const startTime = Date.now();
  
  try {
    let output;
    
    // Replace variables in node text first
    const processedText = replaceVariables(node.text, context);
    
    // Check if there's previous context
    const hasPreviousContext = context.previousContext && context.previousContext.trim() !== "";
    
    switch (node.type) {
      case NODE_TYPES.INPUT:
        // Input nodes pass through the variable value after replacement
        output = processedText;
        break;
        
      case NODE_TYPES.LLM:
        // LLM nodes get context from previous nodes + their own instruction
        const promptWithContext = buildPromptWithContext(
          processedText,
          context.previousContext,
          hasPreviousContext
        );
        output = await callGeminiWithRetry(promptWithContext);
        break;
        
      case NODE_TYPES.TRANSFORM:
        // Transform nodes can access previous context through variables
        output = processedText;
        
        // If there's previous context, make it available
        if (context.previousContext) {
          output = output.replace('{{previousContext}}', context.previousContext);
        }
        break;
        
      case NODE_TYPES.OUTPUT:
        // Output nodes format the final result
        output = processedText;
        
        // Replace special previousContext variable if present
        if (context.previousContext) {
          output = output.replace('{{previousContext}}', context.previousContext);
        }
        break;
        
      default:
        // Default behavior: treat as LLM node with context
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