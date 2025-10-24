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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error loading chains</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3">
              Your AI Workflows
            </h1>
            <p className="text-gray-300 text-lg">
              Manage and execute your prompt chains
            </p>
          </div>
          <button
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
            onClick={() => navigate("/chains/new")}
          >
            + Create New Chain
          </button>
        </div>

        {chains.length == 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-6">
              No chains yet. Create your first workflow!
            </div>
            <button
              onClick={() => navigate("/chains/new")}
              className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-lg"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {chains.map((chain) => (
              <Link
                key={chain.id}
                to={`/chains/${chain.id}`}
                className="block bg-gray-900 bg-opacity-60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800 hover:bg-opacity-80 hover:border-teal-700 transition-all hover:shadow-2xl group"
              >
                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-teal-400 transition-colors">
                  {chain.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {chain.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
