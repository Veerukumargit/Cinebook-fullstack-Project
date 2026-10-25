# CineBook – Movie Ticket Booking

A full-stack movie ticket booking app: **React 18 + Vite** frontend (`/client`), backed by a
real **Node/Express + MongoDB** API (`/server`).

## Project layout

```
cinebook/
  client/         the React app (frontend)
  server/         the API: auth, users, bookings, TMDB proxy (see server/README.md)
```

## Getting started

You need two terminals — one for the API, one for the frontend.

**1. Backend**

```bash
cd server
npm install
cp .env.example .env     # fill in MONGODB_URI, JWT_SECRET, TMDB_API_KEY (see server/README.md)
npm run dev               # http://localhost:5000
```

**2. Frontend**

```bash
cd client
npm install
cp .env.example .env     # defaults to http://localhost:5000, change if your API runs elsewhere
npm run dev               # http://localhost:5173
npm run build             # production build in client/dist
```

Requires Node.js 18+ and a MongoDB database (local, or a free MongoDB Atlas cluster).

## Features

- **Full-screen hero carousel** (100vh) with backdrops, auto-play, progress dots, arrows, keyboard and pause-on-hover
- **Real movie data and images** from the TMDB API, proxied through the backend (now playing, posters, backdrops, cast, trailers)
- **Login / Signup / Profile** with validation, password strength meter, remember-me, change password — real accounts in MongoDB, sessions in an httpOnly cookie (not localStorage)
- **Protected routes** – checkout, bookings, watchlist and profile need login, and you return to where you were after logging in
- **Per-user bookings** and **watchlist**, persisted server-side
- Search + dynamic genre/language filters
- 5-day showtimes, interactive seat map, tiered pricing, 5-minute seat-hold timer
- **Seat-safe checkout** – the server rejects a seat that's already booked, even under concurrent requests, and always recomputes the price itself
- Simulated payment (UPI / Card / Net Banking) — swap in a real gateway when ready, printable ticket with QR-style code, cancellations
- Trailer modal, toast notifications, skeleton loaders, responsive dark UI

## Real movie posters (TMDB)

The frontend never talks to TMDB directly — the server does, so the API key never ships
in the browser bundle.

1. Create a free account at https://www.themoviedb.org and open **Settings → API**.
2. Copy either the **API Key (v3)** or the **API Read Access Token (v4, starts with `eyJ`)**.
3. Put it in `server/.env`:
   ```
   TMDB_API_KEY=your_key_here
   ```
4. Restart the backend (`npm run dev` in `/server`).

With a key, the home page loads movies currently playing in India, with real posters/backdrops, and detail pages load cast, director, certificate and trailer.
Without a key (or if the request fails) the app falls back to the built-in fictional demo movies with placeholder photos, and shows a small notice.

> This product uses the TMDB API but is not endorsed or certified by TMDB. If you publish the app, show TMDB's attribution/logo as required by their terms.

## Authentication

Real accounts, stored in MongoDB: passwords are hashed with **bcrypt**, sessions are a
**JWT in an httpOnly cookie** set by the server (not readable or editable from the
browser console), failed logins are throttled, and "remember me" controls the cookie's
lifetime (30 days vs 1 day). See `server/README.md` for the full API reference.

## Still worth doing before a real launch

1. A real payment gateway (Razorpay, Stripe, …) wired into `client/src/pages/Checkout.jsx` + a server-side payment-verification endpoint.
2. Email verification and password reset flows.
3. A real QR generator (e.g. `qrcode.react`) instead of the decorative pattern in `Ticket.jsx`.
4. Rate-limit/alerting on the production deployment, and a managed MongoDB (Atlas) with backups.
