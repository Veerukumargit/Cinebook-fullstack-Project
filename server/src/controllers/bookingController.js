import { Booking } from '../models/Booking.js';
import { BookedSeat } from '../models/BookedSeat.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { seededTakenSeats } from '../utils/showtimeSeed.js';
import { isValidSeatId, MAX_SEATS, calcTotals } from '../utils/seatPricing.js';
import { makeBookingId } from '../utils/bookingId.js';

/** Real (DB-backed) taken seats for a show, on top of the deterministic demo ones. */
async function dbTakenSeats(showKey) {
  const rows = await BookedSeat.find({ showKey }).select('seat').lean();
  return rows.map((r) => r.seat);
}

export const takenSeats = asyncHandler(async (req, res) => {
  const { showKey } = req.params;
  const real = await dbTakenSeats(showKey);
  const seeded = seededTakenSeats(showKey);
  res.json({ seats: [...new Set([...seeded, ...real])] });
});

export const listMine = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ bookedAt: -1 });
  res.json({ bookings: bookings.map((b) => b.toPublicJSON()) });
});

export const create = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const { showKey, movieId, movie, theatreId, date, time, seats, customer, paymentMethod } = body;

  if (!showKey || !movieId || !movie?.id || !theatreId || !date || !time) {
    throw ApiError.badRequest('Missing booking details');
  }
  if (!Array.isArray(seats) || seats.length === 0) throw ApiError.badRequest('Select at least one seat');
  if (seats.length > MAX_SEATS) throw ApiError.badRequest(`You can book up to ${MAX_SEATS} seats at a time.`);
  if (!seats.every(isValidSeatId)) throw ApiError.badRequest('One or more seat numbers are invalid');
  if (new Set(seats).size !== seats.length) throw ApiError.badRequest('Duplicate seats selected');

  if (!['upi', 'card', 'netbanking'].includes(paymentMethod)) {
    throw ApiError.badRequest('Invalid payment method');
  }
  const name = (customer?.name || '').trim();
  const email = (customer?.email || '').trim();
  const phone = customer?.phone || '';
  if (name.length < 2) throw ApiError.badRequest('Enter your full name');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw ApiError.badRequest('Enter a valid email');
  if (!/^[6-9]\d{9}$/.test(phone)) throw ApiError.badRequest('Enter a valid 10-digit mobile number');

  // Reject seats the seat map already shows as taken (demo pre-booked seats).
  const seeded = new Set(seededTakenSeats(showKey));
  const seededClash = seats.filter((s) => seeded.has(s));
  if (seededClash.length) {
    throw ApiError.conflict('Some selected seats were just booked by someone else.', {
      seats: seededClash,
    });
  }

  // Prices are always computed server-side from the live tier table —
  // never trusted from the client.
  const { subtotal, fee, total } = calcTotals(seats);

  const bookingId = makeBookingId();
  const bookingDoc = new Booking({
    bookingId,
    user: req.user._id,
    showKey,
    movieId: String(movieId),
    movie,
    theatreId,
    date,
    time,
    seats,
    subtotal,
    fee,
    total,
    customer: { name, email, phone },
    paymentMethod,
    status: 'confirmed',
    bookedAt: new Date(),
  });

  // Atomically claim every seat first — the unique (showKey, seat) index is
  // what actually stops a double-booking race. If any seat is already taken
  // this insert fails and nothing is reserved.
  const seatDocs = seats.map((seat) => ({ showKey, seat, booking: bookingDoc._id }));
  try {
    await BookedSeat.insertMany(seatDocs, { ordered: true });
  } catch (err) {
    if (err?.code === 11000) {
      // Roll back any seats from this attempt that did get inserted before the clash.
      await BookedSeat.deleteMany({ showKey, seat: { $in: seats }, booking: bookingDoc._id });
      const stillTaken = await dbTakenSeats(showKey);
      const clash = seats.filter((s) => stillTaken.includes(s));
      throw ApiError.conflict('Some selected seats were just booked by someone else.', {
        seats: clash.length ? clash : seats,
      });
    }
    throw err;
  }

  try {
    await bookingDoc.save();
  } catch (err) {
    // Booking failed to save after seats were claimed — release them.
    await BookedSeat.deleteMany({ booking: bookingDoc._id });
    throw err;
  }

  res.status(201).json({ booking: bookingDoc.toPublicJSON() });
});

export const cancel = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ bookingId: req.params.id, user: req.user._id });
  if (!booking) throw ApiError.notFound('Booking not found');
  if (booking.status === 'cancelled') {
    return res.json({ booking: booking.toPublicJSON() });
  }

  booking.status = 'cancelled';
  await booking.save();
  await BookedSeat.deleteMany({ booking: booking._id }); // release the seats

  res.json({ booking: booking.toPublicJSON() });
});
