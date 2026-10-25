import { useMemo, useState } from 'react';
import { useMovies } from '../context/MoviesContext.jsx';
import HeroCarousel from '../components/HeroCarousel.jsx';
import ComingSoon from '../components/ComingSoon.jsx';
import MovieCard from '../components/MovieCard.jsx';
import { MovieGridSkeleton } from '../components/Skeleton.jsx';

export default function Home() {
  const { movies, loading } = useMovies();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const genres = useMemo(
    () => ['All', ...new Set(movies.flatMap((m) => m.genres || []))],
    [movies]
  );
  const languages = useMemo(
    () => ['All', ...new Set(movies.flatMap((m) => m.languages || []))],
    [movies]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return movies.filter(
      (m) =>
        (genre === 'All' || (m.genres || []).includes(genre)) &&
        (language === 'All' || (m.languages || []).includes(language)) &&
        (q === '' || m.title.toLowerCase().includes(q))
    );
  }, [movies, query, genre, language]);

  return (
    <>
      <HeroCarousel movies={movies} loading={loading} />

      <section id="movies" className="container section">
        <div className="section-head">
          <h2 className="display">Now Showing</h2>
          <input
            type="search"
            className="input search"
            placeholder="Search movies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search movies"
          />
        </div>

        <div className="filters">
          <div className="chips" role="group" aria-label="Filter by genre">
            {genres.map((g) => (
              <button
                key={g}
                className={`chip ${genre === g ? 'active' : ''}`}
                onClick={() => setGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <select
            className="input select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Filter by language"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l === 'All' ? 'All languages' : l}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <MovieGridSkeleton />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No movies match your filters.</p>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setQuery('');
                setGenre('All');
                setLanguage('All');
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="movie-grid">
            {filtered.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>

      <ComingSoon />
    </>
  );
}
