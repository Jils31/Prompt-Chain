import { useMutation } from '@tanstack/react-query';
import { runChain } from '../api/execute';

export default function ChainRunButton({ chainId, onResult }) {
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
