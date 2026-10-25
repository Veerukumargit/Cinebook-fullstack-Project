# CineBook – Frontend (client)

React 18 + Vite frontend for CineBook. This is one half of the project — see the
**root `README.md`** (one folder up) for full setup instructions covering both
`client/` and `server/`.

## Quick start

```bash
npm install
cp .env.example .env     # VITE_API_BASE_URL — defaults to http://localhost:5000
npm run dev                # http://localhost:5173
npm run build               # production build in /dist
```

The backend (`../server`) must be running for login, bookings, watchlist and movie
data to work — see `../server/README.md`.

## Project structure

```
src/
  api/          client.js (fetch wrapper), tmdb.js, auth.js — all call the backend
  components/   HeroCarousel, Navbar, Poster, MovieCard, SeatGrid, Ticket, TrailerModal,
                FavoriteButton, RequireAuth, AuthLayout, PasswordInput, Skeleton, Footer
  context/      AuthContext, MoviesContext, BookingContext, ToastContext
  data/         movies.js (demo movies + theatres), seats.js, showtimes.js, helpers.js
  pages/        Home, MovieDetails, SeatSelection, Checkout, Confirmation,
                MyBookings, Login, Signup, Profile, Watchlist
  index.css, extra.css
```

`src/api/auth.js` keeps the same function signatures the original localStorage-only
demo used — `AuthContext` and the pages call it the same way; only what happens
underneath (real API calls instead of localStorage) changed.
