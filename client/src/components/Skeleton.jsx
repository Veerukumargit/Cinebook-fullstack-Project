export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="movie-grid" aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <div className="skeleton sk-poster" />
          <div className="skeleton sk-line" />
          <div className="skeleton sk-line short" />
        </div>
      ))}
    </div>
  );
}
