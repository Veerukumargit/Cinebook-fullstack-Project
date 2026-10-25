import { useState } from 'react';

export default function Poster({ movie, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const [c1, c2] = movie.colors || ['#222', '#444'];
  const light = movie.dark === false;
  const showImage = movie.poster && !failed;

  return (
    <div
      className={`poster poster-${size}`}
      style={{
        background: `linear-gradient(160deg, ${c1}, ${c2})`,
        color: light && !showImage ? '#3b1220' : '#fff',
      }}
      role="img"
      aria-label={`Poster for ${movie.title}`}
    >
      {showImage ? (
        <>
          <img
            className="poster-img"
            src={movie.poster}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
          />
          {movie.source === 'sample' && (
            <div className="poster-caption">
              <span className="display">{movie.title}</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="poster-glow" style={{ background: movie.accent }} />
          <span className="poster-emoji">{movie.emoji || '🎬'}</span>
          <span className="poster-title display">{movie.title}</span>
        </>
      )}
    </div>
  );
}
