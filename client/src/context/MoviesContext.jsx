import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { movies as sampleMovies, upcomingMovies as sampleUpcoming } from '../data/movies.js';
import { hasTmdb, fetchNowPlaying, fetchUpcoming, fetchMovieDetails } from '../api/tmdb.js';

const MoviesContext = createContext(null);

const NOW_KEY = 'cinebook.movies.cache.v1';
const UP_KEY = 'cinebook.upcoming.cache.v1';
const CACHE_TTL = 15 * 60 * 1000;

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, list } = JSON.parse(raw);
    return Date.now() - at < CACHE_TTL ? list : null;
  } catch {
    return null;
  }
}

function writeCache(key, list) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), list }));
  } catch {
    /* ignore */
  }
}

export function MoviesProvider({ children }) {
  const [state, setState] = useState(() => {
    if (!hasTmdb) return { movies: sampleMovies, loading: false, error: null, source: 'sample' };
    const cached = readCache(NOW_KEY);
    return cached
      ? { movies: cached, loading: false, error: null, source: 'tmdb' }
      : { movies: [], loading: true, error: null, source: 'tmdb' };
  });

  const [soon, setSoon] = useState(() => {
    if (!hasTmdb) return { list: sampleUpcoming, loading: false };
    const cached = readCache(UP_KEY);
    return cached ? { list: cached, loading: false } : { list: [], loading: true };
  });

  const details = useRef(new Map());

  // Now playing
  useEffect(() => {
    if (!hasTmdb || !state.loading) return undefined;
    let cancelled = false;
    fetchNowPlaying()
      .then((list) => {
        if (cancelled) return;
        writeCache(NOW_KEY, list);
        setState({ movies: list, loading: false, error: null, source: 'tmdb' });
      })
      .catch((e) => {
        if (cancelled) return;
        setState({ movies: sampleMovies, loading: false, error: e.message, source: 'sample' });
      });
    return () => {
      cancelled = true;
    };
  }, [state.loading]);

  // Coming soon (a failure here just hides the section)
  useEffect(() => {
    if (!hasTmdb || !soon.loading) return undefined;
    let cancelled = false;
    fetchUpcoming()
      .then((list) => {
        if (cancelled) return;
        writeCache(UP_KEY, list);
        setSoon({ list, loading: false });
      })
      .catch(() => {
        if (!cancelled) setSoon({ list: [], loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [soon.loading]);

  const getMovie = useCallback(
    (id) => {
      id = String(id);
      return (
        details.current.get(id) ||
        state.movies.find((m) => m.id === id) ||
        soon.list.find((m) => m.id === id) ||
        sampleMovies.find((m) => m.id === id) ||
        sampleUpcoming.find((m) => m.id === id) ||
        null
      );
    },
    [state.movies, soon.list]
  );

  const loadDetails = useCallback(async (id) => {
    id = String(id);
    const cached = details.current.get(id);
    if (cached) return cached;
    const sample = sampleMovies.find((m) => m.id === id) || sampleUpcoming.find((m) => m.id === id);
    if (sample) return sample;
    if (!hasTmdb) return null;
    const d = await fetchMovieDetails(id);
    details.current.set(id, d);
    return d;
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      upcoming: soon.list,
      upcomingLoading: soon.loading,
      getMovie,
      loadDetails,
    }),
    [state, soon, getMovie, loadDetails]
  );
  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error('useMovies must be used inside <MoviesProvider>');
  return ctx;
}

/** One movie by id: instant from the list if available, then enriched with full details. */
export function useMovie(id) {
  const { getMovie, loadDetails, loading: listLoading } = useMovies();
  const [detailed, setDetailed] = useState(null);
  const [failed, setFailed] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    setFetching(true);
    loadDetails(id)
      .then((d) => alive && setDetailed(d))
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setFetching(false));
    return () => {
      alive = false;
    };
  }, [id, loadDetails]);

  const movie = (detailed && detailed.id === String(id) ? detailed : null) || getMovie(id);
  return { movie, loading: !movie && (listLoading || fetching) && !failed };
}
