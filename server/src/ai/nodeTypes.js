export const NODE_TYPES = {
  INPUT: 'input',
  LLM: 'llm',
  OUTPUT: 'output',
  TRANSFORM: 'transform'
};

export const NODE_METADATA = {
  [NODE_TYPES.INPUT]: {
    type: NODE_TYPES.INPUT,
    icon: '📥',
    description: 'Accepts user input',
    color: '#10b981'
  },
  [NODE_TYPES.LLM]: {
    type: NODE_TYPES.LLM,
    icon: '🤖',
    description: 'Calls Gemini AI',
    color: '#3b82f6'
  },
  [NODE_TYPES.OUTPUT]: {
    type: NODE_TYPES.OUTPUT,
    icon: '📤',
    description: 'Returns final output',
    color: '#8b5cf6'
  },
  [NODE_TYPES.TRANSFORM]: {
    type: NODE_TYPES.TRANSFORM,
    icon: '⚙️',
    description: 'Transforms data',
    color: '#f59e0b'
  }
};