import mongoose from 'mongoose';

// One document per (showKey, seat). The unique compound index is what
// actually prevents two people from ever booking the same seat at the same
// time, even under concurrent requests — Mongo rejects the second insert.
const bookedSeatSchema = new mongoose.Schema({
  showKey: { type: String, required: true },
  seat: { type: String, required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
});

bookedSeatSchema.index({ showKey: 1, seat: 1 }, { unique: true });

export const BookedSeat = mongoose.model('BookedSeat', bookedSeatSchema);
