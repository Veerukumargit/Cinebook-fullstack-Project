import { Link, useParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import Ticket from '../components/Ticket.jsx';

export default function Confirmation() {
  const { bookingId } = useParams();
  const { bookings } = useBooking();
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <div className="container empty-state">
        <p>We couldn’t find that booking.</p>
        <Link to="/my-bookings" className="btn btn-primary">
          View my bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="success-banner no-print">
        <div className="check">✓</div>
        <div>
          <h1 className="display">Booking confirmed!</h1>
          <p className="muted">
            A confirmation has been sent to {booking.customer?.email}. Show the QR at the entrance.
          </p>
        </div>
      </div>

      <Ticket booking={booking} />

      <div className="actions no-print">
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print ticket
        </button>
        <Link to="/my-bookings" className="btn btn-ghost">
          My bookings
        </Link>
        <Link to="/" className="btn btn-ghost">
          Book another movie
        </Link>
      </div>
    </div>
  );
}
