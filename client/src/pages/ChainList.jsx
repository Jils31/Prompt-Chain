import { useQuery } from "@tanstack/react-query";
import { getChain } from "../api/chains";
import { Link, useNavigate } from "react-router-dom";

export default function ChainList() {
  
  const navigate = useNavigate();
  const {
    data: chains = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chains"],
    queryFn: getChain,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading chains</div>;

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => navigate("/chains/new")}
      >
        + Create New Chain
      </button>
      <div className="p-4">
        {chains.map((chain) => (
          <div key={chain.id} className="p-2 border mb-2 rounded">
            <Link
              to={`/chains/${chain.id}`}
              className="font-bold text-blue-600"
            >
              {chain.title}
            </Link>
            <p>{chain.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
