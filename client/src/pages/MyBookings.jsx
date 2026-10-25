import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { isPast } from '../data/helpers.js';
import Ticket from '../components/Ticket.jsx';

export default function MyBookings() {
  const { bookings, cancelBooking } = useBooking();
  const toast = useToast();

  const onCancel = async (id) => {
    if (!window.confirm('Cancel this booking? Your seats will be released.')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.message || 'Could not cancel this booking');
    }
  };

  return (
    <div className="container section">
      <h1 className="display">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven’t booked any tickets yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="ticket-list">
          {bookings.map((b) => {
            const upcoming = b.status === 'confirmed' && !isPast(b.date, b.time);
            return (
              <div key={b.id}>
                <Ticket booking={b} />
                <div className="actions">
                  {upcoming && (
                    <button className="btn btn-danger" onClick={() => onCancel(b.id)}>
                      Cancel booking
                    </button>
                  )}
                  {b.status === 'confirmed' && !upcoming && (
                    <span className="muted">Show completed</span>
                  )}
                  <Link to={`/confirmation/${b.id}`} className="btn btn-ghost">
                    View ticket
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
