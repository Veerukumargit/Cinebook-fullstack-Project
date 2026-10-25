import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import PasswordInput from '../components/PasswordInput.jsx';

export default function Profile() {
  const { user, updateProfile, changePassword, logout, favorites } = useAuth();
  const { bookings } = useBooking();
  const toast = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user.name, phone: user.phone });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [profileError, setProfileError] = useState('');
  const [pwError, setPwError] = useState('');
  const [busy, setBusy] = useState('');

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setBusy('profile');
    try {
      await updateProfile(profile);
      toast.success('Profile updated');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setBusy('');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pw.next !== pw.confirm) {
      setPwError('New passwords do not match');
      return;
    }
    setBusy('pw');
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: '', next: '', confirm: '' });
      toast.success('Password changed');
    } catch (err) {
      setPwError(err.message);
    } finally {
      setBusy('');
    }
  };

  const onLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/');
  };

  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const since = new Date(user.createdAt).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container section">
      <div className="profile-head">
        <div className="avatar big" aria-hidden="true">
          {user.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0].toUpperCase())
            .join('')}
        </div>
        <div>
          <h1 className="display">{user.name}</h1>
          <p className="muted">
            {user.email} · Member since {since}
          </p>
        </div>
        <button className="btn btn-danger" onClick={onLogout}>
          Log out
        </button>
      </div>

      <div className="stat-row">
        <div className="card stat">
          <strong>{confirmed}</strong>
          <span className="muted">Active bookings</span>
        </div>
        <div className="card stat">
          <strong>{bookings.length}</strong>
          <span className="muted">Total bookings</span>
        </div>
        <div className="card stat">
          <strong>{favorites.length}</strong>
          <span className="muted">In watchlist</span>
        </div>
      </div>

      <div className="profile-grid">
        <form className="card" onSubmit={saveProfile} noValidate>
          <h3>Personal details</h3>
          {profileError && <div className="alert">{profileError}</div>}
          <div className="form-grid one">
            <label className="field">
              <span>Full name</span>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </label>
            <label className="field">
              <span>Email (cannot be changed)</span>
              <input className="input" value={user.email} disabled />
            </label>
            <label className="field">
              <span>Mobile number</span>
              <input
                className="input"
                inputMode="numeric"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                }
              />
            </label>
          </div>
          <button className="btn btn-primary" disabled={busy === 'profile'}>
            {busy === 'profile' ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <form className="card" onSubmit={savePassword} noValidate>
          <h3>Change password</h3>
          {pwError && <div className="alert">{pwError}</div>}
          <div className="form-grid one">
            <label className="field">
              <span>Current password</span>
              <PasswordInput
                autoComplete="current-password"
                value={pw.current}
                onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
              />
            </label>
            <label className="field">
              <span>New password</span>
              <PasswordInput
                autoComplete="new-password"
                value={pw.next}
                onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
              />
            </label>
            <label className="field">
              <span>Confirm new password</span>
              <PasswordInput
                autoComplete="new-password"
                value={pw.confirm}
                onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
              />
            </label>
          </div>
          <button className="btn btn-primary" disabled={busy === 'pw'}>
            {busy === 'pw' ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
