import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seededTakenSeats } from '../data/seats.js';
import { api, ApiError } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const BookingContext = createContext(null);

// The in-progress checkout ("seats on hold, not paid yet") is still kept
// client-side only — nothing is reserved in the database until payment is
// confirmed, same as before.
const PENDING_KEY = 'cinebook.pending.v2';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable – ignore */
  }
}

export const makeShowKey = (movieId, theatreId, date, time) =>
  `${movieId}|${theatreId}|${date}|${time}`;

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [pending, setPending] = useState(() => load(PENDING_KEY, null));
  const [takenCache, setTakenCache] = useState({}); // showKey -> string[] from the server
  const fetchingShows = useRef(new Set());

  useEffect(() => save(PENDING_KEY, pending), [pending]);

  // Load this user's bookings from the server whenever they sign in/out.
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    let alive = true;
    api
      .get('/api/bookings')
      .then(({ bookings: list }) => alive && setBookings(list))
      .catch(() => alive && setBookings([]));
    return () => {
      alive = false;
    };
  }, [user]);

  // Drop any in-progress checkout when the user logs out.
  const prevUserId = useRef(user?.id);
  useEffect(() => {
    if (prevUserId.current && !user) setPending(null);
    prevUserId.current = user?.id;
  }, [user]);

  // Seat availability combines the deterministic demo "already booked" seats
  // (so the map looks pre-populated, matching the backend's own validation)
  // with real confirmed bookings fetched from the server.
  const getTakenSeats = useCallback(
    (showKey) => {
      if (!fetchingShows.current.has(showKey)) {
        fetchingShows.current.add(showKey);
        api
          .get(`/api/bookings/taken/${encodeURIComponent(showKey)}`)
          .then(({ seats }) => setTakenCache((prev) => ({ ...prev, [showKey]: seats })))
          .catch(() => {
            /* fall back to the demo-only seats below */
          })
          .finally(() => fetchingShows.current.delete(showKey));
      }
      const fromServer = takenCache[showKey];
      return new Set(fromServer || seededTakenSeats(showKey));
    },
    [takenCache]
  );

  const startCheckout = useCallback((data) => {
    setPending({ ...data, startedAt: Date.now() });
  }, []);

  const clearPending = useCallback(() => setPending(null), []);

  const confirmBooking = useCallback(
    async (extra) => {
      if (!pending) throw new Error('Your checkout session has expired.');
      try {
        const { booking } = await api.post('/api/bookings', {
          showKey: pending.showKey,
          movieId: pending.movieId,
          movie: pending.movie,
          theatreId: pending.theatreId,
          date: pending.date,
          time: pending.time,
          seats: pending.seats,
          ...extra,
        });
        setBookings((prev) => [booking, ...prev]);
        setTakenCache((prev) => ({
          ...prev,
          [pending.showKey]: [...new Set([...(prev[pending.showKey] || []), ...booking.seats])],
        }));
        setPending(null);
        return booking;
      } catch (err) {
        throw err instanceof ApiError ? new Error(err.message) : err;
      }
    },
    [pending]
  );

  const cancelBooking = useCallback(async (id) => {
    try {
      const { booking } = await api.post(`/api/bookings/${encodeURIComponent(id)}/cancel`);
      setBookings((prev) => prev.map((b) => (b.id === id ? booking : b)));
    } catch (err) {
      throw err instanceof ApiError ? new Error(err.message) : err;
    }
  }, []);

  const value = useMemo(
    () => ({
      bookings,
      pending,
      getTakenSeats,
      startCheckout,
      clearPending,
      confirmBooking,
      cancelBooking,
    }),
    [bookings, pending, getTakenSeats, startCheckout, clearPending, confirmBooking, cancelBooking]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
}
