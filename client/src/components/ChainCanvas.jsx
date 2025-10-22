import React, { useCallback } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";

export default function ChainCanvas({ nodes, edges, onChange }) {

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(
    nodes.map((node, index) => ({
      id: node.id || `node-${index}`,
      data: { label: node.text || node.prompt || 'Node ' + (index + 1) },
      position: node.position || { x: index * 250, y: 100 },
    }))
  );


  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(
    edges.map((edge, index) => ({
      id: edge.id || `edge-${index}`,
      source: edge.from || edge.source,
      target: edge.to || edge.target,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }))
  );

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge({ 
        ...params, 
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed }
      }, reactFlowEdges);
      
      setEdges(newEdges);
      
      // Notify parent component with updated edges
      if (onChange) {
        const backendEdges = newEdges.map((edge) => ({
          from: edge.source,
          to: edge.target,
        }));
        
        onChange({ 
          nodes: nodes, // Keep original nodes
          edges: backendEdges 
        });
      }
    },
    [reactFlowEdges, setEdges, nodes, onChange]
  );

  // Track when nodes are repositioned
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      // If nodes were moved, update parent with new positions
      const hasPositionChange = changes.some(
        (change) => change.type === 'position' && change.dragging === false
      );
      
      if (hasPositionChange && onChange) {
        const backendNodes = reactFlowNodes.map((node) => ({
          id: node.id,
          text: node.data.label,
          position: node.position,
        }));
        
        const backendEdges = reactFlowEdges.map((edge) => ({
          from: edge.source,
          to: edge.target,
        }));
        
        onChange({ nodes: backendNodes, edges: backendEdges });
      }
    },
    [onNodesChange, reactFlowNodes, reactFlowEdges, onChange]
  );

  return (
    <div style={{ 
      width: "100%", 
      height: "600px", 
      border: "2px solid #e2e8f0", 
      borderRadius: '8px',
      background: '#f8fafc'
    }}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        defaultEdgeOptions={{
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed }
        }}
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls />
      </ReactFlow>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '1175px',
        background: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#64748b',
        border: '1px solid #e2e8f0'
      }}>
        💡 Drag from one node's edge to another to connect them
      </div>
    </div>
  );
}