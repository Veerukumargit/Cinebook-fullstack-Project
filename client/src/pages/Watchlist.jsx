import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import MovieCard from '../components/MovieCard.jsx';

export default function Watchlist() {
  const { favorites } = useAuth();

  return (
    <div className="container section">
      <h1 className="display">My Watchlist</h1>
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>Tap the heart on any movie to save it here.</p>
          <Link to="/" className="btn btn-primary">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="movie-grid" style={{ marginTop: '1.2rem' }}>
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}
