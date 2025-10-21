import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChain } from "../api/chains";

export default function NewChain() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nodes, setNodes] = useState([{ id: "node1", text: "" }]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: saveChain, isPending } = useMutation({
    mutationFn: async () =>
      createChain({
        title,
        description,
        nodes,
        edges: [],
        userId: "b1ab05e6-6e3f-45f1-81d8-322cf6e50397"
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chains"] });
      navigate("/chains");
    },
    onError: (err) => {
      console.error("Error creating chain:", err);
      alert("Failed to create chain.");
    },
  });

  const addNode = () => {
    setNodes([...nodes, { id: `node${nodes.length + 1}`, text: "" }]);
  };

  const updateNodeText = (index, text) => {
    const updated = [...nodes];
    updated[index].text = text;
    setNodes(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    saveChain();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Chain
      </h2>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Title
      </label>
      <input
        type="text"
        placeholder="Enter chain title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full mb-4"
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full mb-6"
      />

      <h3 className="text-lg font-semibold mb-2 text-gray-700">Nodes</h3>
      {nodes.map((node, index) => (
        <input
          key={node.id}
          type="text"
          placeholder={`Node ${index + 1} text`}
          value={node.text}
          onChange={(e) => updateNodeText(index, e.target.value)}
          className="border border-gray-300 rounded p-2 w-full mb-2"
        />
      ))}

      <button
        type="button"
        onClick={addNode}
        className="px-3 py-1 bg-green-500 text-white rounded mb-4 hover:bg-green-600"
      >
        + Add Node
      </button>

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
