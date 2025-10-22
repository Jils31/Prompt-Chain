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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{chain.title}</h2>
        <button
          onClick={handleSave}
          disabled={!hasChanges || updateMutation.isLoading}
          className={`px-4 py-2 rounded font-medium ${
            hasChanges
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {updateMutation.isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      
      <p className="mb-4 text-gray-600">{chain.description}</p>

      <ChainCanvas 
        nodes={displayData.nodes} 
        edges={displayData.edges}
        onChange={handleCanvasChange}
      />

      <div className="mt-4">
        <ChainRunButton
          chainId={chain.id}
          onResult={(results) => setExecutionResults(results)}
        />
      </div>

      {executionResults && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Execution Results:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(executionResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}