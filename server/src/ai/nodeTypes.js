/**
 * Defines the types of nodes available in the chain system
 */
export const NODE_TYPES = {
  INPUT: 'input',        // Accepts user input/variables
  LLM: 'llm',           // Calls Gemini with context
  TRANSFORM: 'transform', // Transforms/formats data
  OUTPUT: 'output',      // Final output formatting
  MERGE: 'merge',        // Merges multiple inputs (future)
};

/**
 * Node type metadata for validation and UI
 */
export const NODE_TYPE_METADATA = {
  [NODE_TYPES.INPUT]: {
    label: 'Input',
    description: 'Accepts input variables from the user',
    requiresLLM: false,
    canHaveMultipleInputs: false,
  },
  [NODE_TYPES.LLM]: {
    label: 'LLM',
    description: 'Processes text using Gemini AI with context from previous nodes',
    requiresLLM: true,
    canHaveMultipleInputs: true,
  },
  [NODE_TYPES.TRANSFORM]: {
    label: 'Transform',
    description: 'Transforms or formats data without using LLM',
    requiresLLM: false,
    canHaveMultipleInputs: true,
  },
  [NODE_TYPES.OUTPUT]: {
    label: 'Output',
    description: 'Formats the final output',
    requiresLLM: false,
    canHaveMultipleInputs: true,
  },
  [NODE_TYPES.MERGE]: {
    label: 'Merge',
    description: 'Merges multiple previous outputs (future feature)',
    requiresLLM: false,
    canHaveMultipleInputs: true,
  },
};

/**
 * Validates if a node type is valid
 */
export function isValidNodeType(type) {
  return Object.values(NODE_TYPES).includes(type);
}