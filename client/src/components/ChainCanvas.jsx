// src/components/ChainCanvas.jsx
import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export default function ChainCanvas({ nodes, edges }) {
  
  const flowNodes = nodes.map((node, index) => ({
    id: node.id,
    data: { label: node.text },
    position: node.position || { x: index * 150, y: index * 100 }, // auto-position if missing
  }));

  const flowEdges = edges.map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.from,
    target: edge.to,
    animated: true,
  }));

  return (
    <div style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}>
      <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
