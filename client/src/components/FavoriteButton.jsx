import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { movieSnapshot } from '../data/helpers.js';

export default function FavoriteButton({ movie, variant = 'card' }) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const active = isFavorite(movie.id);

  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login', {
        state: { from: location, message: 'Log in to save movies to your watchlist.' },
      });
      return;
    }
    try {
      const nowSaved = await toggleFavorite(movieSnapshot(movie));
      toast.success(nowSaved ? `Added “${movie.title}” to watchlist` : 'Removed from watchlist');
    } catch (err) {
      toast.error(err.message || 'Could not update your watchlist');
    }
  };

  return (
    <button
      type="button"
      className={`fav-btn ${variant} ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
      title={active ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="fav-icon">
        <path
          d="M12 20.5l-1.2-1.1C5.6 14.7 2.5 11.9 2.5 8.4 2.5 5.6 4.7 3.5 7.4 3.5c1.6 0 3.1.7 4.1 1.9l.5.6.5-.6c1-1.2 2.5-1.9 4.1-1.9 2.7 0 4.9 2.1 4.9 4.9 0 3.5-3.1 6.3-8.3 11l-1.2 1.1z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {variant === 'inline' && <span>{active ? 'In watchlist' : 'Add to watchlist'}</span>}
    </button>
  );
}
