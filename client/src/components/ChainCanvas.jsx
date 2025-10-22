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

/* 🔹 Custom Editable Node component */
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

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        padding: "10px 15px",
        border: "1px solid #94a3b8",
        borderRadius: "8px",
        background: "white",
        minWidth: "120px",
        textAlign: "center",
        fontSize: "14px",
        cursor: editing ? "text" : "grab",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Handle type="target" position="top" isConnectable={isConnectable} />
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
          }}
        />
      ) : (
        <div>{label}</div>
      )}
      <Handle type="source" position="bottom" isConnectable={isConnectable} />
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
      onLabelChange: () => {}, // placeholder, replaced later
    },
    position: node.position || { x: index * 250, y: 100 },
  }));

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(
    edges.map((edge, index) => ({
      id: edge.id || `edge-${index}`,
      source: edge.from || edge.source,
      target: edge.to || edge.target,
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    }))
  );

  /* 🔸 When user connects nodes */
  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(
        { ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
        reactFlowEdges
      );
      setEdges(newEdges);

      if (onChange) {
        const backendNodes = reactFlowNodes.map((n) => ({
          id: n.id,
          text: n.data.label,
          position: n.position,
        }));
        const backendEdges = newEdges.map((e) => ({
          from: e.source,
          to: e.target,
        }));
        onChange({ nodes: backendNodes, edges: backendEdges });
      }
    },
    [reactFlowEdges, reactFlowNodes, setEdges, onChange]
  );

  /* 🔸 Add new node */
  const addNode = useCallback(() => {
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: "editableNode",
      data: { label: `New Node ${reactFlowNodes.length + 1}` },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowNodes, setNodes]);

  /* 🔸 Update label text */
  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
      if (onChange) {
        const backendNodes = reactFlowNodes.map((n) => ({
          id: n.id,
          text: n.id === nodeId ? newLabel : n.data.label,
          position: n.position,
        }));
        const backendEdges = reactFlowEdges.map((e) => ({
          from: e.source,
          to: e.target,
        }));
        onChange({ nodes: backendNodes, edges: backendEdges });
      }
    },
    [reactFlowNodes, reactFlowEdges, onChange, setNodes]
  );

  /* 🔸 Keep positions synced */
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const hasPositionChange = changes.some(
        (c) => c.type === "position" && !c.dragging
      );
      if (hasPositionChange && onChange) {
        const backendNodes = reactFlowNodes.map((n) => ({
          id: n.id,
          text: n.data.label,
          position: n.position,
        }));
        const backendEdges = reactFlowEdges.map((e) => ({
          from: e.source,
          to: e.target,
        }));
        onChange({ nodes: backendNodes, edges: backendEdges });
      }
    },
    [onNodesChange, reactFlowNodes, reactFlowEdges, onChange]
  );

  /* 🔸 Inject live handler into data so EditableNode can call it */
  const preparedNodes = reactFlowNodes.map((n) => ({
    ...n,
    data: { ...n.data, onLabelChange: handleLabelChange },
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
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.target.style.background = "#2563eb")}
          onMouseOut={(e) => (e.target.style.background = "#3b82f6")}
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
          left: "1240px",
          background: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#64748b",
          border: "1px solid #e2e8f0",
        }}
      >
        💡 Double-click a node to edit its label
      </div>
    </div>
  );
}
