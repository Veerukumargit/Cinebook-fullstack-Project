import { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Home from './pages/Home.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import Watchlist from './pages/Watchlist.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="container empty-state">
      <h1 className="display">404</h1>
      <p>This reel seems to be missing.</p>
      <Link className="btn btn-primary" to="/">
        Back to movies
      </Link>
    </div>
  );
}

const protect = (el) => <RequireAuth>{el}</RequireAuth>;

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:movieId/:theatreId/:date/:time" element={<SeatSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/checkout" element={protect(<Checkout />)} />
          <Route path="/confirmation/:bookingId" element={protect(<Confirmation />)} />
          <Route path="/my-bookings" element={protect(<MyBookings />)} />
          <Route path="/watchlist" element={protect(<Watchlist />)} />
          <Route path="/profile" element={protect(<Profile />)} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
