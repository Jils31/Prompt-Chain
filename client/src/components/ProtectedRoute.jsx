// components/ProtectedRoute.jsx
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-teal-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}