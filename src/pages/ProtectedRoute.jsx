import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { loading, loggedIn } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;

  return loggedIn ? children : <Navigate to="/login" />;
}
