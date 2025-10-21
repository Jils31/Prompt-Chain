import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChainById } from "../api/chains";
import ChainCanvas from "../components/ChainCanvas";
import ChainRunButton from "../components/ChainRunButton";


export default function ChainDetail({ chainId }) {
  const { data: chain, isLoading, error } = useQuery({
    queryKey: ["chain", chainId],
    queryFn: () => getChainById(chainId),
    enabled: !!chainId,
    onError: (err) => console.error("React Query fetch error:", err),
});

console.log("chainId:", chainId);
console.log("chain data from query:", chain);

  const [executionResults, setExecutionResults] = useState(null);

  if (isLoading) return <div>Loading chain...</div>;
  // if (error) return <div>Error loading chain</div>;
  if (!chain) return <div>Chain not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{chain.title}</h2>
      <p className="mb-4">{chain.description}</p>

      <ChainCanvas nodes={chain.nodes} edges={chain.edges} />

      <div className="mt-4">
        <ChainRunButton
          chainId={chain.id}
          onResult={(results) => setExecutionResults(results)}
        />
      </div>

      {executionResults && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Execution Results:</h3>
          <pre>{JSON.stringify(executionResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
