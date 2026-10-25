import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for the one-time "who am I" check against the server before
  // deciding to bounce to /login, so a refresh doesn't flash the login page.
  if (loading) {
    return <div className="container section" aria-busy="true" />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: 'Please log in to continue.' }}
      />
    );
  }
  return children;
}
