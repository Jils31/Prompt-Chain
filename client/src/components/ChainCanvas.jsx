import React, { useCallback, useState, memo } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";

const EditableNode = memo(function EditableNode({ id, data, isConnectable }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label || "");

  const handleDoubleClick = () => setEditing(true);
  
  const handleBlur = () => {
    setEditing(false);
    data.onLabelChange(id, label);
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
  };

  const getNodeColor = () => {
      return "#6b7280"; 
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        border: `1px solid ${getNodeColor()}`,
        borderRadius: "8px",
        background: "white",
        minWidth: "160px",
        textAlign: "center",
        fontSize: "14px",
        cursor: editing ? "text" : "grab",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Handle 
        type="target" 
        position="top" 
        isConnectable={isConnectable}
        style={{ background: getNodeColor() }}
      />

      {editing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "8px",
          }}
        />
      ) : (
        <div 
          onDoubleClick={handleDoubleClick}
          style={{ 
            marginBottom: "8px",
            fontWeight: "500",
            minHeight: "20px",
          }}
        >
          {label}
        </div>
      )}

      <Handle 
        type="source" 
        position="bottom" 
        isConnectable={isConnectable}
        style={{ background: getNodeColor() }}
      />
    </div>
  );
});

const nodeTypes = { editableNode: EditableNode };

export default function ChainCanvas({ nodes, edges, onChange }) {
  const initialNodes = nodes.map((node, index) => ({
    id: node.id || `node-${index}`,
    type: "editableNode",
    data: {
      label: node.text || node.prompt || "Node " + (index + 1),
      type: node.type || "llm",
      onLabelChange: () => {},
      onTypeChange: () => {},
    },
    position: node.position || { x: index * 250, y: 100 },
  }));

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(
    edges.map((edge, index) => ({
      id: edge.id || `edge-${index}`,
      source: edge.source || edge.from,  
      target: edge.target || edge.to,   
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    }))
  );

  const notifyChange = useCallback((updatedNodes, updatedEdges) => {
    if (onChange) {
      const backendNodes = updatedNodes.map((n) => ({
        id: n.id,
        text: n.data.label,
        type: n.data.type || "llm",
        position: n.position,
      }));
      const backendEdges = updatedEdges.map((e) => ({
        source: e.source,  
        target: e.target,  
      }));
      onChange({ nodes: backendNodes, edges: backendEdges });
    }
  }, [onChange]);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(
        { ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
        reactFlowEdges
      );
      setEdges(newEdges);
      notifyChange(reactFlowNodes, newEdges);
    },
    [reactFlowEdges, reactFlowNodes, setEdges, notifyChange]
  );

  const addNode = useCallback(() => {
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: "editableNode",
      data: { 
        label: `New Node ${reactFlowNodes.length + 1}`,
        type: "llm",
        onLabelChange: () => {},
        onTypeChange: () => {},
      },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    };
    const updatedNodes = [...reactFlowNodes, newNode];
    setNodes(updatedNodes);
    notifyChange(updatedNodes, reactFlowEdges);
  }, [reactFlowNodes, reactFlowEdges, setNodes, notifyChange]);

  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      const updatedNodes = reactFlowNodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
      );
      setNodes(updatedNodes);
      notifyChange(updatedNodes, reactFlowEdges);
    },
    [reactFlowNodes, reactFlowEdges, setNodes, notifyChange]
  );

  const handleTypeChange = useCallback(
    (nodeId, newType) => {
      const updatedNodes = reactFlowNodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, type: newType } } : n
      );
      setNodes(updatedNodes);
      notifyChange(updatedNodes, reactFlowEdges);
    },
    [reactFlowNodes, reactFlowEdges, setNodes, notifyChange]
  );

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const hasPositionChange = changes.some(
        (c) => c.type === "position" && !c.dragging
      );
      if (hasPositionChange) {
        notifyChange(reactFlowNodes, reactFlowEdges);
      }
    },
    [onNodesChange, reactFlowNodes, reactFlowEdges, notifyChange]
  );

  const preparedNodes = reactFlowNodes.map((n) => ({
    ...n,
    data: { 
      ...n.data, 
      onLabelChange: handleLabelChange,
      onTypeChange: handleTypeChange,
    },
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        border: "2px solid #e2e8f0",
        borderRadius: "8px",
        background: "#f8fafc",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <button
          onClick={addNode}
          style={{
            padding: "10px 20px",
            background: "#101A29",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0B252B")}
          onMouseOut={(e) => (e.target.style.background = "#101A29")}
        >
          + Add Node
        </button>
      </div>

      <ReactFlow
        nodes={preparedNodes}
        edges={reactFlowEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls />
      </ReactFlow>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          background: "#101A29",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          color: "white",
          border: "1px solid #e2e8f0",
        }}
      >
        💡 Double-click to edit the node
      </div>
    </div>
  );
}