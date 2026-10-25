import { useRef } from 'react';
import { useMovies } from '../context/MoviesContext.jsx';
import MovieCard from './MovieCard.jsx';

export default function ComingSoon() {
  const { upcoming, upcomingLoading } = useMovies();
  const rowRef = useRef(null);

  if (!upcomingLoading && upcoming.length === 0) return null;

  const scroll = (dir) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="coming-soon" aria-labelledby="coming-soon-title">
      <div className="container section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Mark your calendar</p>
            <h2 id="coming-soon-title" className="display">
              Coming Soon
            </h2>
            <p className="muted">Tap the heart to save upcoming releases to your watchlist.</p>
          </div>
          <div className="row-arrows">
            <button className="arrow-btn dark" onClick={() => scroll(-1)} aria-label="Scroll left">
              ‹
            </button>
            <button className="arrow-btn dark" onClick={() => scroll(1)} aria-label="Scroll right">
              ›
            </button>
          </div>
        </div>

        {upcomingLoading ? (
          <div className="h-scroll" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div className="h-item" key={i}>
                <div className="skeleton sk-poster" />
                <div className="skeleton sk-line" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-scroll" ref={rowRef} tabIndex={0} aria-label="Upcoming movies">
            {upcoming.map((m) => (
              <div className="h-item" key={m.id}>
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
