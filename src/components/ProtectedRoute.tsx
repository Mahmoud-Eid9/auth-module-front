import { useState, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { refresh } from '../api/auth';

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { token, setToken } = useAuth();
  const [loading, setLoading] = useState(true); // for async refresh
  const [authorized, setAuthorized] = useState(false);

    const checkAuth = async () => {
      if (token) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      try {
        const { data } = await refresh();
        setToken(data.newAccessToken);
        setAuthorized(true);
      } catch (err) {
        console
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    checkAuth();
  }, []);

  

  if (loading) return <p>Loading...</p>;

  if (!authorized) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
