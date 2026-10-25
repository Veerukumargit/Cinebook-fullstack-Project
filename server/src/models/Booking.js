import mongoose from 'mongoose';

const movieSnapshotSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: String,
    poster: String,
    backdrop: String,
    certificate: String,
    duration: String,
    genres: [String],
    languages: [String],
    rating: Number,
    colors: [String],
    accent: String,
    emoji: String,
    dark: Boolean,
    source: String,
    releaseDate: String,
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  { name: String, email: String, phone: String },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true }, // public "CB..." id
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    showKey: { type: String, required: true, index: true },
    movieId: { type: String, required: true },
    movie: { type: movieSnapshotSchema, required: true },
    theatreId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true },

    seats: { type: [String], required: true },
    subtotal: { type: Number, required: true },
    fee: { type: Number, required: true },
    total: { type: Number, required: true },

    customer: { type: customerSchema, required: true },
    paymentMethod: { type: String, enum: ['upi', 'card', 'netbanking'], required: true },

    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed', index: true },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

bookingSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.bookingId,
    userId: this.user.toString(),
    showKey: this.showKey,
    movieId: this.movieId,
    movie: this.movie,
    theatreId: this.theatreId,
    date: this.date,
    time: this.time,
    seats: this.seats,
    subtotal: this.subtotal,
    fee: this.fee,
    total: this.total,
    customer: this.customer,
    paymentMethod: this.paymentMethod,
    status: this.status,
    bookedAt: this.bookedAt,
  };
};

export const Booking = mongoose.model('Booking', bookingSchema);
