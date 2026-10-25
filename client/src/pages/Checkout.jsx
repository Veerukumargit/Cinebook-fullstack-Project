import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getTheatre } from '../data/movies.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { currency, formatDate } from '../data/helpers.js';
import { useBooking } from '../context/BookingContext.jsx';

const HOLD_SECONDS = 5 * 60;

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Card' },
  { id: 'netbanking', label: 'Net Banking' },
];

function validate(form, method) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Enter your full name';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit mobile number';

  if (method === 'upi' && !/^[\w.\-]{2,}@[\w]{2,}$/.test(form.upi)) {
    errors.upi = 'Enter a valid UPI ID (e.g. name@bank)';
  }
  if (method === 'card') {
    if (!/^\d{16}$/.test(form.card.replace(/\s/g, ''))) errors.card = 'Card number must be 16 digits';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) errors.expiry = 'Use MM/YY';
    if (!/^\d{3}$/.test(form.cvv)) errors.cvv = '3-digit CVV';
  }
  if (method === 'netbanking' && !form.bank) errors.bank = 'Select your bank';
  return errors;
}

export default function Checkout() {
  const { pending, confirmBooking, clearPending } = useBooking();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [method, setMethod] = useState('upi');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    upi: '',
    card: '',
    expiry: '',
    cvv: '',
    bank: '',
  });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    pending ? Math.max(0, HOLD_SECONDS - Math.floor((Date.now() - pending.startedAt) / 1000)) : 0
  );

  useEffect(() => {
    if (!pending) return undefined;
    const t = setInterval(() => {
      setSecondsLeft(Math.max(0, HOLD_SECONDS - Math.floor((Date.now() - pending.startedAt) / 1000)));
    }, 1000);
    return () => clearInterval(t);
  }, [pending]);

  if (!pending) return <Navigate to="/" replace />;

  const movie = pending.movie;
  const theatre = getTheatre(pending.theatreId);

  if (secondsLeft === 0 && !paying) {
    return (
      <div className="container empty-state">
        <h2 className="display">Session expired</h2>
        <p>Your seats were released because the payment window timed out.</p>
        <Link
          to={`/book/${pending.movieId}/${pending.theatreId}/${pending.date}/${encodeURIComponent(
            pending.time
          )}`}
          className="btn btn-primary"
          onClick={clearPending}
        >
          Pick seats again
        </Link>
      </div>
    );
  }

  const set = (key) => (e) => {
    let value = e.target.value;
    if (key === 'phone') value = value.replace(/\D/g, '').slice(0, 10);
    if (key === 'card') value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (key === 'cvv') value = value.replace(/\D/g, '').slice(0, 3);
    if (key === 'expiry') {
      value = value.replace(/[^\d]/g, '').slice(0, 4);
      if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const v = validate(form, method);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setPaying(true);
    // Simulated payment gateway – replace with a real integration.
    setTimeout(async () => {
      try {
        const booking = await confirmBooking({
          customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone },
          paymentMethod: method,
        });
        toast.success('Payment successful – enjoy the show!');
        navigate(`/confirmation/${booking.id}`, { replace: true });
      } catch (err) {
        setPaying(false);
        toast.error(err.message || 'Payment could not be completed. Please try again.');
      }
    }, 1600);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const field = (key, label, props = {}) => (
    <label className="field">
      <span>{label}</span>
      <input
        className={`input ${errors[key] ? 'invalid' : ''}`}
        value={form[key]}
        onChange={set(key)}
        {...props}
      />
      {errors[key] && <small className="error-text">{errors[key]}</small>}
    </label>
  );

  return (
    <div className="container section">
      <h1 className="display">Checkout</h1>
      <div className={`timer ${secondsLeft < 60 ? 'urgent' : ''}`}>
        Seats held for <strong>{mm}:{ss}</strong>
      </div>

      <div className="seat-layout">
        <form className="card" onSubmit={submit} noValidate>
          <h3>Contact details</h3>
          <div className="form-grid">
            {field('name', 'Full name', { autoComplete: 'name', placeholder: 'Your name' })}
            {field('email', 'Email', {
              type: 'email',
              autoComplete: 'email',
              placeholder: 'you@example.com',
            })}
            {field('phone', 'Mobile number', {
              inputMode: 'numeric',
              autoComplete: 'tel',
              placeholder: '10-digit number',
            })}
          </div>

          <h3>Payment</h3>
          <div className="chips" role="tablist">
            {PAYMENT_METHODS.map((m) => (
              <button
                type="button"
                key={m.id}
                role="tab"
                aria-selected={method === m.id}
                className={`chip ${method === m.id ? 'active' : ''}`}
                onClick={() => {
                  setMethod(m.id);
                  setErrors({});
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="form-grid">
            {method === 'upi' && field('upi', 'UPI ID', { placeholder: 'name@bank' })}
            {method === 'card' && (
              <>
                {field('card', 'Card number', { inputMode: 'numeric', placeholder: '0000 0000 0000 0000' })}
                {field('expiry', 'Expiry (MM/YY)', { placeholder: 'MM/YY' })}
                {field('cvv', 'CVV', { inputMode: 'numeric', placeholder: '123', type: 'password' })}
              </>
            )}
            {method === 'netbanking' && (
              <label className="field">
                <span>Bank</span>
                <select
                  className={`input ${errors.bank ? 'invalid' : ''}`}
                  value={form.bank}
                  onChange={set('bank')}
                >
                  <option value="">Select bank</option>
                  <option>Demo Bank of India</option>
                  <option>Sample National Bank</option>
                  <option>Example Co-operative Bank</option>
                </select>
                {errors.bank && <small className="error-text">{errors.bank}</small>}
              </label>
            )}
          </div>

          <p className="muted small-note">
            Demo only – no real payment is taken. Enter any valid-looking details.
          </p>

          <button className="btn btn-primary btn-block" disabled={paying}>
            {paying ? 'Processing payment…' : `Pay ${currency(pending.total)}`}
          </button>
        </form>

        <aside className="card summary">
          <h3>Order summary</h3>
          <p className="summary-title">{movie.title}</p>
          <p className="muted">
            {theatre.name}, {theatre.area}
          </p>
          <p className="muted">
            {formatDate(pending.date)} · {pending.time}
          </p>
          <p>
            <strong>Seats:</strong> {pending.seats.join(', ')}
          </p>
          <div className="totals">
            <div>
              <span>Tickets ({pending.seats.length})</span>
              <span>{currency(pending.subtotal)}</span>
            </div>
            <div>
              <span>Convenience fee</span>
              <span>{currency(pending.fee)}</span>
            </div>
            <div className="grand">
              <span>Total</span>
              <span>{currency(pending.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
