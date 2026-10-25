import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { THEATRES } from '../data/movies.js';
import { getNextDays, isPast, isUpcoming, formatLongDate } from '../data/helpers.js';
import { useMovie } from '../context/MoviesContext.jsx';
import Poster from '../components/Poster.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import TrailerModal from '../components/TrailerModal.jsx';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading } = useMovie(id);
  const days = useMemo(() => getNextDays(5), []);
  const [date, setDate] = useState(days[0].iso);
  const [trailerOpen, setTrailerOpen] = useState(false);

  if (loading) {
    return (
      <div className="container section" aria-busy="true">
        <div className="skeleton" style={{ height: 320, borderRadius: 14 }} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container empty-state">
        <p>Movie not found.</p>
        <Link to="/" className="btn btn-primary">
          Back to movies
        </Link>
      </div>
    );
  }

  const upcoming = isUpcoming(movie);

  const goToSeats = (theatreId, time) =>
    navigate(`/book/${movie.id}/${theatreId}/${date}/${encodeURIComponent(time)}`);

  return (
    <>
      <section
        className="detail-hero"
        style={{ background: `linear-gradient(120deg, ${movie.colors[0]}, ${movie.colors[1]})` }}
      >
        {movie.backdrop && (
          <img
            className="detail-backdrop"
            src={movie.backdrop}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="detail-shade" />
        <div className="container detail-hero-inner">
          <Poster movie={movie} size="lg" />
          <div className="detail-meta">
            <Link to="/" className="back-link">
              ← All movies
            </Link>
            <h1 className="display">{movie.title}</h1>
            {movie.tagline && <p className="hero-tagline">{movie.tagline}</p>}
            <div className="meta-row">
              {movie.rating > 0 && (
                <span className="rating-pill big">
                  ★ {movie.rating} <small>({movie.votes} votes)</small>
                </span>
              )}
              <span className="tag">{movie.certificate}</span>
              {movie.duration && <span className="tag">{movie.duration}</span>}
              {movie.year && <span className="tag">{movie.year}</span>}
            </div>
            <div className="meta-row">
              {(movie.genres || []).map((g) => (
                <span key={g} className="tag outline">
                  {g}
                </span>
              ))}
              {(movie.languages || []).map((l) => (
                <span key={l} className="tag outline">
                  {l}
                </span>
              ))}
            </div>
            <div className="meta-row detail-actions">
              {movie.trailerKey && (
                <button className="btn btn-ghost glass" onClick={() => setTrailerOpen(true)}>
                  ▶ Watch trailer
                </button>
              )}
              <FavoriteButton movie={movie} variant="inline" />
            </div>
          </div>
        </div>
      </section>

      <div className="container detail-body">
        <section>
          <h2 className="display">About the movie</h2>
          <p className="synopsis">{movie.synopsis}</p>
          {(movie.director || (movie.cast && movie.cast.length > 0)) && (
            <dl className="credits">
              {movie.director && (
                <div>
                  <dt>Director</dt>
                  <dd>{movie.director}</dd>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <dt>Cast</dt>
                  <dd>{movie.cast.join(', ')}</dd>
                </div>
              )}
            </dl>
          )}
        </section>

        {upcoming ? (
          <section>
            <h2 className="display">Release date</h2>
            <div className="notice">
              <span>
                <strong>{formatLongDate(movie.releaseDate)}</strong> – bookings open once showtimes
                are announced. Add it to your watchlist so you don’t miss it.
              </span>
            </div>
          </section>
        ) : (
        <section>
          <h2 className="display">Showtimes</h2>
          <div className="date-strip" role="tablist" aria-label="Choose a date">
            {days.map((d) => (
              <button
                key={d.iso}
                role="tab"
                aria-selected={date === d.iso}
                className={`date-btn ${date === d.iso ? 'active' : ''}`}
                onClick={() => setDate(d.iso)}
              >
                <small>{d.day}</small>
                <strong>{d.date}</strong>
                <small>{d.month}</small>
              </button>
            ))}
          </div>

          <div className="theatre-list">
            {THEATRES.map((t) => {
              const times = movie.showtimes?.[t.id] || [];
              return (
                <div key={t.id} className="theatre-card">
                  <div className="theatre-head">
                    <div>
                      <h3>{t.name}</h3>
                      <p className="muted">{t.area}</p>
                    </div>
                    <div className="features">
                      {t.features.map((f) => (
                        <span key={f} className="tag outline small">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="times">
                    {times.length === 0 && <p className="muted">No shows on this date.</p>}
                    {times.map((time) => {
                      const past = isPast(date, time);
                      return (
                        <button
                          key={time}
                          className="time-btn"
                          disabled={past}
                          title={past ? 'This show has already started' : `Book ${time}`}
                          onClick={() => goToSeats(t.id, time)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        )}
      </div>

      {trailerOpen && (
        <TrailerModal
          videoKey={movie.trailerKey}
          title={movie.title}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </>
  );
}
