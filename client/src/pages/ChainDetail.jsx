import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChainById, updateChain } from "../api/chains";
import ChainCanvas from "../components/ChainCanvas";
import ChainRunButton from "../components/ChainRunButton";
import toast from 'react-hot-toast'

export default function ChainDetail({ chainId }) {
  const queryClient = useQueryClient();
  const [localChainData, setLocalChainData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: chain, isLoading, error } = useQuery({
    queryKey: ["chain", chainId],
    queryFn: () => getChainById(chainId),
    enabled: !!chainId,
    onError: (err) => console.error("React Query fetch error:", err),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedChain) => updateChain(chainId, updatedChain),
    onSuccess: () => {
      queryClient.invalidateQueries(["chain", chainId]);
      setHasChanges(false);
      toast.success("Chain saved successfully")
    },
    onError: (err) => {
      console.error("Error saving chain:", err);
      alert("Failed to save chain");
    },
  });

  const [executionResults, setExecutionResults] = useState(null);

  const handleCanvasChange = ({ nodes, edges }) => {
    setLocalChainData({ nodes, edges });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!localChainData) return;
    
    updateMutation.mutate({
      title: chain.title,
      description: chain.description,
      nodes: localChainData.nodes,
      edges: localChainData.edges,
    });
  };

  if (isLoading) return <div className="p-4">Loading chain...</div>;
  if (!chain) return <div className="p-4">Chain not found</div>;

  const displayData = localChainData || { nodes: chain.nodes, edges: chain.edges };

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-950 py-12 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-4xl font-bold text-white mb-2">{chain.title}</h2>
        <p className="text-gray-400 text-lg">{chain.description}</p>
      </div>
      <button
        onClick={handleSave}
        disabled={!hasChanges || updateMutation.isLoading}
        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
          hasChanges
            ? "bg-white text-black hover:bg-gray-200"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
        }`}
      >
        {updateMutation.isLoading ? "Saving..." : "Save Changes"}
      </button>
    </div>

    <div className="mb-6">
      <ChainCanvas 
        nodes={displayData.nodes} 
        edges={displayData.edges}
        onChange={handleCanvasChange}
      />
    </div>

    <div className="mb-6">
      <ChainRunButton
        chainId={chain.id}
        onResult={(results) => setExecutionResults(results)}
      />
    </div>

    {executionResults && (
      <div className="p-6 border border-gray-800 rounded-xl bg-gray-900">
        <h3 className="text-xl font-semibold mb-4 text-white">Execution Results:</h3>
        <pre className="text-sm overflow-auto text-gray-300 bg-gray-800 p-4 rounded-lg">
          {JSON.stringify(executionResults, null, 2)}
        </pre>
      </div>
    )}
  </div>
</div>
  );
}