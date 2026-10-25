import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function UserMenu() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  const onLogout = () => {
    logout();
    setOpen(false);
    toast.info('You have been logged out.');
    navigate('/');
  };

  return (
    <div className="user-menu" ref={ref}>
      <button
        className="avatar"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div className="dropdown" role="menu" onClick={() => setOpen(false)}>
          <div className="dropdown-head">
            <strong>{user.name}</strong>
            <small className="muted">{user.email}</small>
          </div>
          <Link to="/" role="menuitem">
            Movies
          </Link>
          <Link to="/my-bookings" role="menuitem">
            My bookings
          </Link>
          <Link to="/watchlist" role="menuitem">
            Watchlist
          </Link>
          <Link to="/profile" role="menuitem">
            Profile
          </Link>
          <button role="menuitem" onClick={onLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const { bookings } = useBooking();
  const active = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">▶</span>
          <span className="display">CineBook</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>
            Movies
          </NavLink>
          {user && (
            <>
              <NavLink to="/my-bookings">
                My Bookings{active > 0 && <span className="badge">{active}</span>}
              </NavLink>
              <NavLink to="/watchlist">Watchlist</NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
