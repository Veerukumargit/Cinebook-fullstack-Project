import mongoose from 'mongoose';

// A small copy of a movie, stored inside favorites/bookings so they keep
// working even if the movie later disappears from the catalogue (mirrors the
// old frontend's movieSnapshot() shape in src/data/helpers.js).
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

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true, select: false },
    favorites: { type: [movieSnapshotSchema], default: [] },
  },
  { timestamps: true }
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    favorites: this.favorites || [],
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
