import { PrismaClient } from "@prisma/client";
import { executeNode } from "./nodeExecutor.js";

const prisma = new PrismaClient();

/**
 * Builds a dependency graph and returns nodes in topological order
 */
function getExecutionOrder(nodes, edges) {
  // Create adjacency list for dependencies
  const inDegree = new Map();
  const adjacencyList = new Map();
  
  // Initialize all nodes
  nodes.forEach(node => {
    inDegree.set(node.id, 0);
    adjacencyList.set(node.id, []);
  });
  
  // Build the graph based on edges
  edges.forEach(edge => {
    // Check if source node exists
    if (!adjacencyList.has(edge.source)) {
      console.warn(`Edge source node "${edge.source}" not found in nodes`);
      return;
    }
    // Check if target node exists
    if (!adjacencyList.has(edge.target)) {
      console.warn(`Edge target node "${edge.target}" not found in nodes`);
      return;
    }
    
    adjacencyList.get(edge.source).push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });
  
  // Topological sort using Kahn's algorithm
  const queue = [];
  const executionOrder = [];
  
  // Start with nodes that have no dependencies
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });
  
  while (queue.length > 0) {
    const currentNodeId = queue.shift();
    const currentNode = nodes.find(n => n.id === currentNodeId);
    executionOrder.push(currentNode);
    
    // Process neighbors
    const neighbors = adjacencyList.get(currentNodeId) || [];
    neighbors.forEach(neighborId => {
      inDegree.set(neighborId, inDegree.get(neighborId) - 1);
      if (inDegree.get(neighborId) === 0) {
        queue.push(neighborId);
      }
    });
  }
  
  // If not all nodes are processed, there's a cycle
  if (executionOrder.length !== nodes.length) {
    throw new Error("Cycle detected in chain or disconnected nodes");
  }
  
  return executionOrder;
}

/**
 * Gathers context from all predecessor nodes
 */
function gatherPreviousContext(nodeId, edges, outputs) {
  const predecessors = edges
    .filter(edge => edge.target === nodeId)
    .map(edge => edge.source);
  
  if (predecessors.length === 0) {
    return "";
  }
  
  const contextParts = predecessors
    .map(predId => {
      const output = outputs.get(predId);
      return output ? `[Output from ${predId}]:\n${output}` : "";
    })
    .filter(part => part !== "");
  
  return contextParts.join("\n\n");
}

/**
 * Main chain execution function
 */
export async function runChain(chainId, inputValues = {}) {
  const startTime = Date.now();
  const logs = [];
  const outputs = new Map();

  try {
    // Fetch chain from database
    const chain = await prisma.promptChain.findUnique({
      where: { id: chainId },
    });

    if (!chain) {
      throw new Error("Chain not found");
    }

    const nodes = chain.nodes || [];
    const edges = chain.edges || [];

    if (nodes.length === 0) {
      throw new Error("Chain has no nodes");
    }

    console.log("Nodes:", JSON.stringify(nodes, null, 2));
    console.log("Edges:", JSON.stringify(edges, null, 2));

    // Validate edges - check if all source/target nodes exist
    const nodeIds = new Set(nodes.map(n => n.id));
    const invalidEdges = edges.filter(e => !nodeIds.has(e.source) || !nodeIds.has(e.target));
    
    if (invalidEdges.length > 0) {
      console.error("Invalid edges found:", invalidEdges);
      throw new Error(`Invalid edges: ${invalidEdges.map(e => `${e.source}->${e.target}`).join(', ')}`);
    }

    // Get execution order based on dependencies
    const executionOrder = getExecutionOrder(nodes, edges);

    // Execute nodes in order
    for (const node of executionOrder) {
      const nodeStartTime = Date.now();
      
      try {
        // Gather context from previous nodes
        const previousContext = gatherPreviousContext(node.id, edges, outputs);
        
        // Build execution context
        const context = {
          variables: inputValues,
          nodeOutputs: Object.fromEntries(outputs),
          previousContext: previousContext,
        };
        
        // Execute the node with context
        const result = await executeNode(node, context);
        
        // Store the output
        outputs.set(node.id, result.output);
        
        // Log execution details
        logs.push({
          nodeId: node.id,
          nodeName: node.text.substring(0, 50) + (node.text.length > 50 ? '...' : ''),
          type: node.type,
          output: result.output,
          error: result.error || null,
          executionTime: Date.now() - nodeStartTime,
          hadPreviousContext: previousContext.length > 0,
        });
        
        // If there was an error, stop execution
        if (result.error) {
          throw new Error(`Node ${node.id} failed: ${result.error}`);
        }
        
      } catch (nodeError) {
        logs.push({
          nodeId: node.id,
          nodeName: node.text.substring(0, 50),
          type: node.type,
          output: null,
          error: nodeError.message,
          executionTime: Date.now() - nodeStartTime,
        });
        throw nodeError;
      }
    }

    // Final output is the output of the last executed node
    const lastNode = executionOrder[executionOrder.length - 1];
    const finalOutput = outputs.get(lastNode.id);

    const totalTime = Date.now() - startTime;

    return {
      success: true,
      logs,
      finalOutput,
      totalTime,
      nodesExecuted: executionOrder.length,
    };

  } catch (error) {
    const totalTime = Date.now() - startTime;

    return {
      success: false,
      logs,
      finalOutput: null,
      totalTime,
      error: error.message,
    };
  }
}