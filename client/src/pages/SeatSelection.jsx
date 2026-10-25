import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTheatre } from '../data/movies.js';
import { MAX_SEATS, calcTotals, priceOfSeat } from '../data/seats.js';
import { currency, formatDate, isPast, isUpcoming, movieSnapshot } from '../data/helpers.js';
import { makeShowKey, useBooking } from '../context/BookingContext.jsx';
import { useMovie } from '../context/MoviesContext.jsx';
import SeatGrid from '../components/SeatGrid.jsx';

export default function SeatSelection() {
  const { movieId, theatreId, date, time: rawTime } = useParams();
  const time = decodeURIComponent(rawTime);
  const navigate = useNavigate();
  const { getTakenSeats, startCheckout } = useBooking();
  const { movie, loading } = useMovie(movieId);

  const theatre = getTheatre(theatreId);
  const showKey = makeShowKey(movieId, theatreId, date, time);
  const taken = useMemo(() => getTakenSeats(showKey), [getTakenSeats, showKey]);

  const [selected, setSelected] = useState([]);
  const [notice, setNotice] = useState('');

  if (loading) {
    return (
      <div className="container section" aria-busy="true">
        <div className="skeleton" style={{ height: 420, borderRadius: 14 }} />
      </div>
    );
  }

  if (!movie || !theatre) {
    return (
      <div className="container empty-state">
        <p>This show could not be found.</p>
        <Link to="/" className="btn btn-primary">
          Back to movies
        </Link>
      </div>
    );
  }

  if (isUpcoming(movie)) {
    return (
      <div className="container empty-state">
        <p>Bookings for this movie haven’t opened yet.</p>
        <Link to={`/movie/${movie.id}`} className="btn btn-primary">
          Back to movie
        </Link>
      </div>
    );
  }

  const toggle = (id) => {
    setNotice('');
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_SEATS) {
        setNotice(`You can book up to ${MAX_SEATS} seats at a time.`);
        return prev;
      }
      return [...prev, id].sort((a, b) =>
        a[0] === b[0] ? Number(a.slice(1)) - Number(b.slice(1)) : a.localeCompare(b)
      );
    });
  };

  const { subtotal, fee, total } = calcTotals(selected);
  const expired = isPast(date, time);

  const proceed = () => {
    startCheckout({
      showKey,
      movieId: movie.id,
      movie: movieSnapshot(movie),
      theatreId,
      date,
      time,
      seats: selected,
      subtotal,
      fee,
      total,
    });
    // /checkout is protected: guests are sent to log in and then brought back here.
    navigate('/checkout');
  };

  return (
    <div className="container section">
      <Link to={`/movie/${movie.id}`} className="back-link">
        ← Back to showtimes
      </Link>
      <div className="show-header">
        <h1 className="display">{movie.title}</h1>
        <p className="muted">
          {theatre.name}, {theatre.area} · {formatDate(date)} · {time}
        </p>
      </div>

      {expired && <div className="alert">This show has already started. Please pick another time.</div>}

      <div className="seat-layout">
        <div className="card">
          <SeatGrid taken={taken} selected={selected} onToggle={toggle} />
        </div>

        <aside className="card summary">
          <h3>Your selection</h3>
          {selected.length === 0 ? (
            <p className="muted">Tap seats on the map to select them.</p>
          ) : (
            <ul className="summary-list">
              {selected.map((s) => (
                <li key={s}>
                  <span>Seat {s}</span>
                  <span>{currency(priceOfSeat(s))}</span>
                </li>
              ))}
            </ul>
          )}
          {notice && <p className="error-text">{notice}</p>}

          <div className="totals">
            <div>
              <span>Tickets ({selected.length})</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div>
              <span>Convenience fee</span>
              <span>{currency(fee)}</span>
            </div>
            <div className="grand">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block"
            disabled={selected.length === 0 || expired}
            onClick={proceed}
          >
            Proceed to pay {selected.length > 0 && currency(total)}
          </button>
        </aside>
      </div>
    </div>
  );
}
