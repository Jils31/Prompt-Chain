import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { createChain } from "../api/chains";
import toast from "react-hot-toast";

export default function NewChain() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nodes, setNodes] = useState([{ id: uuidv4(), text: "", type: "input" }]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: saveChain, isPending } = useMutation({
    mutationFn: async () =>
      createChain({
        title,
        description,
        nodes,
        edges: [],
        userId: "b1ab05e6-6e3f-45f1-81d8-322cf6e50397",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chains"] });
      toast.success("Chain created successfully!");
      navigate(`/chains/${data.id}`);
    },
    onError: (err) => {
      console.error("Error creating chain:", err);
      alert("Failed to create chain.");
    },
  });

  const addNode = () => {
    setNodes([...nodes, { id: uuidv4(), text: "", type: "input" }]);
  };

  const updateNodeText = (id, text) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const updateNodeType = (id, type) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, type } : n)));
  };

  const deleteNode = (id) => {
    if (!confirm("Are you sure you want to delete this node?")) return;
    setNodes(nodes.filter((n) => n.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (nodes.length === 0) newErrors.nodes = "At least one node is required.";
    if (nodes.some((n) => !n.text.trim()))
      newErrors.nodeText = "All nodes must have text.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    saveChain();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Chain</h2>

      {/* Title */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        placeholder="Enter chain title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full mb-1"
      />
      {errors.title && <p className="text-red-500 text-sm mb-3">{errors.title}</p>}

      {/* Description */}
      <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full mb-6"
      />

      {/* Nodes */}
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Nodes</h3>
      {nodes.map((node) => (
        <div key={node.id} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Node text..."
            value={node.text}
            onChange={(e) => updateNodeText(node.id, e.target.value)}
            className="border border-gray-300 rounded p-2 flex-1"
          />

          <select
            value={node.type}
            onChange={(e) => updateNodeType(node.id, e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="input">Input</option>
            <option value="output">Output</option>
            <option value="llm">LLM</option>
          </select>

          <button
            type="button"
            onClick={() => deleteNode(node.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
      {errors.nodes && <p className="text-red-500 text-sm mb-1">{errors.nodes}</p>}
      {errors.nodeText && <p className="text-red-500 text-sm mb-4">{errors.nodeText}</p>}

      {/* Add Node */}
      <button
        type="button"
        onClick={addNode}
        className="px-3 py-1 bg-green-500 text-white rounded mb-6 hover:bg-green-600"
      >
        + Add Node
      </button>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isPending}
        className="block w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Chain"}
      </button>
    </div>
  );
}
