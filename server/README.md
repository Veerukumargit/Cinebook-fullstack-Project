# CineBook API

Real backend for the CineBook frontend: accounts, sessions, profile, watchlist,
seat-safe bookings and a TMDB proxy — replacing the old `localStorage`-only demo.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT in an httpOnly cookie (not `localStorage`) for sessions
- bcrypt for password hashing
- A TMDB proxy so the API key never ships to the browser

## Setup

```bash
cd server
npm install
cp .env.example .env     # then fill in MONGODB_URI, JWT_SECRET, TMDB_API_KEY, ...
npm run dev               # http://localhost:5000
```

You need a MongoDB instance — either local (`mongodb://127.0.0.1:27017/cinebook`) or a
free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster.

Generate a `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`TMDB_API_KEY` is optional — without it the app still runs, just falling back to the
built-in demo movie catalogue (same behaviour as before).

## API overview

| Method | Path                              | Auth | Description                          |
|--------|------------------------------------|------|---------------------------------------|
| POST   | `/api/auth/signup`                | –    | Create account, starts session        |
| POST   | `/api/auth/login`                 | –    | Log in, starts session                |
| POST   | `/api/auth/logout`                | –    | Clears session                        |
| GET    | `/api/auth/me`                    | ✓    | Current user                          |
| PATCH  | `/api/users/me`                   | ✓    | Update name/phone                     |
| PATCH  | `/api/users/me/password`          | ✓    | Change password                       |
| POST   | `/api/users/me/favorites/toggle`  | ✓    | Add/remove a watchlist movie          |
| GET    | `/api/movies/config`              | –    | `{ hasTmdb }`                         |
| GET    | `/api/movies/now-playing`         | –    | TMDB now-playing, normalized          |
| GET    | `/api/movies/upcoming`            | –    | TMDB upcoming, normalized             |
| GET    | `/api/movies/:id`                 | –    | TMDB movie details, normalized        |
| GET    | `/api/bookings/taken/:showKey`    | –    | Seats already taken for a show        |
| GET    | `/api/bookings`                   | ✓    | My bookings                           |
| POST   | `/api/bookings`                   | ✓    | Create a booking (seat-locked)        |
| POST   | `/api/bookings/:id/cancel`        | ✓    | Cancel my booking, release seats      |

Seat double-booking is prevented at the database layer: each booked seat is a document
in a `(showKey, seat)`-unique collection, so a concurrent request for the same seat is
rejected by MongoDB itself, not just application logic. Prices are always recomputed
server-side from the seat tiers — the client's totals are never trusted.

## Production notes

- Set `COOKIE_SECURE=true` once served over HTTPS.
- Set `CLIENT_ORIGIN` to your deployed frontend URL(s) (comma-separated for more than one).
- Consider a managed Mongo (Atlas) and a process manager (pm2) or container for deploys.
