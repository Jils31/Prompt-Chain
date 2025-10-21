import { useQuery } from "@tanstack/react-query";
import { getChain } from "../api/chains";
import {Link} from 'react-router-dom'

export default function ChainList() {
  const { data: chains = [], isLoading, error } = useQuery({
    queryKey: ["chains"],
    queryFn: getChain,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading chains</div>;

  return (
    <div className="p-4">
      {chains.map((chain) => (
        <div key={chain.id} className="p-2 border mb-2 rounded">
          <Link to={`/chains/${chain.id}`} className="font-bold text-blue-600">
            {chain.title}
          </Link>
          <p>{chain.description}</p>
        </div>
      ))}
    </div>
  );
}
