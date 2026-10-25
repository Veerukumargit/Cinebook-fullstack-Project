import { getTheatre } from '../data/movies.js';
import { formatDate, currency } from '../data/helpers.js';
import { xmur3, mulberry32 } from '../data/seats.js';
import Poster from './Poster.jsx';

// Decorative QR-style pattern generated from the booking id (not a real QR code).
function PseudoQR({ value, size = 25 }) {
  const rand = mulberry32(xmur3(value));
  const cells = [];
  const inFinder = (x, y) => {
    const f = (ox, oy) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    return f(0, 0) || f(size - 7, 0) || f(0, size - 7);
  };
  const finderOn = (x, y, ox, oy) => {
    const dx = x - ox;
    const dy = y - oy;
    const edge = dx === 0 || dx === 6 || dy === 0 || dy === 6;
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
    return edge || core;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let on;
      if (inFinder(x, y)) {
        on =
          (x < 7 && y < 7 && finderOn(x, y, 0, 0)) ||
          (x >= size - 7 && y < 7 && finderOn(x, y, size - 7, 0)) ||
          (x < 7 && y >= size - 7 && finderOn(x, y, 0, size - 7));
      } else {
        on = rand() > 0.52;
      }
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <svg
      viewBox={`-1 -1 ${size + 2} ${size + 2}`}
      className="qr"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="-1" y="-1" width={size + 2} height={size + 2} fill="#fff" />
      <g fill="#111">{cells}</g>
    </svg>
  );
}

export default function Ticket({ booking }) {
  const movie = booking.movie;
  const theatre = getTheatre(booking.theatreId);
  if (!movie || !theatre) return null;

  return (
    <article className={`ticket ${booking.status === 'cancelled' ? 'is-cancelled' : ''}`}>
      <div className="ticket-main">
        <div className="ticket-poster">
          <Poster movie={movie} size="sm" />
        </div>
        <div className="ticket-info">
          <p className="eyebrow">Admit {booking.seats.length}</p>
          <h3 className="display">{movie.title}</h3>
          <p className="muted">
            {[movie.certificate, movie.duration, booking.language || movie.languages?.[0]]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <dl className="ticket-grid">
            <div>
              <dt>Date</dt>
              <dd>{formatDate(booking.date)}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{booking.time}</dd>
            </div>
            <div>
              <dt>Theatre</dt>
              <dd>
                {theatre.name}
                <small>{theatre.area}</small>
              </dd>
            </div>
            <div>
              <dt>Seats</dt>
              <dd>{booking.seats.join(', ')}</dd>
            </div>
            <div>
              <dt>Paid</dt>
              <dd>{currency(booking.total)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="ticket-stub">
        <PseudoQR value={booking.id} />
        <p className="booking-id">{booking.id}</p>
        {booking.status === 'cancelled' && <span className="stamp">CANCELLED</span>}
      </div>
    </article>
  );
}
