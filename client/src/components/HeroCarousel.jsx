import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Poster from './Poster.jsx';

const INTERVAL = 6500;

export default function HeroCarousel({ movies, loading }) {
  const slides = useMemo(() => movies.slice(0, 5), [movies]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const reduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const go = useCallback((i) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || reduced || slides.length < 2) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(t);
  }, [paused, reduced, slides.length, index]);

  if (loading || slides.length === 0) {
    return (
      <section className="hero-full hero-loading" aria-busy="true" aria-label="Loading featured movies">
        <div className="container hero-content-wrap">
          <div className="hero-content">
            <div className="skeleton sk-line" style={{ width: 120 }} />
            <div className="skeleton" style={{ height: 90, width: 'min(520px,80%)', marginBlock: 16 }} />
            <div className="skeleton sk-line" style={{ width: 'min(420px,70%)' }} />
          </div>
        </div>
      </section>
    );
  }

  const current = slides[index];

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(index + 1);
    if (e.key === 'ArrowLeft') go(index - 1);
  };

  const meta = [
    (current.genres || []).join(' • '),
    current.duration,
    current.year,
    current.rating > 0 ? `★ ${current.rating}` : '',
  ].filter(Boolean);

  return (
    <section
      className="hero-full"
      aria-roledescription="carousel"
      aria-label="Featured movies"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      {slides.map((m, i) => (
        <div
          key={m.id}
          className={`hero-slide ${i === index ? 'active' : ''}`}
          aria-hidden={i !== index}
          style={{ background: `linear-gradient(120deg, ${m.colors[0]}, ${m.colors[1]})` }}
        >
          {(m.backdrop || m.poster) && (
            <img
              src={m.backdrop || m.poster}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      ))}
      <div className="hero-overlay" />

      <div className="container hero-content-wrap">
        <div className="hero-grid">
          <div className="hero-content" key={current.id}>
            <p className="eyebrow">
              Now showing · {index + 1} / {slides.length}
            </p>
            <h1 className="display hero-title">{current.title}</h1>
            {current.tagline && <p className="hero-tagline">{current.tagline}</p>}
            <p className="hero-meta">
              <span className="tag">{current.certificate}</span>
              {meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </p>
            <p className="hero-synopsis">{current.synopsis}</p>
            <div className="hero-actions">
              <Link to={`/movie/${current.id}`} className="btn btn-primary btn-lg">
                🎟️ Book tickets
              </Link>
              <Link to={`/movie/${current.id}`} className="btn btn-ghost btn-lg glass">
                More info
              </Link>
            </div>
          </div>

          <Link to={`/movie/${current.id}`} className="hero-poster-card" tabIndex={-1} aria-hidden="true">
            <Poster movie={current} size="lg" />
          </Link>
        </div>
      </div>

      <div className="hero-controls">
        <div className="container hero-controls-inner">
          <div className="hero-dots" role="tablist" aria-label="Choose slide">
            {slides.map((m, i) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${m.title}`}
                className={`hero-dot ${i === index ? 'active' : ''}`}
                onClick={() => go(i)}
              >
                <span
                  className="fill"
                  style={{ animationPlayState: paused ? 'paused' : 'running' }}
                />
              </button>
            ))}
          </div>
          <div className="hero-arrows">
            <button className="arrow-btn" onClick={() => go(index - 1)} aria-label="Previous slide">
              ‹
            </button>
            <button className="arrow-btn" onClick={() => go(index + 1)} aria-label="Next slide">
              ›
            </button>
          </div>
        </div>
      </div>

      <a href="#movies" className="hero-scroll" aria-label="Scroll to movies">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
