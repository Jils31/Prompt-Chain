import { useMutation } from '@tanstack/react-query';
import { runChain } from '../api/execute';

export default function ChainRunButton({ chainId, onResult }) {
  // We are using this useMutation hooks already defined in the react-query
  //This is because it is easy to cache the data from the server state and also show it on the page along with inbuilt loading and error states.
  //useMutation is use to save or send the data in the backend for eg: for post,put or delete routes.
const mutation = useMutation({
  mutationFn: () => runChain(chainId),
  onSuccess: (data) => onResult(data.results),
});

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isLoading}
    >
      {mutation.isLoading ? 'Running...' : 'Run Chain'}
    </button>
  );
}
