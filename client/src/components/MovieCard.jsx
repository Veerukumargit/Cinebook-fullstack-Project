import { Link } from 'react-router-dom';
import Poster from './Poster.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { isUpcoming, formatShortDate } from '../data/helpers.js';

export default function MovieCard({ movie }) {
  const soon = isUpcoming(movie);
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-card-poster">
          <Poster movie={movie} />
          <span className="cert">{movie.certificate}</span>
          {soon ? (
            <span className="rating-pill soon">📅 {formatShortDate(movie.releaseDate)}</span>
          ) : (
            movie.rating > 0 && <span className="rating-pill">★ {movie.rating}</span>
          )}
        </div>
        <div className="movie-card-body">
          <h3>{movie.title}</h3>
          <p className="muted">{(movie.genres || []).join(' • ')}</p>
        </div>
      </Link>
      <FavoriteButton movie={movie} />
    </div>
  );
}
